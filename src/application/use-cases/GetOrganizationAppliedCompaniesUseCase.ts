import { ProposalRepository } from '../../domain/repositories/ProposalRepository';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export interface AppliedCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  planTitle: string;
  status: '申請済み' | '審査中' | '承認済み' | '却下';
  appliedDate: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export class GetOrganizationAppliedCompaniesUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private companyRepository: CompanyRepository
  ) {}

  async execute(organizationId: string): Promise<AppliedCompany[]> {
    if (!organizationId) {
      throw new Error('組織IDが指定されていません');
    }

    const proposals = await this.proposalRepository.findByOrganizationId(organizationId);

    // 企業情報を取得
    const companyIds = proposals.map((p) => p.companyId);
    const companies = await this.companyRepository.findByIds(companyIds);
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    // 提案データと企業データを結合
    const appliedCompanies: AppliedCompany[] = proposals.map((proposal) => {
      const company = companyMap.get(proposal.companyId);
      return {
        id: proposal.id,
        companyId: proposal.companyId,
        companyName: company?.name || '不明',
        companyLogoUrl: company?.logoUrl || null,
        planTitle: company?.plan.title || '',
        status: proposal.status,
        appliedDate: proposal.submittedAt,
      };
    });

    return appliedCompanies;
  }
}

