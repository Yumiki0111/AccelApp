/**
 * 企業関連API呼び出し
 */

export interface CompanySearchParams {
  keyword?: string;
  industries?: string[];
  sponsorshipTypes?: string[];
  regions?: string[];
  sort?: 'rating' | 'new' | 'reviewCount';
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
 * 企業一覧を検索・取得
 */
export async function searchCompanies(params: CompanySearchParams): Promise<CompanyListResult> {
  const searchParams = new URLSearchParams();
  
  if (params.keyword) searchParams.append('keyword', params.keyword);
  if (params.industries) {
    params.industries.forEach((industry) => searchParams.append('industries[]', industry));
  }
  if (params.sponsorshipTypes) {
    params.sponsorshipTypes.forEach((type) => searchParams.append('sponsorshipTypes[]', type));
  }
  if (params.regions) {
    params.regions.forEach((region) => searchParams.append('regions[]', region));
  }
  if (params.sort) searchParams.append('sort', params.sort);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`/api/companies?${searchParams.toString()}`);
  
  if (!response.ok) {
    let errorMessage = `企業一覧の取得に失敗しました: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error;
      }
    } catch (parseError) {
      // JSON解析に失敗した場合、レスポンスのテキストを取得
      try {
        const text = await response.text();
        if (text) {
          errorMessage = `企業一覧の取得に失敗しました: ${text}`;
        }
      } catch (textError) {
        // テキスト取得にも失敗した場合は、デフォルトメッセージを使用
        console.error('エラーレスポンスの解析に失敗:', textError);
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * 企業詳細を取得
 */
export async function getCompanyDetail(id: string): Promise<CompanyDetail> {
  const response = await fetch(`/api/companies/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('企業が見つかりません');
    }
    throw new Error(`企業詳細の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 提携申込を送信
 */
export async function submitProposal(
  companyId: string,
  data: {
    organizationId: string;
    planId?: string;
    message: string;
    submittedByUserId: string;
  }
): Promise<void> {
  const response = await fetch(`/api/companies/${companyId}/proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '提携申込に失敗しました' }));
    throw new Error(error.error || error.message || '提携申込に失敗しました');
  }
}

