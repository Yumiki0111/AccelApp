# モックから実データベースへの移行戦略

本ドキュメントは、モックデータから実データベース（PostgreSQL）への移行戦略と実装順序を定義する。

---

## 1. 移行の全体像

### 1.1 移行の目的
- モックデータから実データベースへの段階的な移行
- クリーンアーキテクチャに基づいた実装
- 既存機能を壊さない段階的な移行
- テスト可能な実装

### 1.2 移行の原則
- **段階的移行**: 一度にすべてを移行せず、機能ごとに段階的に移行
- **後方互換性**: 移行中も既存のモックデータが動作するようにする
- **テスト駆動**: 各段階で動作確認を行いながら進める
- **ロールバック可能**: 問題が発生した場合に元に戻せるようにする

---

## 2. 移行前の準備

### 2.1 現状の確認

**モックデータの使用箇所**:
- `app/browse/company/page.tsx`: `mockCompanies`, `sortOptions`
- `app/organization/page.tsx`: `mockOrganizationDashboard`, `mockAppliedCompanies`, `mockKeptCompanies`, `mockBrowsedCompanies`, `mockChatRooms`
- `components/TopFilters.tsx`: `industryOptions`, `sponsorshipTypeOptions`, `regionOptions`
- `components/Sidebar.tsx`: `industryOptions`, `sponsorshipTypeOptions`, `regionOptions`

**依存関係**:
- 現在: Supabaseクライアントが存在（`lib/supabase.ts`）
- 移行先: PostgreSQL + Prisma（推奨）または TypeORM

### 2.2 必要なツール・ライブラリの選定

**データベース**:
- PostgreSQL 15+（Dockerで起動）

**ORM/クエリビルダー**:
- **Prisma**（推奨）: 型安全性、マイグレーション管理、開発体験が良い
- 代替: TypeORM（より柔軟だが設定が複雑）

**その他**:
- Docker & Docker Compose（ローカルDB起動用）
- dotenv（環境変数管理）

---

## 3. 移行の実装順序

### フェーズ1: インフラストラクチャの準備（1-2日）

#### ステップ1.1: Docker環境の構築
- [x] `docker-compose.yml` の作成
- [ ] Dockerデーモンの起動確認
- [ ] PostgreSQLコンテナの起動
- [ ] データベース接続確認

**Docker起動手順**:
詳細は `DOCKER_SETUP.md` を参照してください。

簡単な手順:
1. Docker Desktopを起動（macOSの場合）
2. Dockerデーモンが起動していることを確認:
   ```bash
   docker ps
   ```
3. PostgreSQLコンテナを起動:
   ```bash
   docker-compose up -d
   ```
4. コンテナの状態を確認:
   ```bash
   docker-compose ps
   ```
5. ログを確認（問題がある場合）:
   ```bash
   docker-compose logs postgres
   ```

#### ステップ1.2: Prismaの導入
- [ ] Prismaのインストール
- [ ] `prisma/schema.prisma` の作成
- [ ] データベーススキーマの定義（DATABASE_DESIGN.mdに基づく）

#### ステップ1.3: 環境変数の設定
- [ ] `.env` ファイルの作成
- [ ] データベース接続文字列の設定
- [ ] `.env.example` の作成

**完了条件**:
- DockerでPostgreSQLが起動している
- Prismaでデータベースに接続できる
- マイグレーションが実行できる

---

### フェーズ2: データベーススキーマの実装（2-3日）

#### ステップ2.1: 基本テーブルの作成
優先順位順に実装：

1. **マスタテーブル**（依存関係が少ない）
   - [ ] `tags`（業界タグなど）
   - [ ] `regions`（地域マスタ）

2. **ユーザー関連テーブル**
   - [ ] `users`
   - [ ] `user_profiles`

3. **企業関連テーブル**
   - [ ] `companies`
   - [ ] `company_contacts`
   - [ ] `company_tags`（中間テーブル）
   - [ ] `sponsorship_conditions`
   - [ ] `sponsorship_plans`
   - [ ] `sponsorship_plan_types`（中間テーブル）
   - [ ] `achievements`

4. **学生団体関連テーブル**
   - [ ] `organizations`
   - [ ] `organization_members`

5. **その他のテーブル**
   - [ ] `proposals`
   - [ ] `chat_rooms`
   - [ ] `chat_messages`
   - [ ] `kept_companies`
   - [ ] `browsed_companies`

