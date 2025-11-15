# データベース設計書（クリーンアーキテクチャ準拠）

本設計書は、Co-Create Company Explorer のデータベース設計をクリーンアーキテクチャの原則に基づいて定義したものである。

---

## 1. 設計方針

### 1.1 クリーンアーキテクチャの原則
- **ドメインモデル中心設計**：ビジネスロジックをドメインレイヤに集約
- **依存関係の逆転**：リポジトリインターフェースはドメインレイヤに定義、実装はインフラレイヤに配置
- **エンティティと値オブジェクトの分離**：不変な値オブジェクトと可変なエンティティを明確に区別
- **集約の境界**：関連するエンティティを集約として管理し、整合性を保つ

### 1.2 データベース設計の原則
- **正規化**：第3正規形以上を基本とする
- **整合性制約**：外部キー制約、チェック制約、ユニーク制約を適切に設定
- **インデックス戦略**：検索・フィルタリングで頻繁に使用されるカラムにインデックスを設定
- **監査情報**：作成日時、更新日時、作成者、更新者を記録
- **ソフトデリート**：重要なデータは物理削除せず、論理削除フラグで管理

---

## 2. ドメインモデル

### 2.1 エンティティ一覧

| エンティティ | 説明 | 集約ルート |
|------------|------|-----------|
| **User** | システム利用者（学生団体メンバー、企業担当者） | User |
| **Organization** | 学生団体 | Organization |
| **Company** | 協賛企業 | Company |
| **SponsorshipPlan** | 協賛プラン | Company |
| **SponsorshipCondition** | 協賛条件 | Company |
| **Achievement** | 協賛実績 | Company |
| **Proposal** | 提携申込 | Proposal |
| **ChatRoom** | チャットルーム | ChatRoom |
| **ChatMessage** | チャットメッセージ | ChatRoom |
| **Tag** | タグマスタ | Tag |
| **Region** | 地域マスタ | Region |

### 2.2 値オブジェクト一覧

| 値オブジェクト | 説明 | 親エンティティ |
|--------------|------|---------------|
| **Rating** | 評価（スコア、件数） | Company |
| **ContactInfo** | 連絡先情報 | Company, Organization |
| **SponsorshipType** | 協賛タイプ（金銭協賛、物品提供、メンタリング、イベント共催） | SponsorshipPlan |
| **ProposalStatus** | 申込ステータス（申請済み、審査中、承認済み、却下） | Proposal |
| **MemberRole** | メンバーロール（代表、副代表、広報、財務、メンバー） | OrganizationMember |
| **UserStatus** | ユーザーステータス（active、pending、invited） | User |

---

## 3. データベーススキーマ設計

### 3.1 ユーザー管理

#### 3.1.1 users（ユーザー）
システム全体のユーザー情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ユーザーID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス（ログインID） |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ |
| name | VARCHAR(100) | NOT NULL | 氏名 |
| user_type | VARCHAR(20) | NOT NULL, CHECK (user_type IN ('company', 'organization')) | ユーザータイプ（企業/学生団体） |
| email_verified | BOOLEAN | DEFAULT false | メール認証済みフラグ |
| status | VARCHAR(20) | NOT NULL, CHECK (status IN ('active', 'pending', 'invited', 'suspended')) | ユーザーステータス |
| last_active_at | TIMESTAMP WITH TIME ZONE | | 最終アクセス日時 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |
| deleted_at | TIMESTAMP WITH TIME ZONE | | 削除日時（ソフトデリート） |

**インデックス**:
- `idx_users_email` ON users(email) WHERE deleted_at IS NULL
- `idx_users_status` ON users(status) WHERE deleted_at IS NULL
- `idx_users_type` ON users(user_type) WHERE deleted_at IS NULL

**ビジネスルール**:
- `user_type = 'company'` の場合、`company_contacts` テーブルにレコードが存在する必要がある
- `user_type = 'organization'` の場合、`organization_members` テーブルにレコードが存在する必要がある
- 登録時に `user_type` を設定し、以降は変更不可（整合性のため）

#### 3.1.2 user_profiles（ユーザープロフィール）
ユーザーの追加プロフィール情報。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| user_id | UUID | PRIMARY KEY, REFERENCES users(id) ON DELETE CASCADE | ユーザーID |
| university_email | VARCHAR(255) | UNIQUE | 大学メールアドレス（学生認証用） |
| university_name | VARCHAR(100) | | 大学名 |
| faculty | VARCHAR(100) | | 学部名 |
| department | VARCHAR(100) | | 学科名 |
| grade | INTEGER | | 学年（1-6） |
| phone | VARCHAR(20) | | 電話番号 |
| avatar_url | VARCHAR(500) | | アバター画像URL |
| bio | TEXT | | 自己紹介 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

---

### 3.2 学生団体管理

#### 3.2.1 organizations（学生団体）
学生団体の基本情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 組織ID |
| name | VARCHAR(200) | NOT NULL | 団体名 |
| tagline | VARCHAR(300) | | キャッチフレーズ |
| description | TEXT | | 活動内容説明 |
| join_code | VARCHAR(20) | UNIQUE, NOT NULL | 参加コード（例：NEXT-5824） |
| campus | VARCHAR(100) | | キャンパス情報 |
| representative_user_id | UUID | REFERENCES users(id) | 代表者ユーザーID |
| contact_email | VARCHAR(255) | NOT NULL | 連絡先メールアドレス |
| contact_phone | VARCHAR(20) | | 連絡先電話番号 |
| logo_url | VARCHAR(500) | | 学生団体ロゴ画像URL |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |
| deleted_at | TIMESTAMP WITH TIME ZONE | | 削除日時（ソフトデリート） |

**インデックス**:
- `idx_organizations_join_code` ON organizations(join_code) WHERE deleted_at IS NULL
- `idx_organizations_representative` ON organizations(representative_user_id) WHERE deleted_at IS NULL

