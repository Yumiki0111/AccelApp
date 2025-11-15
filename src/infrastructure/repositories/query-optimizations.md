# クエリ最適化の実装

## 最適化内容

### 1. インデックスの追加
- `companies.deletedAt` - ソフトデリートのフィルタリングを高速化
- `companies.name` - 企業名検索を高速化
- `organizations.deletedAt` - ソフトデリートのフィルタリングを高速化

### 2. クエリの最適化
- `include`の最適化 - 必要なリレーションのみ取得
- `where`条件の最適化 - インデックスを活用できる条件を優先

### 3. N+1問題の回避
- リレーションを`include`で一括取得
- 不要なリレーションの取得を削減

---

## パフォーマンス改善の期待値

- 企業検索API: 300ms以下
- 組織ダッシュボード取得: 200ms以下
- 企業詳細取得: 150ms以下

---

© 2025 Co-Create Project Team. All rights reserved.

