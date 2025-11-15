/**
 * 学生団体関連API呼び出し
 */

export interface OrganizationProfile {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  joinCode: string;
  campus: string | null;
  contactEmail: string;
  contactPhone: string | null;
  logoUrl: string | null;
  representativeUserId: string | null;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  role: '代表' | '副代表' | '広報' | '財務' | 'メンバー';
  status: 'active' | 'pending' | 'invited';
  joinedAt: string | null;
  university?: string | null;
  faculty?: string | null;
  department?: string | null;
  grade?: number | null;
}

export interface OrganizationDashboard {
  profile: OrganizationProfile;
  members: OrganizationMember[];
  pendingRequests: OrganizationMember[];
}

export interface AppliedCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  planTitle: string;
  status: '申請済み' | '審査中' | '承認済み' | '却下';
  appliedDate: string;
}

export interface KeptCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  planTitle: string;
  keptDate: string;
  industryTags: string[];
  rating: number;
}

export interface BrowsedCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  planTitle: string;
  browsedDate: string;
  industryTags: string[];
  rating: number;
}

/**
 * 組織情報を取得
 */
export async function getOrganization(id: string): Promise<OrganizationProfile> {
  const response = await fetch(`/api/organizations/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('組織が見つかりません');
    }
    throw new Error(`組織情報の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 組織のダッシュボードデータを取得
 */
export async function getOrganizationDashboard(id: string): Promise<OrganizationDashboard> {
  const response = await fetch(`/api/organizations/${id}/dashboard`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('組織が見つかりません');
    }
    throw new Error(`ダッシュボードの取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 応募済み企業一覧を取得
 */
export async function getAppliedCompanies(id: string): Promise<AppliedCompany[]> {
  const response = await fetch(`/api/organizations/${id}/applied`);
  
  if (!response.ok) {
    throw new Error(`応募済み企業の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * キープ企業一覧を取得
 */
export async function getKeptCompanies(id: string): Promise<KeptCompany[]> {
  const response = await fetch(`/api/organizations/${id}/kept`);
  
  if (!response.ok) {
    throw new Error(`キープ企業の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 閲覧履歴を取得
 */
export async function getBrowsedCompanies(id: string): Promise<BrowsedCompany[]> {
  const response = await fetch(`/api/organizations/${id}/history`);
  
  if (!response.ok) {
    throw new Error(`閲覧履歴の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