#### 3.2.2 organization_members（組織メンバー）
学生団体のメンバー情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | メンバーID |
| organization_id | UUID | NOT NULL, REFERENCES organizations(id) ON DELETE CASCADE | 組織ID |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | ユーザーID |
| role | VARCHAR(20) | NOT NULL, CHECK (role IN ('代表', '副代表', '広報', '財務', 'メンバー')) | ロール |
| status | VARCHAR(20) | NOT NULL, CHECK (status IN ('active', 'pending', 'invited')) | ステータス |
| joined_at | TIMESTAMP WITH TIME ZONE | | 参加日時 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_org_members_org_user` ON organization_members(organization_id, user_id)
- `idx_org_members_status` ON organization_members(status) WHERE status = 'active'

**ユニーク制約**:
- `UNIQUE(organization_id, user_id)`

---

### 3.3 企業管理

#### 3.3.1 companies（企業）
協賛企業の基本情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 企業ID |
| name | VARCHAR(200) | NOT NULL | 企業名 |
| logo_url | VARCHAR(500) | | ロゴ画像URL |
| hero_image_url | VARCHAR(500) | | ヒーロー画像URL |
| philosophy | TEXT | | 企業理念 |
| rating_score | DECIMAL(3,2) | DEFAULT 0.00, CHECK (rating_score >= 0 AND rating_score <= 5) | 評価スコア（0-5） |
| rating_count | INTEGER | DEFAULT 0, CHECK (rating_count >= 0) | 評価件数 |
| primary_contact_id | UUID | REFERENCES company_contacts(id) | 主担当者ID |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |
| deleted_at | TIMESTAMP WITH TIME ZONE | | 削除日時（ソフトデリート） |

**インデックス**:
- `idx_companies_rating` ON companies(rating_score DESC, rating_count DESC) WHERE deleted_at IS NULL
- `idx_companies_created` ON companies(created_at DESC) WHERE deleted_at IS NULL

#### 3.3.2 company_contacts（企業担当者）
企業の担当者情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 担当者ID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| user_id | UUID | REFERENCES users(id) ON DELETE SET NULL | ユーザーID（ログイン用） |
| name | VARCHAR(100) | NOT NULL | 氏名 |
| role | VARCHAR(100) | NOT NULL | 役職 |
| email | VARCHAR(255) | | メールアドレス |
| phone | VARCHAR(20) | | 電話番号 |
| is_primary | BOOLEAN | DEFAULT false | 主担当者フラグ |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_company_contacts_company` ON company_contacts(company_id)
- `idx_company_contacts_primary` ON company_contacts(company_id, is_primary) WHERE is_primary = true
- `idx_company_contacts_user` ON company_contacts(user_id) WHERE user_id IS NOT NULL

**ビジネスルール**:
- `user_id` が設定されている場合、そのユーザーは `users.user_type = 'company'` である必要がある
- 主担当者（`is_primary = true`）は `user_id` が必須（ログイン可能にするため）
- 複数の担当者が同じ企業に紐づくことが可能

#### 3.3.3 company_tags（企業タグ中間テーブル）
企業とタグの多対多関係を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| tag_id | UUID | NOT NULL, REFERENCES tags(id) ON DELETE CASCADE | タグID |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |

**インデックス**:
- `idx_company_tags_company` ON company_tags(company_id)
- `idx_company_tags_tag` ON company_tags(tag_id)

**ユニーク制約**:
- `PRIMARY KEY(company_id, tag_id)`

#### 3.3.4 tags（タグマスタ）
業界タグなどのマスタデータを管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | タグID |
| type | VARCHAR(50) | NOT NULL, CHECK (type IN ('industry', 'feature', 'university')) | タグタイプ |
| label | VARCHAR(100) | NOT NULL | タグラベル |
| display_order | INTEGER | DEFAULT 0 | 表示順序 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_tags_type` ON tags(type, display_order)
- `UNIQUE(type, label)`

---

### 3.4 協賛プラン・条件管理

#### 3.4.1 sponsorship_plans（協賛プラン）
企業の協賛プラン情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | プランID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| title | VARCHAR(200) | NOT NULL | プランタイトル |
| summary | TEXT | | プラン概要 |
| image_url | VARCHAR(500) | | プラン画像URL |
| coverage_area | VARCHAR(100) | | カバーエリア（全国、東京、関西など） |
| is_active | BOOLEAN | DEFAULT true | 有効フラグ |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_sponsorship_plans_company` ON sponsorship_plans(company_id, is_active) WHERE is_active = true

#### 3.4.2 sponsorship_plan_types（協賛プランタイプ中間テーブル）
協賛プランと協賛タイプの多対多関係を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| plan_id | UUID | NOT NULL, REFERENCES sponsorship_plans(id) ON DELETE CASCADE | プランID |
| sponsorship_type | VARCHAR(50) | NOT NULL, CHECK (sponsorship_type IN ('金銭協賛', '物品提供', 'メンタリング', 'イベント共催')) | 協賛タイプ |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |

**ユニーク制約**:
- `PRIMARY KEY(plan_id, sponsorship_type)`

#### 3.4.3 sponsorship_conditions（協賛条件）
企業の協賛条件を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| company_id | UUID | PRIMARY KEY, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| cash_support_available | BOOLEAN | DEFAULT false | 金銭協賛可能フラグ |
| cash_support_detail | TEXT | | 金銭協賛詳細（上限額など） |
| goods_support_available | BOOLEAN | DEFAULT false | 物品提供可能フラグ |
| goods_support_detail | TEXT | | 物品提供詳細 |
| mentoring_available | BOOLEAN | DEFAULT false | メンタリング可能フラグ |
| mentoring_detail | TEXT | | メンタリング詳細 |
| cohost_event_available | BOOLEAN | DEFAULT false | イベント共催可能フラグ |
| cohost_event_detail | TEXT | | イベント共催詳細 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

