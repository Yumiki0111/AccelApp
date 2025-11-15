/**
 * 学生団体リポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
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
  createdAt: Date;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  role: '代表' | '副代表' | '広報' | '財務' | 'メンバー';
  status: 'active' | 'pending' | 'invited';
  joinedAt: Date | null;
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

/**
 * 学生団体リポジトリインターフェース
 */
export interface OrganizationRepository {
  /**
   * 組織IDで組織を取得
   */
  findById(id: string): Promise<OrganizationProfile | null>;

  /**
   * 参加コードで組織を取得
   */
  findByJoinCode(joinCode: string): Promise<OrganizationProfile | null>;

  /**
   * 組織のダッシュボードデータを取得
   */
  getDashboard(organizationId: string): Promise<OrganizationDashboard | null>;

  /**
   * 組織のメンバー一覧を取得
   */
  getMembers(organizationId: string): Promise<OrganizationMember[]>;
}

