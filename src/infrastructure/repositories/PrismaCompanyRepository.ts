import {
  CompanyRepository,
  CompanySearchParams,
  CompanyListResult,
  CompanyListItem,
  CompanyDetail,
} from '../../domain/repositories/CompanyRepository';
import { prisma } from '../database/prisma';

export class PrismaCompanyRepository implements CompanyRepository {
  async search(params: CompanySearchParams): Promise<CompanyListResult> {
    const {
      keyword,
      industryTags = [],
      sponsorshipTypes = [],
      regions = [],
      sortBy = 'rating',
      page = 1,
      limit = 20,
    } = params;

    const skip = (page - 1) * limit;

    // 検索条件の構築
    const where: any = {
      deletedAt: null,
    };

    // キーワード検索
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { philosophy: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // 業界タグフィルタ
    if (industryTags.length > 0) {
      where.companyTags = {
        some: {
          tag: {
            type: 'industry',
            label: { in: industryTags },
          },
        },
      };
    }

    // 協賛タイプフィルタと地域フィルタ
    if (sponsorshipTypes.length > 0 || regions.length > 0) {
      const sponsorshipPlanConditions: any = {
        isActive: true,
      };

      if (sponsorshipTypes.length > 0) {
        sponsorshipPlanConditions.sponsorshipPlanTypes = {
          some: {
            sponsorshipType: { in: sponsorshipTypes },
          },
        };
      }

      if (regions.length > 0) {
        sponsorshipPlanConditions.coverageArea = { in: regions };
      }

      where.sponsorshipPlans = {
        some: sponsorshipPlanConditions,
      };
    }

    // 並び替え
    const orderBy: any[] = [];
    switch (sortBy) {
      case 'rating':
        orderBy.push({ ratingScore: 'desc' }, { ratingCount: 'desc' });
        break;
      case 'new':
        orderBy.push({ createdAt: 'desc' });
        break;
      case 'reviewCount':
        orderBy.push({ ratingCount: 'desc' });
        break;
    }

    // 総件数の取得
    const total = await prisma.company.count({ where });

    // データの取得
    const companies = await prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        companyTags: {
          include: {
            tag: true,
          },
        },
        primaryContact: true,
        sponsorshipPlans: {
          where: { isActive: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sponsorshipPlanTypes: true,
          },
        },
        sponsorshipCondition: true,
      },
    });

    const companyListItems: CompanyListItem[] = companies.map((company: any) => {
      const industryTags = company.companyTags
        .filter((ct: any) => ct.tag.type === 'industry')
        .map((ct: any) => ct.tag.label);

      const primaryPlan = company.sponsorshipPlans[0];
      const sponsorshipTypes = primaryPlan
        ? primaryPlan.sponsorshipPlanTypes.map((spt: any) => spt.sponsorshipType)
        : [];

      return {
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
        heroImageUrl: company.heroImageUrl,
        industryTags,
        rating: company.ratingScore.toNumber(),
        reviewCount: company.ratingCount,
        contact: {
          name: company.primaryContact?.name || '',
          role: company.primaryContact?.role || '',
        },
        plan: {
          title: primaryPlan?.title || '',
          summary: primaryPlan?.summary || '',
          imageUrl: primaryPlan?.imageUrl,
        },
        conditions: {
          cashSupport: {
            available: company.sponsorshipCondition?.cashSupportAvailable || false,
            detail: company.sponsorshipCondition?.cashSupportDetail || null,
          },
          goodsSupport: {
            available: company.sponsorshipCondition?.goodsSupportAvailable || false,
            detail: company.sponsorshipCondition?.goodsSupportDetail || null,
          },
          mentoring: {
            available: company.sponsorshipCondition?.mentoringAvailable || false,
            detail: company.sponsorshipCondition?.mentoringDetail || null,
          },
          cohostEvent: {
            available: company.sponsorshipCondition?.cohostEventAvailable || false,
            detail: company.sponsorshipCondition?.cohostEventDetail || null,
          },
        },
        sponsorshipTypes,
        coverageArea: primaryPlan?.coverageArea || null,
      };
    });

    return {
      companies: companyListItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CompanyDetail | null> {
    const company = await prisma.company.findUnique({
      where: { id, deletedAt: null },
      include: {
        companyTags: {
          include: {
            tag: true,
          },
        },
        primaryContact: true,
        sponsorshipPlans: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          include: {
            sponsorshipPlanTypes: true,
          },
        },
        sponsorshipCondition: true,
        achievements: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!company) return null;

    const industryTags = company.companyTags
      .filter((ct) => ct.tag.type === 'industry')
      .map((ct) => ct.tag.label);

    const primaryPlan = company.sponsorshipPlans[0];
    const sponsorshipTypes = primaryPlan
      ? primaryPlan.sponsorshipPlanTypes.map((spt) => spt.sponsorshipType)
      : [];

    return {
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      heroImageUrl: company.heroImageUrl,
      industryTags,
      rating: company.ratingScore.toNumber(),
      reviewCount: company.ratingCount,
      contact: {
        name: company.primaryContact?.name || '',
        role: company.primaryContact?.role || '',
      },
      plan: {
        title: primaryPlan?.title || '',
        summary: primaryPlan?.summary || '',
        imageUrl: primaryPlan?.imageUrl,
      },
      conditions: {
        cashSupport: {
          available: company.sponsorshipCondition?.cashSupportAvailable || false,
          detail: company.sponsorshipCondition?.cashSupportDetail || null,
        },
        goodsSupport: {
          available: company.sponsorshipCondition?.goodsSupportAvailable || false,
          detail: company.sponsorshipCondition?.goodsSupportDetail || null,
        },
        mentoring: {
          available: company.sponsorshipCondition?.mentoringAvailable || false,
          detail: company.sponsorshipCondition?.mentoringDetail || null,
        },
        cohostEvent: {
          available: company.sponsorshipCondition?.cohostEventAvailable || false,
          detail: company.sponsorshipCondition?.cohostEventDetail || null,
        },
      },
      sponsorshipTypes,
      coverageArea: primaryPlan?.coverageArea || null,
      philosophy: company.philosophy,
      achievements: company.achievements.map((achievement) => ({
        id: achievement.id,
        organizationName: achievement.organizationName,
        eventName: achievement.eventName,
        description: achievement.description,
        logoUrl: achievement.logoUrl,
      })),
    };
  }

  async findByIds(ids: string[]): Promise<CompanyListItem[]> {
    const companies = await prisma.company.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      include: {
        companyTags: {
          include: {
            tag: true,
          },
        },
        primaryContact: true,
        sponsorshipPlans: {
          where: { isActive: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sponsorshipPlanTypes: true,
          },
        },
        sponsorshipCondition: true,
      },
    });

    return companies.map((company: any) => {
      const industryTags = company.companyTags
        .filter((ct: any) => ct.tag.type === 'industry')
        .map((ct: any) => ct.tag.label);

      const primaryPlan = company.sponsorshipPlans[0];
      const sponsorshipTypes = primaryPlan
        ? primaryPlan.sponsorshipPlanTypes.map((spt: any) => spt.sponsorshipType)
        : [];

      return {
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
        heroImageUrl: company.heroImageUrl,
        industryTags,
        rating: company.ratingScore.toNumber(),
        reviewCount: company.ratingCount,
        contact: {
          name: company.primaryContact?.name || '',
          role: company.primaryContact?.role || '',
        },
        plan: {
          title: primaryPlan?.title || '',
          summary: primaryPlan?.summary || '',
          imageUrl: primaryPlan?.imageUrl,
        },
        conditions: {
          cashSupport: {
            available: company.sponsorshipCondition?.cashSupportAvailable || false,
            detail: company.sponsorshipCondition?.cashSupportDetail || null,
          },
          goodsSupport: {
            available: company.sponsorshipCondition?.goodsSupportAvailable || false,
            detail: company.sponsorshipCondition?.goodsSupportDetail || null,
          },
          mentoring: {
            available: company.sponsorshipCondition?.mentoringAvailable || false,
            detail: company.sponsorshipCondition?.mentoringDetail || null,
          },
          cohostEvent: {
            available: company.sponsorshipCondition?.cohostEventAvailable || false,
            detail: company.sponsorshipCondition?.cohostEventDetail || null,
          },
        },
        sponsorshipTypes,
        coverageArea: primaryPlan?.coverageArea || null,
      };
    });
  }
}