---

### 3.5 実績管理

#### 3.5.1 achievements（協賛実績）
企業の過去の協賛実績を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 実績ID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| organization_name | VARCHAR(200) | NOT NULL | 団体名 |
| event_name | VARCHAR(200) | NOT NULL | イベント名 |
| description | TEXT | | 実績説明 |
| logo_url | VARCHAR(500) | | 団体ロゴURL |
| achievement_date | DATE | | 実績日 |
| display_order | INTEGER | DEFAULT 0 | 表示順序 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_achievements_company` ON achievements(company_id, display_order)

---

### 3.6 提携申込管理

#### 3.6.1 proposals（提携申込）
学生団体から企業への提携申込を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 申込ID |
| organization_id | UUID | NOT NULL, REFERENCES organizations(id) ON DELETE CASCADE | 組織ID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| plan_id | UUID | REFERENCES sponsorship_plans(id) | プランID |
| message | TEXT | NOT NULL | 申込メッセージ |
| status | VARCHAR(20) | NOT NULL, CHECK (status IN ('申請済み', '審査中', '承認済み', '却下')) | ステータス |
| submitted_by_user_id | UUID | REFERENCES users(id) | 申込者ユーザーID |
| submitted_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 申込日時 |
| reviewed_at | TIMESTAMP WITH TIME ZONE | | 審査日時 |
| reviewed_by_user_id | UUID | REFERENCES users(id) | 審査者ユーザーID |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_proposals_organization` ON proposals(organization_id, status)
- `idx_proposals_company` ON proposals(company_id, status)
- `idx_proposals_submitted` ON proposals(submitted_at DESC)

**ユニーク制約**:
- `UNIQUE(organization_id, company_id, plan_id)` WHERE status IN ('申請済み', '審査中') -- 重複申込防止

---

### 3.7 チャット管理

#### 3.7.1 chat_rooms（チャットルーム）
学生団体と企業のチャットルームを管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ルームID |
| organization_id | UUID | NOT NULL, REFERENCES organizations(id) ON DELETE CASCADE | 組織ID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| proposal_id | UUID | REFERENCES proposals(id) | 関連申込ID（オプション） |
| last_message_at | TIMESTAMP WITH TIME ZONE | | 最終メッセージ日時 |
| organization_unread_count | INTEGER | DEFAULT 0, CHECK (organization_unread_count >= 0) | 組織側未読数 |
| company_unread_count | INTEGER | DEFAULT 0, CHECK (company_unread_count >= 0) | 企業側未読数 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_chat_rooms_org` ON chat_rooms(organization_id, last_message_at DESC)
- `idx_chat_rooms_company` ON chat_rooms(company_id, last_message_at DESC)
- `UNIQUE(organization_id, company_id)` -- 1組織1企業につき1ルーム

#### 3.7.2 chat_messages（チャットメッセージ）
チャットメッセージを管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | メッセージID |
| chat_room_id | UUID | NOT NULL, REFERENCES chat_rooms(id) ON DELETE CASCADE | ルームID |
| sender_type | VARCHAR(20) | NOT NULL, CHECK (sender_type IN ('user', 'company')) | 送信者タイプ |
| sender_user_id | UUID | REFERENCES users(id) | 送信者ユーザーID（sender_type='user'の場合） |
| sender_contact_id | UUID | REFERENCES company_contacts(id) | 送信者担当者ID（sender_type='company'の場合） |
| message | TEXT | NOT NULL | メッセージ内容 |
| read | BOOLEAN | DEFAULT false | 既読フラグ |
| read_at | TIMESTAMP WITH TIME ZONE | | 既読日時 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |

**インデックス**:
- `idx_chat_messages_room` ON chat_messages(chat_room_id, created_at DESC)
- `idx_chat_messages_unread` ON chat_messages(chat_room_id, read) WHERE read = false

---

### 3.8 ユーザーアクション管理

#### 3.8.1 kept_companies（キープ企業）
学生団体がキープ（お気に入り）した企業を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | キープID |
| organization_id | UUID | NOT NULL, REFERENCES organizations(id) ON DELETE CASCADE | 組織ID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| kept_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | キープ日時 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |

**インデックス**:
- `idx_kept_companies_org` ON kept_companies(organization_id, kept_at DESC)
- `UNIQUE(organization_id, company_id)` -- 重複キープ防止

#### 3.8.2 browsed_companies（閲覧履歴）
学生団体の企業閲覧履歴を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 閲覧ID |
| organization_id | UUID | NOT NULL, REFERENCES organizations(id) ON DELETE CASCADE | 組織ID |
| company_id | UUID | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | 企業ID |
| browsed_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 閲覧日時 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |

**インデックス**:
- `idx_browsed_companies_org` ON browsed_companies(organization_id, browsed_at DESC)
- `idx_browsed_companies_company` ON browsed_companies(company_id, browsed_at DESC)

**注意**: 閲覧履歴は大量になる可能性があるため、一定期間（例：90日）を超えたデータはアーカイブまたは削除することを推奨。

---

### 3.9 地域マスタ

#### 3.9.1 regions（地域マスタ）
地域情報のマスタデータを管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 地域ID |
| code | VARCHAR(50) | UNIQUE, NOT NULL | 地域コード |
| name | VARCHAR(100) | NOT NULL | 地域名 |
| display_order | INTEGER | DEFAULT 0 | 表示順序 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_regions_display_order` ON regions(display_order)

---

## 4. リレーションシップ図（ER図の主要部分）

