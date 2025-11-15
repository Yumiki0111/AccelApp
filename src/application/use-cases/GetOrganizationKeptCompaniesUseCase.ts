import { prisma } from '../../infrastructure/database/prisma';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export interface KeptCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  planTitle: string;
  keptDate: Date;
  industryTags: string[];
  rating: number;
}

export class GetOrganizationKeptCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(organizationId: string): Promise<KeptCompany[]> {
    if (!organizationId) {
      throw new Error('組織IDが指定されていません');
    }

    const keptCompanies = await prisma.keptCompany.findMany({
      where: { organizationId },
      orderBy: { keptAt: 'desc' },
    });

    const companyIds = keptCompanies.map((kc) => kc.companyId);
    const companies = await this.companyRepository.findByIds(companyIds);
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    return keptCompanies.map((kept) => {
      const company = companyMap.get(kept.companyId);
      return {
        id: kept.id,
        companyId: kept.companyId,
        companyName: company?.name || '不明',
        companyLogoUrl: company?.logoUrl || null,
        planTitle: company?.plan.title || '',
        keptDate: kept.keptAt,
        industryTags: company?.industryTags || [],
        rating: company?.rating || 0,
      };
    });
  }
}

