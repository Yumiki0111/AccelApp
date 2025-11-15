/**
 * 企業リポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
 */

export interface CompanySearchParams {
  keyword?: string;
  industryTags?: string[];
  sponsorshipTypes?: string[];
  regions?: string[];
  sortBy?: 'rating' | 'new' | 'reviewCount';
  page?: number;
  limit?: number;
}

export interface CompanyListItem {
  id: string;
  name: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  industryTags: string[];
  rating: number;
  reviewCount: number;
  contact: {
    name: string;
    role: string;
  };
  plan: {
    title: string;
    summary: string;
    imageUrl: string | null;
  };
  conditions: {
    cashSupport: { available: boolean; detail: string | null };
    goodsSupport: { available: boolean; detail: string | null };
    mentoring: { available: boolean; detail: string | null };
    cohostEvent: { available: boolean; detail: string | null };
  };
  sponsorshipTypes: string[];
  coverageArea: string | null;
}

export interface CompanyDetail extends CompanyListItem {
  philosophy: string | null;
  achievements: {
    id: string;
    organizationName: string;
    eventName: string;
    description: string | null;
    logoUrl: string | null;
  }[];
}

export interface CompanyListResult {
  companies: CompanyListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 企業リポジトリインターフェース
 */
export interface CompanyRepository {
  /**
   * 企業一覧を検索・取得
   */
  search(params: CompanySearchParams): Promise<CompanyListResult>;

  /**
   * 企業詳細を取得
   */
  findById(id: string): Promise<CompanyDetail | null>;

  /**
   * 企業IDの配列から一括取得
   */
  findByIds(ids: string[]): Promise<CompanyListItem[]>;
}