```
users
  ├── user_profiles (1:1)
  ├── organization_members (1:N)
  └── proposals (submitted_by_user_id, reviewed_by_user_id)

organizations
  ├── organization_members (1:N)
  ├── proposals (1:N)
  ├── chat_rooms (1:N)
  ├── kept_companies (1:N)
  └── browsed_companies (1:N)

companies
  ├── company_contacts (1:N)
  ├── company_tags (N:M via company_tags)
  ├── sponsorship_plans (1:N)
  ├── sponsorship_conditions (1:1)
  ├── achievements (1:N)
  ├── proposals (1:N)
  ├── chat_rooms (1:N)
  ├── kept_companies (1:N)
  └── browsed_companies (1:N)

sponsorship_plans
  ├── sponsorship_plan_types (1:N)
  └── proposals (1:N)

chat_rooms
  └── chat_messages (1:N)

tags
  └── company_tags (N:M via company_tags)
```

---

## 5. インデックス戦略

### 5.1 検索・フィルタリング用インデックス
- **企業検索**: `companies(rating_score, rating_count)`, `companies(created_at)`
- **タグ検索**: `company_tags(company_id, tag_id)`, `tags(type, display_order)`
- **申込検索**: `proposals(organization_id, status)`, `proposals(company_id, status)`
- **チャット検索**: `chat_rooms(organization_id, last_message_at)`, `chat_messages(chat_room_id, created_at)`

### 5.2 パフォーマンス最適化
- **複合インデックス**: 頻繁に組み合わせて使用されるカラムに設定
- **部分インデックス**: `WHERE deleted_at IS NULL` などの条件付きインデックス
- **カバリングインデックス**: クエリで必要なカラムを全て含むインデックス

---

## 6. データ整合性制約

### 6.1 外部キー制約
- すべての外部キーに `ON DELETE CASCADE` または `ON DELETE SET NULL` を設定
- 参照整合性を保証

### 6.2 チェック制約
- ステータス値の妥当性チェック（ENUM相当）
- 数値範囲のチェック（rating_score 0-5、rating_count >= 0 など）

### 6.3 ユニーク制約
- 重複データの防止（email、join_code、organization_id + company_id など）

---

## 7. 監査・ログ設計

### 7.1 監査カラム
すべての主要テーブルに以下を設定：
- `created_at`: 作成日時
- `updated_at`: 更新日時（自動更新）
- `deleted_at`: 削除日時（ソフトデリート）

### 7.2 操作ログ（将来拡張）
重要な操作（申込、承認、却下など）は別テーブルでログを記録することを推奨。

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  user_id UUID REFERENCES users(id),
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

## 8. マイグレーション戦略

### 8.1 マイグレーションファイル管理
- Prisma または TypeORM のマイグレーションファイルを使用
- バージョン管理システムで管理
- ロールバック手順を文書化

### 8.2 データ移行
- モックデータから本番データへの移行スクリプトを作成
- データ整合性チェックを実施

---

## 9. パフォーマンス考慮事項

### 9.1 クエリ最適化
- N+1問題の回避（JOIN、バッチ読み込み）
- ページネーションの実装（OFFSET/LIMIT またはカーソルベース）
- キャッシュ戦略（Redis など）

### 9.2 データアーカイブ
- 閲覧履歴は一定期間後にアーカイブ
- 古いチャットメッセージのアーカイブ
- パーティショニングの検討（大量データの場合）

---

## 10. セキュリティ考慮事項

### 10.1 データ保護
- パスワードはハッシュ化（bcrypt、Argon2 など）
- 個人情報の暗号化（必要に応じて）
- SQLインジェクション対策（パラメータ化クエリ）

### 10.2 アクセス制御
- 行レベルセキュリティ（RLS）の検討（Supabase 使用時）
- ユーザーごとのデータアクセス制限

---

## 11. 拡張性考慮事項

### 11.1 将来の拡張に対応
- 評価・レビュー機能の追加（`reviews` テーブル）
- 通知機能の追加（`notifications` テーブル）
- レコメンデーション機能の追加（機械学習用データテーブル）

### 11.2 スケーラビリティ
- 読み取り専用レプリカの活用
- シャーディングの検討（大規模化時）
- CDN による静的アセット配信

---

## 12. まとめ

本データベース設計は、クリーンアーキテクチャの原則に基づき、以下の点を重視している：

1. **ドメインモデル中心**: ビジネスロジックを反映したエンティティ設計
2. **整合性保証**: 外部キー制約、チェック制約、ユニーク制約による整合性確保
3. **パフォーマンス**: 適切なインデックス戦略による高速検索
4. **拡張性**: 将来の機能追加に対応できる柔軟な設計
5. **セキュリティ**: データ保護とアクセス制御の考慮

この設計を基盤として、リポジトリパターンとユースケースを実装することで、保守性の高いバックエンドシステムを構築できる。

---

## 13. 登録情報設計（企業側・学生団体側）

企業側と学生団体側では、登録時に必要な情報と登録フローが異なる。それぞれの登録戦略を以下に定義する。

---

### 13.1 企業側登録情報設計

#### 13.1.1 登録フロー概要

企業側の登録は、以下のステップで構成される：

1. **初期登録**（必須）
   - 企業アカウント作成
   - 担当者アカウント作成
   - メール認証

2. **基本情報登録**（必須）
   - 企業基本情報
   - 担当者情報
   - 協賛条件の設定

3. **詳細情報登録**（推奨）
   - 協賛プランの登録
   - 実績情報の登録
   - 業界タグの設定

4. **公開設定**（任意）
   - プロフィール公開フラグ
   - 検索結果への表示設定

#### 13.1.2 登録時に必要な情報

##### ステップ1: アカウント作成（必須）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 担当者メールアドレス | `users.email` | VARCHAR(255) | ✓ | メール形式、重複チェック | ログインIDとして使用 |
| パスワード | `users.password_hash` | VARCHAR(255) | ✓ | 8文字以上、英数字記号 | ハッシュ化して保存 |
| 担当者氏名 | `users.name` | VARCHAR(100) | ✓ | 1-100文字 | 担当者の氏名 |
| 担当者役職 | `company_contacts.role` | VARCHAR(100) | ✓ | 1-100文字 | 例：採用マネージャー、CSR担当 |

