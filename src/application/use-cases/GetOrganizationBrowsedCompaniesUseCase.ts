import { prisma } from '../../infrastructure/database/prisma';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export interface BrowsedCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  planTitle: string;
  browsedDate: Date;
  industryTags: string[];
  rating: number;
}

export class GetOrganizationBrowsedCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(organizationId: string): Promise<BrowsedCompany[]> {
    if (!organizationId) {
      throw new Error('組織IDが指定されていません');
    }

    const browsedCompanies = await prisma.browsedCompany.findMany({
      where: { organizationId },
      orderBy: { browsedAt: 'desc' },
      take: 50, // 最新50件まで
    });

    const companyIds = browsedCompanies.map((bc: { companyId: string }) => bc.companyId);
    const companies = await this.companyRepository.findByIds(companyIds);
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    return browsedCompanies.map((browsed) => {
      const company = companyMap.get(browsed.companyId);
      return {
        id: browsed.id,
        companyId: browsed.companyId,
        companyName: company?.name || '不明',
        companyLogoUrl: company?.logoUrl || null,
        planTitle: company?.plan.title || '',
        browsedDate: browsed.browsedAt,
        industryTags: company?.industryTags || [],
        rating: company?.rating || 0,
      };
    });
  }
}