#### ステップ2.2: マイグレーションの実行
- [ ] 初期マイグレーションの作成
- [ ] マイグレーションの実行
- [ ] スキーマの検証

#### ステップ2.3: 初期データの投入（シード）
- [ ] シードスクリプトの作成
- [ ] マスタデータの投入（tags, regions）
- [ ] テスト用データの投入（オプション）

**完了条件**:
- すべてのテーブルが作成されている
- 外部キー制約が正しく設定されている
- インデックスが作成されている
- シードデータが投入されている

---

### フェーズ3: リポジトリ層の実装（3-4日）

#### ステップ3.1: リポジトリインターフェースの定義
クリーンアーキテクチャに基づき、ドメインレイヤにインターフェースを定義：

- [ ] `src/domain/repositories/CompanyRepository.ts`
- [ ] `src/domain/repositories/OrganizationRepository.ts`
- [ ] `src/domain/repositories/TagRepository.ts`
- [ ] `src/domain/repositories/ProposalRepository.ts`
- [ ] `src/domain/repositories/ChatRepository.ts`

#### ステップ3.2: リポジトリ実装（インフラレイヤ）
Prismaを使用した実装：

- [ ] `src/infrastructure/repositories/PrismaCompanyRepository.ts`
- [ ] `src/infrastructure/repositories/PrismaOrganizationRepository.ts`
- [ ] `src/infrastructure/repositories/PrismaTagRepository.ts`
- [ ] `src/infrastructure/repositories/PrismaProposalRepository.ts`
- [ ] `src/infrastructure/repositories/PrismaChatRepository.ts`

#### ステップ3.3: リポジトリのテスト
- [ ] ユニットテストの作成
- [ ] 統合テストの作成

**完了条件**:
- すべてのリポジトリインターフェースが定義されている
- すべてのリポジトリ実装が完了している
- テストが通っている

---

### フェーズ4: APIルートの実装（3-4日）

#### ステップ4.1: 企業関連API
- [ ] `GET /api/companies` - 企業一覧取得
- [ ] `GET /api/companies/[id]` - 企業詳細取得
- [ ] `GET /api/filters` - フィルタ選択肢取得

#### ステップ4.2: 学生団体関連API
- [ ] `GET /api/organizations/[id]` - 団体情報取得
- [ ] `GET /api/organizations/[id]/dashboard` - ダッシュボードデータ取得
- [ ] `GET /api/organizations/[id]/applied` - 応募済み企業取得
- [ ] `GET /api/organizations/[id]/kept` - キープ企業取得
- [ ] `GET /api/organizations/[id]/history` - 閲覧履歴取得

#### ステップ4.3: チャット関連API
- [ ] `GET /api/chat/rooms` - チャットルーム一覧取得
- [ ] `GET /api/chat/rooms/[id]/messages` - メッセージ取得
- [ ] `POST /api/chat/rooms/[id]/messages` - メッセージ送信

#### ステップ4.4: 提携申込API
- [ ] `POST /api/companies/[id]/proposals` - 提携申込

**完了条件**:
- すべてのAPIエンドポイントが実装されている
- エラーハンドリングが実装されている
- バリデーションが実装されている

---

### フェーズ5: フロントエンドの段階的移行（4-5日）

#### ステップ5.1: データフェッチング層の実装
- [ ] `lib/api/companies.ts` - 企業関連API呼び出し
- [ ] `lib/api/organizations.ts` - 学生団体関連API呼び出し
- [ ] `lib/api/chat.ts` - チャット関連API呼び出し

#### ステップ5.2: 企業一覧ページの移行
- [ ] `app/browse/company/page.tsx` の修正
  - モックデータのインポートを削除
  - API呼び出しに置き換え
  - ローディング状態の追加
  - エラーハンドリングの追加

#### ステップ5.3: 学生団体ダッシュボードの移行
- [ ] `app/organization/page.tsx` の修正
  - モックデータのインポートを削除
  - API呼び出しに置き換え
  - 各タブのデータ取得を実装

#### ステップ5.4: フィルタコンポーネントの移行
- [ ] `components/TopFilters.tsx` の修正
  - マスタデータをAPIから取得
- [ ] `components/Sidebar.tsx` の修正
  - マスタデータをAPIから取得

**完了条件**:
- すべてのページでモックデータが使われていない
- データがデータベースから取得されている
- ローディング状態とエラーハンドリングが実装されている

---

### フェーズ6: 認証・認可の実装（2-3日）