**登録後の処理**:
- メール認証トークンを生成
- 認証メールを送信
- ユーザーステータスを `pending` に設定

##### ステップ2: 企業基本情報登録（必須）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 企業名 | `companies.name` | VARCHAR(200) | ✓ | 1-200文字、重複チェック推奨 | 正式な企業名 |
| 企業ロゴ | `companies.logo_url` | VARCHAR(500) | △ | URL形式、画像ファイル | 推奨サイズ：256x256px |
| ヒーロー画像 | `companies.hero_image_url` | VARCHAR(500) | △ | URL形式、画像ファイル | 推奨サイズ：1200x600px |
| 企業理念 | `companies.philosophy` | TEXT | △ | 最大2000文字 | 企業の理念・方針 |
| 担当者メール | `company_contacts.email` | VARCHAR(255) | ✓ | メール形式 | 連絡先メールアドレス |
| 担当者電話 | `company_contacts.phone` | VARCHAR(20) | △ | 電話番号形式 | 連絡先電話番号 |

**登録後の処理**:
- `company_contacts.is_primary` を `true` に設定
- `companies.primary_contact_id` を設定

##### ステップ3: 協賛条件登録（必須）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 金銭協賛 | `sponsorship_conditions.cash_support_available` | BOOLEAN | ✓ | - | 金銭協賛の可否 |
| 金銭協賛詳細 | `sponsorship_conditions.cash_support_detail` | TEXT | △ | 最大500文字 | 上限額、条件など |
| 物品提供 | `sponsorship_conditions.goods_support_available` | BOOLEAN | ✓ | - | 物品提供の可否 |
| 物品提供詳細 | `sponsorship_conditions.goods_support_detail` | TEXT | △ | 最大500文字 | 提供可能な物品 |
| メンタリング | `sponsorship_conditions.mentoring_available` | BOOLEAN | ✓ | - | メンタリングの可否 |
| メンタリング詳細 | `sponsorship_conditions.mentoring_detail` | TEXT | △ | 最大500文字 | 頻度、内容など |
| イベント共催 | `sponsorship_conditions.cohost_event_available` | BOOLEAN | ✓ | - | イベント共催の可否 |
| イベント共催詳細 | `sponsorship_conditions.cohost_event_detail` | TEXT | △ | 最大500文字 | 共催可能なイベント |

**ビジネスルール**:
- 最低1つの協賛タイプが `true` である必要がある
- 詳細情報は、該当する協賛タイプが `true` の場合に入力推奨

##### ステップ4: 協賛プラン登録（推奨）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| プランタイトル | `sponsorship_plans.title` | VARCHAR(200) | ✓ | 1-200文字 | 例：「大学連携の共同イベント協賛」 |
| プラン概要 | `sponsorship_plans.summary` | TEXT | ✓ | 1-1000文字 | プランの概要説明 |
| プラン画像 | `sponsorship_plans.image_url` | VARCHAR(500) | △ | URL形式、画像ファイル | 推奨サイズ：800x600px |
| 協賛タイプ | `sponsorship_plan_types.sponsorship_type` | VARCHAR(50) | ✓ | ENUM値 | 複数選択可能 |
| カバーエリア | `sponsorship_plans.coverage_area` | VARCHAR(100) | ✓ | 1-100文字 | 例：「全国 / 東京中心」 |

**ビジネスルール**:
- 1企業につき複数のプランを登録可能
- 協賛タイプは `sponsorship_conditions` で `true` に設定したもののみ選択可能

##### ステップ5: 業界タグ設定（推奨）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 業界タグ | `company_tags.tag_id` | UUID | △ | 既存タグID | `tags.type = 'industry'` のタグ |
| 特徴タグ | `company_tags.tag_id` | UUID | △ | 既存タグID | `tags.type = 'feature'` のタグ |

**ビジネスルール**:
- 業界タグは最低1つ推奨（検索性向上のため）
- タグは最大10個まで設定可能

##### ステップ6: 実績情報登録（任意）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 団体名 | `achievements.organization_name` | VARCHAR(200) | ✓ | 1-200文字 | 協賛した学生団体名 |
| イベント名 | `achievements.event_name` | VARCHAR(200) | ✓ | 1-200文字 | 協賛したイベント名 |
| 実績説明 | `achievements.description` | TEXT | ✓ | 1-1000文字 | 協賛内容の説明 |
| 団体ロゴ | `achievements.logo_url` | VARCHAR(500) | △ | URL形式、画像ファイル | 団体のロゴ画像 |
| 実績日 | `achievements.achievement_date` | DATE | △ | 日付形式 | 協賛実施日 |

**ビジネスルール**:
- 実績は複数登録可能（表示順序を設定可能）
- 実績があると企業の信頼性が向上

#### 13.1.3 企業側登録完了条件

以下の条件を満たした場合、企業登録が完了とみなす：

**必須項目完了**:
- [x] ユーザーアカウント作成・メール認証完了
- [x] 企業基本情報登録完了
- [x] 担当者情報登録完了
- [x] 協賛条件（最低1つ）登録完了

**推奨項目完了**:
- [ ] 協賛プラン1件以上登録
- [ ] 業界タグ1つ以上設定
- [ ] 企業ロゴ登録

**公開可能条件**:
- 必須項目完了 + 協賛プラン1件以上登録

#### 13.1.4 企業側登録API設計

