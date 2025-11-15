/**
 * 地域リポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
 */

export interface Region {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
}

/**
 * 地域リポジトリインターフェース
 */
export interface RegionRepository {
  /**
   * すべての地域を取得（表示順序順）
   */
  findAll(): Promise<Region[]>;

  /**
   * コードで地域を取得
   */
  findByCode(code: string): Promise<Region | null>;
}