#### ステップ6.1: 認証システムの実装
- [ ] ログイン機能の実装
- [ ] セッション管理の実装
- [ ] JWTトークンの実装（オプション）

#### ステップ6.2: 認可の実装
- [ ] 企業ユーザーと学生団体ユーザーの識別
- [ ] 権限チェックミドルウェアの実装
- [ ] APIエンドポイントへの認可の適用

**完了条件**:
- ログイン機能が動作している
- ユーザータイプに応じた適切なリダイレクトが実装されている
- 認可が正しく機能している

---

### フェーズ7: テスト・最適化（2-3日）

#### ステップ7.1: テストの実装
- [ ] ユニットテストの追加
- [ ] 統合テストの追加
- [ ] E2Eテストの追加（オプション）

#### ステップ7.2: パフォーマンス最適化
- [ ] データベースクエリの最適化
- [ ] インデックスの見直し
- [ ] キャッシュの実装（オプション）

#### ステップ7.3: エラーハンドリングの強化
- [ ] エラーログの実装
- [ ] エラー通知の実装
- [ ] ユーザーフレンドリーなエラーメッセージ

**完了条件**:
- テストが通っている
- パフォーマンスが許容範囲内
- エラーハンドリングが適切に実装されている

---

## 4. 移行時の注意事項

### 4.1 段階的移行の戦略

**並行運用期間**:
- 移行中は、モックデータと実データベースを並行して使用可能にする
- 環境変数で切り替え可能にする（例: `USE_MOCK_DATA=true`）

**実装例**:
```typescript
// lib/data/companies.ts
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

export async function getCompanies() {
  if (USE_MOCK_DATA) {
    return mockCompanies;
  }
  // API呼び出し
  const response = await fetch('/api/companies');
  return response.json();
}
```

### 4.2 データ整合性の確保

- マイグレーション実行前のバックアップ
- トランザクションの適切な使用
- 外部キー制約の活用

### 4.3 ロールバック計画

各フェーズで以下を準備：
- マイグレーションのロールバック手順
- コードのロールバック手順（Git）
- データベースのバックアップからの復元手順

---

## 5. チェックリスト

### フェーズ1: インフラストラクチャ
- [ ] Docker Composeファイルの作成
- [ ] PostgreSQLコンテナの起動確認
- [ ] Prismaのインストール
- [ ] Prismaスキーマの作成
- [ ] 環境変数の設定

### フェーズ2: データベーススキーマ
- [ ] すべてのテーブルの作成
- [ ] 外部キー制約の設定
- [ ] インデックスの作成
- [ ] シードデータの投入

### フェーズ3: リポジトリ層
- [ ] リポジトリインターフェースの定義
- [ ] リポジトリ実装の完了
- [ ] テストの実装

### フェーズ4: APIルート
- [ ] 企業関連APIの実装
- [ ] 学生団体関連APIの実装
- [ ] チャット関連APIの実装
- [ ] 提携申込APIの実装

### フェーズ5: フロントエンド
- [ ] 企業一覧ページの移行
- [ ] 学生団体ダッシュボードの移行
- [ ] フィルタコンポーネントの移行
- [ ] モックデータの完全削除

### フェーズ6: 認証・認可
- [ ] ログイン機能の実装
- [ ] セッション管理の実装
- [ ] 認可の実装

### フェーズ7: テスト・最適化
- [ ] テストの実装
- [ ] パフォーマンス最適化
- [ ] エラーハンドリングの強化

---

## 6. トラブルシューティング

### 6.1 よくある問題

**問題1: データベース接続エラー**
- Dockerコンテナが起動しているか確認
- 環境変数の接続文字列を確認
- ポート番号が正しいか確認

**問題2: マイグレーションエラー**
- 既存のマイグレーションを確認
- データベースの状態を確認
- 必要に応じてマイグレーションをリセット

**問題3: 型エラー**
- Prismaクライアントの再生成（`npx prisma generate`）
- TypeScriptの型定義を確認

### 6.2 デバッグのヒント

- Prisma Studioでデータベースの内容を確認（`npx prisma studio`）
- ログを有効にしてSQLクエリを確認
- データベースの直接接続でデータを確認

---

## 7. 次のステップ

移行完了後：
1. 本番環境へのデプロイ準備
2. パフォーマンス監視の実装
3. バックアップ戦略の実装
4. ドキュメントの更新

---

© 2025 Co-Create Project Team. All rights reserved.