```
POST /api/auth/company/register
  Request Body:
    {
      "email": "contact@company.com",
      "password": "SecurePassword123!",
      "name": "山田 太郎",
      "role": "採用マネージャー",
      "company": {
        "name": "株式会社サンプル",
        "logo_url": "https://...",
        "philosophy": "学生の挑戦を応援します"
      },
      "contact": {
        "email": "contact@company.com",
        "phone": "03-1234-5678"
      },
      "conditions": {
        "cash_support_available": true,
        "cash_support_detail": "上限30万円まで",
        "goods_support_available": true,
        "goods_support_detail": "ノベルティ・飲料提供",
        "mentoring_available": true,
        "mentoring_detail": "週1回打合せ可能",
        "cohost_event_available": true,
        "cohost_event_detail": "大学内イベント共催"
      }
    }
  Response:
    {
      "user_id": "uuid",
      "company_id": "uuid",
      "contact_id": "uuid",
      "email_verification_sent": true
    }

POST /api/companies/{id}/plans
  Request Body:
    {
      "title": "大学連携の共同イベント協賛",
      "summary": "学生団体の挑戦を応援する企業プラン",
      "image_url": "https://...",
      "sponsorship_types": ["金銭協賛", "イベント共催"],
      "coverage_area": "全国 / 東京中心"
    }

POST /api/companies/{id}/achievements
  Request Body:
    {
      "organization_name": "東京大学起業サークル",
      "event_name": "スタートアップピッチ2024",
      "description": "50名規模のピッチイベントを共同開催",
      "logo_url": "https://...",
      "achievement_date": "2024-03-15"
    }
```

---

### 13.2 学生団体側登録情報設計

#### 13.2.1 登録フロー概要

学生団体側の登録は、以下のステップで構成される：

1. **個人アカウント作成**（必須）
   - ユーザーアカウント作成
   - 大学メール認証
   - 本人確認

2. **団体作成・参加**（必須）
   - 新規団体作成 または 既存団体への参加
   - 代表者による承認

3. **団体プロフィール設定**（推奨）
   - 団体基本情報
   - 活動内容
   - SNSリンク

4. **メンバー招待**（任意）
   - メンバーへの招待
   - メンバー承認

#### 13.2.2 登録時に必要な情報

##### ステップ1: 個人アカウント作成（必須）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| メールアドレス | `users.email` | VARCHAR(255) | ✓ | メール形式、重複チェック | ログインIDとして使用 |
| パスワード | `users.password_hash` | VARCHAR(255) | ✓ | 8文字以上、英数字記号 | ハッシュ化して保存 |
| 氏名 | `users.name` | VARCHAR(100) | ✓ | 1-100文字 | 氏名 |
| 大学メール | `user_profiles.university_email` | VARCHAR(255) | ✓ | 大学ドメイン、重複チェック | 学生認証用 |
| 大学名 | `user_profiles.university_name` | VARCHAR(100) | ✓ | 1-100文字 | 所属大学名 |
| 電話番号 | `user_profiles.phone` | VARCHAR(20) | △ | 電話番号形式 | 連絡先 |

**登録後の処理**:
- 大学メール認証トークンを生成
- 認証メールを送信（大学メールアドレスへ）
- ユーザーステータスを `pending` に設定
- 本人確認完了まで一部機能を制限

##### ステップ2: 団体作成（新規団体の場合）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 団体名 | `organizations.name` | VARCHAR(200) | ✓ | 1-200文字、重複チェック推奨 | 正式な団体名 |
| キャッチフレーズ | `organizations.tagline` | VARCHAR(300) | △ | 最大300文字 | 団体のキャッチフレーズ |
| 活動内容説明 | `organizations.description` | TEXT | ✓ | 1-2000文字 | 団体の活動内容 |
| キャンパス情報 | `organizations.campus` | VARCHAR(100) | △ | 最大100文字 | 例：「首都圏5大学連合」 |
| 連絡先メール | `organizations.contact_email` | VARCHAR(255) | ✓ | メール形式 | 団体の連絡先 |
| 連絡先電話 | `organizations.contact_phone` | VARCHAR(20) | △ | 電話番号形式 | 団体の連絡先 |
| ロゴ | `organizations.logo_url` | VARCHAR(500) | △ | URL形式、画像ファイル | 推奨サイズ：256x256px |

**登録後の処理**:
- 参加コード（`join_code`）を自動生成（例：`NEXT-5824`）
- 作成者が代表者（`representative_user_id`）に設定
- `organization_members` に代表者として追加（`role = '代表'`, `status = 'active'`）

##### ステップ2-2: 団体参加（既存団体への参加）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 参加コード | `organizations.join_code` | VARCHAR(20) | ✓ | 形式チェック | 団体から提供された参加コード |
| 希望ロール | `organization_members.role` | VARCHAR(20) | ✓ | ENUM値 | 代表、副代表、広報、財務、メンバー |

**登録後の処理**:
- `organization_members` に追加（`status = 'pending'`）
- 代表者に承認リクエスト通知を送信
- 代表者が承認するまで `status = 'pending'` のまま

##### ステップ3: 団体プロフィール設定（推奨）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 活動内容詳細 | `organizations.description` | TEXT | △ | 最大5000文字 | より詳細な活動内容 |
| SNSリンク | （将来拡張） | - | △ | URL形式 | Twitter、Instagramなど |
| 活動実績 | （将来拡張） | - | △ | - | 過去の活動実績 |

**ビジネスルール**:
- プロフィールが充実していると、企業からの信頼度が向上
- 協賛申込時にプロフィール情報が企業に表示される

##### ステップ4: メンバー招待（任意）

| 項目 | カラム | 型 | 必須 | バリデーション | 説明 |
|------|--------|-----|------|----------------|------|
| 招待メール | - | VARCHAR(255) | ✓ | メール形式 | 招待するメンバーのメール |
| 希望ロール | `organization_members.role` | VARCHAR(20) | ✓ | ENUM値 | 招待時の希望ロール |

**登録後の処理**:
- 招待メールを送信
- `organization_members` に追加（`status = 'invited'`）
- 招待されたユーザーがアカウント作成・認証完了後、代表者が承認

