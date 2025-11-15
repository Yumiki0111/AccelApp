# トラブルシューティングガイド

## リモート環境での500エラーの対処法

### 1. データベース接続の確認

リモート環境（Vercel）で500エラーが発生している場合、まずデータベース接続を確認してください。

#### ヘルスチェックエンドポイント

デプロイ後、以下のURLにアクセスしてデータベース接続状態を確認できます：

```
https://your-app.vercel.app/api/health
```

正常な場合のレスポンス：
```json
{
  "status": "ok",
  "message": "データベース接続正常",
  "database": {
    "connected": true,
    "url": "postgresql://..."
  }
}
```

エラーの場合のレスポンス：
```json
{
  "status": "error",
  "message": "データベース接続エラー",
  "database": {
    "connected": false,
    "error": "エラーメッセージ"
  }
}
```

### 2. Vercelの環境変数の確認

Vercelダッシュボードで以下の環境変数が設定されているか確認してください：

1. **Settings** → **Environment Variables** に移動
2. 以下の環境変数が設定されているか確認：
   - `DATABASE_URL`: SupabaseのPostgreSQL接続文字列
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL（オプション）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー（オプション）

#### Supabaseの接続文字列の取得方法

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. **Settings** → **Database** に移動
4. **Connection string** セクションで **URI** を選択
5. 接続文字列をコピー（パスワードを実際のパスワードに置き換える）

例：
```
postgresql://postgres:[YOUR-PASSWORD]@db.ykgbqllyynznalhiwmld.supabase.co:5432/postgres
```

### 3. データベーススキーマの確認

データベースにスキーマが存在しない場合、マイグレーションを適用する必要があります。

#### Supabaseにマイグレーションを適用する方法

1. **ローカルでSupabaseプロジェクトにリンク**：
   ```bash
   supabase link --project-ref ykgbqllyynznalhiwmld
   ```
   （パスワードの入力が必要）

2. **マイグレーションをプッシュ**：
   ```bash
   supabase db push
   ```

3. **または、Supabaseダッシュボードから直接SQLを実行**：
   - Supabaseダッシュボード → **SQL Editor** に移動
   - `supabase/migrations/` ディレクトリ内のSQLファイルを順番に実行

### 4. ブラウザのコンソールでエラー詳細を確認

エラーハンドリングを改善したため、ブラウザのコンソールに詳細なエラーメッセージが表示されます。

1. ブラウザの開発者ツールを開く（F12）
2. **Console** タブを選択
3. エラーメッセージを確認：
   - `フィルタ取得エラー詳細:` または `企業一覧取得エラー詳細:` というログを探す
   - `type: "database_connection_error"` が表示されている場合、データベース接続の問題です

### 5. Vercelのログを確認

Vercelダッシュボードでサーバー側のログを確認できます：

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. **Deployments** タブを選択
4. 最新のデプロイメントをクリック
5. **Functions** タブでログを確認

エラーログには以下の情報が含まれます：
- `isDatabaseError: true/false`
- `databaseUrl: "設定済み" / "未設定"`
- エラーメッセージの詳細

### 6. よくある問題と解決方法

#### 問題1: `DATABASE_URL環境変数が設定されていません`

**解決方法**：
- Vercelの環境変数設定で `DATABASE_URL` を追加
- デプロイを再実行

#### 問題2: `Can't reach database server`

**解決方法**：
- Supabaseの接続文字列が正しいか確認
- Supabaseプロジェクトがアクティブか確認
- ファイアウォール設定を確認（SupabaseのIPアドレスが許可されているか）

#### 問題3: `relation "Tag" does not exist`

**解決方法**：
- データベースにスキーマが存在しない
- `supabase db push` を実行してマイグレーションを適用

#### 問題4: `password authentication failed`

**解決方法**：
- Supabaseの接続文字列のパスワードが正しいか確認
- Supabaseダッシュボードでパスワードをリセット

### 7. デバッグ用のエンドポイント

以下のエンドポイントでデータベース接続状態を確認できます：

- `/api/health`: データベース接続のヘルスチェック
- `/api/test-supabase`: Supabaseクライアントの接続テスト（オプション）

### 8. 次のステップ

エラーの詳細が確認できたら、以下の情報を共有してください：

1. ヘルスチェックエンドポイントのレスポンス
2. ブラウザコンソールのエラーメッセージ
3. Vercelのログ（可能な場合）

これらの情報があれば、より具体的な解決策を提案できます。

