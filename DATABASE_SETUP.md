# データベース設定ガイド

このプロジェクトは、環境に応じて異なるデータベースに接続できます。

## ローカル開発環境

ローカルでは、Docker Composeで起動したPostgreSQLを使用します。

### セットアップ手順

1. Docker Composeでデータベースを起動:
```bash
docker-compose up -d postgres
```

2. 環境変数を設定（`.env`ファイル）:
```env
DATABASE_URL="postgresql://accelapp_user:accelapp_password@localhost:5432/accelapp_db?schema=public"
```

3. マイグレーションを適用:
```bash
npx prisma migrate deploy
# または開発環境で
npx prisma migrate dev
```

4. Prismaクライアントを生成:
```bash
npx prisma generate
```

## リモート環境（Vercel + Supabase）

リモート環境では、SupabaseのPostgreSQLデータベースを使用します。

### Supabase接続文字列の取得方法

1. Supabaseダッシュボードにアクセス
2. プロジェクト設定 → Database → Connection string
3. 接続プールを使用する場合（推奨）:
   - **Connection pooling** を選択
   - **Session mode** を選択
   - 接続文字列をコピー

### Vercelでの環境変数設定

Vercelダッシュボードで以下の環境変数を設定:

```
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

または直接接続（接続プールを使用しない場合）:
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 初回デプロイ時のマイグレーション

Vercelに初回デプロイする際は、マイグレーションを適用する必要があります。

#### 方法1: VercelのPost-Deployフックを使用

Vercelのダッシュボードで、デプロイ後に以下のコマンドを実行するように設定:
```bash
npx prisma migrate deploy
```

#### 方法2: ビルドスクリプトに追加（オプション）

`package.json`の`build`スクリプトを以下のように変更:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

**注意**: この方法は、マイグレーションが失敗した場合にビルドも失敗するため、慎重に使用してください。

#### 方法3: 手動で実行

デプロイ後、ローカルまたはCI/CDから実行:
```bash
DATABASE_URL="your-supabase-connection-string" npx prisma migrate deploy
```

## 接続の確認

### ローカル環境
```bash
# データベース接続を確認
npx prisma db pull

# Prisma Studioでデータベースを確認
npx prisma studio
```

### リモート環境
```bash
# 環境変数を設定して接続確認
DATABASE_URL="your-supabase-connection-string" npx prisma db pull
```

## トラブルシューティング

### 接続エラーが発生する場合

1. **接続文字列を確認**
   - パスワードが正しいか
   - プロジェクト参照IDが正しいか
   - リージョンが正しいか

2. **Supabaseの接続プール設定を確認**
   - 接続プールを使用する場合は、`pgbouncer=true`パラメータを含める
   - 直接接続を使用する場合は、`pgbouncer=true`を削除

3. **ファイアウォール設定を確認**
   - Supabaseのダッシュボードで、接続元IPアドレスが許可されているか確認

### マイグレーションエラーが発生する場合

1. **既存のスキーマとの競合を確認**
   ```bash
   npx prisma migrate status
   ```

2. **スキーマをリセット（開発環境のみ）**
   ```bash
   npx prisma migrate reset
   ```

## 環境変数の切り替え

環境に応じて`DATABASE_URL`を切り替えるだけで、自動的に適切なデータベースに接続されます。

- **ローカル**: `.env`ファイルの`DATABASE_URL`を使用
- **Vercel**: Vercelの環境変数`DATABASE_URL`を使用

Prismaクライアントは、環境変数から自動的に接続情報を読み取ります。