#### 13.2.3 学生団体側登録完了条件

以下の条件を満たした場合、学生団体登録が完了とみなす：

**個人アカウント完了**:
- [x] ユーザーアカウント作成完了
- [x] 大学メール認証完了
- [x] 本人確認完了（`email_verified = true`）

**団体参加完了**:
- [x] 団体作成 または 団体参加リクエスト送信
- [x] 代表者による承認完了（`organization_members.status = 'active'`）

**推奨項目完了**:
- [ ] 団体プロフィール設定（活動内容、キャッチフレーズ）
- [ ] ロゴ登録

**機能利用可能条件**:
- 個人アカウント完了 + 団体参加完了

#### 13.2.4 学生団体側登録API設計

```
POST /api/auth/organization/register
  Request Body:
    {
      "email": "student@university.ac.jp",
      "password": "SecurePassword123!",
      "name": "山本 大輝",
      "university_email": "student@university.ac.jp",
      "university_name": "東京大学",
      "phone": "090-1234-5678"
    }
  Response:
    {
      "user_id": "uuid",
      "email_verification_sent": true,
      "university_email_verification_sent": true
    }

POST /api/organizations
  Request Body:
    {
      "name": "NEXT Innovators",
      "tagline": "学生と企業の共創をつなぐソーシャルイノベーション団体",
      "description": "関東圏の大学生を中心に...",
      "campus": "首都圏5大学連合",
      "contact_email": "team@next-innovators.jp",
      "contact_phone": "03-1234-5678",
      "logo_url": "https://..."
    }
  Response:
    {
      "organization_id": "uuid",
      "join_code": "NEXT-5824",
      "representative_user_id": "uuid"
    }

POST /api/organizations/join
  Request Body:
    {
      "join_code": "NEXT-5824",
      "role": "メンバー"
    }
  Response:
    {
      "organization_id": "uuid",
      "organization_name": "NEXT Innovators",
      "status": "pending",
      "message": "代表者の承認待ちです"
    }

POST /api/organizations/{id}/members/invite
  Request Body:
    {
      "email": "newmember@university.ac.jp",
      "role": "メンバー"
    }
  Response:
    {
      "invitation_sent": true,
      "member_id": "uuid"
    }

POST /api/organizations/{id}/members/{member_id}/approve
  Request Body:
    {
      "approved": true
    }
  Response:
    {
      "member_id": "uuid",
      "status": "active"
    }
```

---

### 13.3 登録情報の比較

| 項目 | 企業側 | 学生団体側 |
|------|--------|-----------|
| **認証方法** | 通常メール認証 | 大学メール認証（学生認証） |
| **必須情報** | 企業名、担当者情報、協賛条件 | 氏名、大学メール、大学名、団体情報 |
| **承認フロー** | メール認証のみ | メール認証 + 代表者承認（参加時） |
| **初期設定** | 協賛条件、協賛プラン | 団体プロフィール、メンバー管理 |
| **公開情報** | 企業情報、協賛プラン、実績 | 団体情報、活動内容 |
| **管理機能** | 協賛プラン管理、実績管理、チャット対応 | メンバー管理、協賛申込管理、チャット |

---

### 13.4 登録時のバリデーション戦略

#### 13.4.1 共通バリデーション

- **メールアドレス**: RFC 5322準拠、重複チェック
- **パスワード**: 8文字以上、英数字記号を含む、複雑度チェック
- **電話番号**: 日本の電話番号形式（03-1234-5678、090-1234-5678など）
- **URL**: HTTP/HTTPS形式、画像ファイルの場合は拡張子チェック

#### 13.4.2 企業側固有バリデーション

- **企業名**: 重複チェック（同一企業の重複登録防止）
- **協賛条件**: 最低1つの協賛タイプが `true` であること
- **協賛プラン**: 協賛タイプが条件と一致していること

#### 13.4.3 学生団体側固有バリデーション

- **大学メール**: 大学ドメインのホワイトリストチェック（将来拡張）
- **参加コード**: 形式チェック（例：`XXXX-####`）、存在チェック
- **団体名**: 重複チェック（同一団体の重複登録防止）

---

### 13.5 オンボーディング戦略

#### 13.5.1 企業側オンボーディング

**オンボーディングステップ**:
1. アカウント作成・認証完了
2. 企業基本情報登録
3. 協賛条件設定
4. 協賛プラン登録（最低1件）
5. 業界タグ設定
6. 実績情報登録（任意）

**進捗管理**:
- 各ステップの完了状況を `company_onboarding` テーブルで管理（将来拡張）
- ダッシュボードで進捗を可視化

**ガイダンス**:
- 各ステップで説明文とサンプルを表示
- 未完了項目をリマインド通知

#### 13.5.2 学生団体側オンボーディング

**オンボーディングステップ**:
1. 個人アカウント作成・大学メール認証
2. 団体作成 または 団体参加
3. 代表者による承認（参加の場合）
4. 団体プロフィール設定
5. メンバー招待（任意）

**進捗管理**:
- 各ステップの完了状況を `organization_onboarding` テーブルで管理（将来拡張）
- ダッシュボードで進捗を可視化

**ガイダンス**:
- 各ステップで説明文とサンプルを表示
- 未完了項目をリマインド通知

---

### 13.6 登録情報の更新・管理

#### 13.6.1 企業側情報更新

- **基本情報更新**: 企業名、ロゴ、理念など
- **協賛条件更新**: 協賛タイプ、詳細情報の変更
- **プラン追加・編集**: 新規プラン追加、既存プラン編集
- **実績追加**: 新しい実績情報の追加

**権限管理**:
- 企業担当者のみが更新可能
- 主担当者（`is_primary = true`）は全項目更新可能
- その他の担当者は制限付き更新可能

#### 13.6.2 学生団体側情報更新

