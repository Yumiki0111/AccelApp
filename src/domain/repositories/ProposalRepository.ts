/**
 * 提携申込リポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
 */

export interface Proposal {
  id: string;
  organizationId: string;
  companyId: string;
  planId: string | null;
  message: string;
  status: '申請済み' | '審査中' | '承認済み' | '却下';
  submittedByUserId: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedByUserId: string | null;
}

export interface CreateProposalParams {
  organizationId: string;
  companyId: string;
  planId?: string;
  message: string;
  submittedByUserId: string;
}

/**
 * 提携申込リポジトリインターフェース
 */
export interface ProposalRepository {
  /**
   * 提携申込を作成
   */
  create(params: CreateProposalParams): Promise<Proposal>;

  /**
   * 組織IDで提携申込一覧を取得
   */
  findByOrganizationId(organizationId: string): Promise<Proposal[]>;

  /**
   * 企業IDで提携申込一覧を取得
   */
  findByCompanyId(companyId: string): Promise<Proposal[]>;

  /**
   * IDで提携申込を取得
   */
  findById(id: string): Promise<Proposal | null>;
}

