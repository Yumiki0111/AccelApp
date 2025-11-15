/**
 * タグリポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
 */

export interface Tag {
  id: string;
  type: 'industry' | 'feature' | 'university';
  label: string;
  displayOrder: number;
}

/**
 * タグリポジトリインターフェース
 */
export interface TagRepository {
  /**
   * タイプ別にタグ一覧を取得
   */
  findByType(type: 'industry' | 'feature' | 'university'): Promise<Tag[]>;

  /**
   * すべてのタグを取得
   */
  findAll(): Promise<Tag[]>;

  /**
   * IDでタグを取得
   */
  findById(id: string): Promise<Tag | null>;
}