- **団体情報更新**: 団体名、説明、連絡先など
- **メンバー管理**: メンバー追加、ロール変更、削除
- **プロフィール更新**: 活動内容、SNSリンクなど

**権限管理**:
- 代表者・副代表者は全項目更新可能
- その他のメンバーは制限付き更新可能
- メンバー承認は代表者のみ

---

### 13.7 企業と学生団体の識別方法

システム上で企業ユーザーと学生団体ユーザーを識別する方法を以下に定義する。

#### 13.7.1 識別方法の概要

企業と学生団体の識別は、以下の2つの方法で行う：

1. **プライマリ識別**: `users.user_type` カラムによる直接識別
2. **セカンダリ識別**: リレーションシップテーブルによる確認

#### 13.7.2 プライマリ識別（推奨）

`users` テーブルの `user_type` カラムで直接識別する。

**値**:
- `'company'`: 企業担当者
- `'organization'`: 学生団体メンバー

**使用例**:
```sql
-- 企業ユーザーの取得
SELECT * FROM users WHERE user_type = 'company' AND deleted_at IS NULL;

-- 学生団体ユーザーの取得
SELECT * FROM users WHERE user_type = 'organization' AND deleted_at IS NULL;

-- ログイン時の識別
SELECT id, name, user_type, email_verified, status
FROM users
WHERE email = $1 AND password_hash = $2 AND deleted_at IS NULL;
```

**メリット**:
- 高速な識別（インデックス利用可能）
- シンプルなクエリ
- ログイン時に即座に判断可能

#### 13.7.3 セカンダリ識別（整合性確認用）

リレーションシップテーブルで整合性を確認する。

**企業担当者の確認**:
```sql
-- ユーザーが企業担当者か確認
SELECT EXISTS(
  SELECT 1
  FROM company_contacts cc
  WHERE cc.user_id = $1
) AS is_company_contact;
```

**学生団体メンバーの確認**:
```sql
-- ユーザーが学生団体メンバーか確認
SELECT EXISTS(
  SELECT 1
  FROM organization_members om
  WHERE om.user_id = $1 AND om.status = 'active'
) AS is_organization_member;
```

**メリット**:
- データ整合性の検証に使用
- `user_type` とリレーションシップの不整合を検出可能

#### 13.7.4 識別フロー

**ログイン時の識別フロー**:

1. メールアドレスとパスワードで認証
2. `users.user_type` でユーザータイプを取得
3. ユーザータイプに応じて適切なダッシュボードへリダイレクト
   - `user_type = 'company'` → 企業ダッシュボード（将来拡張）
   - `user_type = 'organization'` → 学生団体ダッシュボード (`/organization`)

**API認証時の識別フロー**:

1. JWTトークンまたはセッションから `user_id` を取得
2. `users.user_type` でユーザータイプを確認
3. エンドポイントの権限チェック
   - 企業専用API: `user_type = 'company'` のみ許可
   - 学生団体専用API: `user_type = 'organization'` のみ許可
   - 共通API: 両方許可

#### 13.7.5 データ整合性の保証

**制約**:
- `user_type = 'company'` の場合、`company_contacts` にレコードが存在すること
- `user_type = 'organization'` の場合、`organization_members` にレコードが存在すること

**整合性チェック用SQL**:
```sql
-- 企業ユーザーで company_contacts にレコードがないユーザーを検出
SELECT u.id, u.email, u.user_type
FROM users u
WHERE u.user_type = 'company'
  AND NOT EXISTS (
    SELECT 1 FROM company_contacts cc WHERE cc.user_id = u.id
  )
  AND u.deleted_at IS NULL;

-- 学生団体ユーザーで organization_members にレコードがないユーザーを検出
SELECT u.id, u.email, u.user_type
FROM users u
WHERE u.user_type = 'organization'
  AND NOT EXISTS (
    SELECT 1 FROM organization_members om WHERE om.user_id = u.id
  )
  AND u.deleted_at IS NULL;
```

#### 13.7.6 アプリケーション層での実装例

**TypeScript/Node.js での実装例**:

```typescript
// ユーザータイプのEnum定義
enum UserType {
  COMPANY = 'company',
  ORGANIZATION = 'organization',
}

// ユーザー情報取得時の型定義
interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  emailVerified: boolean;
  status: string;
}

// 認証ミドルウェアでの識別
function requireUserType(userType: UserType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if (user.userType !== userType) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// 使用例
router.get('/api/companies', requireAuth, requireUserType(UserType.COMPANY), getCompanies);
router.get('/api/organizations', requireAuth, requireUserType(UserType.ORGANIZATION), getOrganizations);
```

#### 13.7.7 登録時の設定

**企業側登録時**:
```typescript
// 企業登録API
async function registerCompany(data: CompanyRegisterData) {
  const user = await createUser({
    email: data.email,
    password: hashPassword(data.password),
    name: data.name,
    userType: UserType.COMPANY, // 企業として設定
    emailVerified: false,
    status: 'pending',
  });
  
  const company = await createCompany({ ... });
  await createCompanyContact({
    companyId: company.id,
    userId: user.id,
    name: data.name,
    role: data.role,
    isPrimary: true,
  });
  
  return { userId: user.id, companyId: company.id };
}
```

**学生団体側登録時**:
```typescript
// 学生団体登録API
async function registerOrganization(data: OrganizationRegisterData) {
  const user = await createUser({
    email: data.email,
    password: hashPassword(data.password),
    name: data.name,
    userType: UserType.ORGANIZATION, // 学生団体として設定
    emailVerified: false,
    status: 'pending',
  });
  
  const organization = await createOrganization({ ... });
  await createOrganizationMember({
    organizationId: organization.id,
    userId: user.id,
    role: '代表',
    status: 'active',
  });
  
  return { userId: user.id, organizationId: organization.id };
}
```

---

© 2025 Co-Create Project Team. All rights reserved.

