# Docker環境セットアップガイド

ローカル開発用のPostgreSQLデータベースをDockerで起動する手順。

---

## 前提条件

- Docker Desktopがインストールされていること
- Dockerデーモンが起動していること

---

## セットアップ手順

### 1. Docker Desktopの起動

**macOS**:
- Docker Desktopアプリケーションを起動
- メニューバーにDockerアイコンが表示されることを確認

**確認方法**:
```bash
docker ps
```
エラーが出ない場合は、Dockerデーモンが起動しています。

### 2. PostgreSQLコンテナの起動

プロジェクトルートで以下のコマンドを実行:

```bash
docker-compose up -d
```

**オプション説明**:
- `-d`: バックグラウンドで実行（デタッチモード）

### 3. コンテナの状態確認

```bash
docker-compose ps
```

以下のように表示されれば正常に起動しています:

```
NAME                IMAGE               STATUS
accelapp-postgres   postgres:15-alpine  Up
```

### 4. データベース接続確認

以下のコマンドでデータベースに接続できます:

```bash
docker-compose exec postgres psql -U accelapp_user -d accelapp_db
```

接続が成功すると、PostgreSQLのプロンプトが表示されます:
```
accelapp_db=#
```

### 5. ログの確認

問題が発生した場合、ログを確認:

```bash
docker-compose logs postgres
```

---

## データベース情報

- **ホスト**: `localhost`
- **ポート**: `5432`
- **データベース名**: `accelapp_db`
- **ユーザー名**: `accelapp_user`
- **パスワード**: `accelapp_password`

**接続文字列**:
```
postgresql://accelapp_user:accelapp_password@localhost:5432/accelapp_db?schema=public
```

---

## よくある操作

### コンテナの停止

```bash
docker-compose stop
```

### コンテナの再起動

```bash
docker-compose restart
```

### コンテナの停止と削除

```bash
docker-compose down
```

**注意**: `docker-compose down` を実行すると、コンテナは削除されますが、データはボリュームに保存されているため保持されます。

### データベースの完全削除（データも削除）

```bash
docker-compose down -v
```

**警告**: このコマンドを実行すると、すべてのデータが削除されます。

### コンテナ内でSQLを実行

```bash
docker-compose exec postgres psql -U accelapp_user -d accelapp_db -c "SELECT version();"
```

---

## トラブルシューティング

### 問題1: "Cannot connect to the Docker daemon"

**原因**: Dockerデーモンが起動していない

**解決方法**:
1. Docker Desktopを起動
2. メニューバーのDockerアイコンを確認
3. 数秒待ってから再度試す

### 問題2: ポート5432が既に使用されている

**原因**: 既にPostgreSQLが起動している

**解決方法**:
1. 既存のPostgreSQLを停止する
2. または、`docker-compose.yml`のポート番号を変更する

### 問題3: コンテナが起動しない

**解決方法**:
1. ログを確認:
   ```bash
   docker-compose logs postgres
   ```
2. コンテナを再作成:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## 次のステップ

Docker環境が起動したら、以下を実行:

1. `.env`ファイルを作成（`env.example`をコピー）
2. Prismaのセットアップ（`MIGRATION_STRATEGY.md`を参照）
3. データベースマイグレーションの実行

---

© 2025 Co-Create Project Team. All rights reserved.

