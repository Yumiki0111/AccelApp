# 認証・認可システム設計書

## 1. 認証方式

### 1.1 認証方式の選択
- **方式**: セッションベース認証（Next.js Server Actions + Cookies）
- **理由**: 
  - Next.js App Routerとの親和性が高い
  - セキュアなHTTPOnly Cookieでセッション管理
  - サーバーサイドでの認証状態管理が容易

### 1.2 セッション管理
- **セッションストレージ**: データベース（`sessions`テーブル）
- **セッション有効期限**: 30日間
- **セッション更新**: アクティビティがある限り自動更新

---

## 2. データベース設計

### 2.1 sessions（セッション）
セッション情報を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | セッションID |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | ユーザーID |
| session_token | VARCHAR(255) | UNIQUE, NOT NULL | セッショントークン（ランダム文字列） |
| expires_at | TIMESTAMP WITH TIME ZONE | NOT NULL | 有効期限 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_sessions_token` ON sessions(session_token) WHERE expires_at > NOW()
- `idx_sessions_user` ON sessions(user_id)

---

## 3. 認証フロー

### 3.1 ログインフロー
1. ユーザーがメールアドレスとパスワードを入力
2. サーバーでパスワードハッシュを検証
3. セッショントークンを生成
4. `sessions`テーブルにセッションを保存
5. HTTPOnly Cookieにセッショントークンを設定
6. ユーザータイプに応じてリダイレクト

### 3.2 ログアウトフロー
1. セッショントークンをCookieから取得
2. `sessions`テーブルからセッションを削除
3. Cookieを削除

### 3.3 セッション検証フロー
1. リクエスト時にCookieからセッショントークンを取得
2. `sessions`テーブルでセッションを検証
3. 有効期限をチェック
4. 有効な場合はユーザー情報を取得
5. 無効な場合はログインページにリダイレクト

---

## 4. API設計

### 4.1 認証API
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/session` - セッション情報取得
- `POST /api/auth/register` - 新規登録（将来実装）

### 4.2 リクエスト/レスポンス

#### POST /api/auth/login
**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "ユーザー名",
    "userType": "organization"
  },
  "organizationId": "uuid" // userTypeがorganizationの場合
}
```

---

## 5. 認可設計

### 5.1 ユーザータイプ別の権限

| ユーザータイプ | アクセス可能なページ | 実行可能な操作 |
|--------------|-------------------|--------------|
| organization | `/browse/company`, `/organization` | 企業検索、提携申込、チャット |
| company | `/browse/company`, `/company/dashboard`（将来） | 企業情報編集、申込確認、チャット |

### 5.2 ミドルウェア
- `middleware.ts` - 認証チェック、認可チェック
- 保護されたルートへのアクセス時に認証を確認
- ユーザータイプに応じたリダイレクト

---

## 6. 実装順序

1. **セッションテーブルの作成**（マイグレーション）
2. **認証リポジトリの実装**（Domain/Infrastructure層）
3. **認証UseCaseの実装**（Application層）
4. **認証APIの実装**（Interface層）
5. **認証ミドルウェアの実装**
6. **ログインページの実装**（Presentation層）
7. **セッション管理ユーティリティの実装**

---

© 2025 Co-Create Project Team. All rights reserved.

