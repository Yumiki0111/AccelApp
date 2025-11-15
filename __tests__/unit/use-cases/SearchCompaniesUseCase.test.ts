/**
 * SearchCompaniesUseCaseのユニットテスト
 */

import { SearchCompaniesUseCase } from '@/src/application/use-cases/SearchCompaniesUseCase';
import { CompanyRepository, CompanySearchParams } from '@/src/domain/repositories/CompanyRepository';

// モックリポジトリ
class MockCompanyRepository implements CompanyRepository {
  async search(params: CompanySearchParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const total = 1;
    const totalPages = Math.ceil(total / limit);

    return {
      companies: [
        {
          id: '1',
          name: 'Test Company',
          logoUrl: null,
          heroImageUrl: null,
          industryTags: ['IT'],
          rating: 4.5,
          reviewCount: 10,
          contact: { name: 'Test Contact', role: 'Manager' },
          plan: { title: 'Test Plan', summary: 'Test Summary', imageUrl: null },
          conditions: {
            cashSupport: { available: true, detail: 'Up to 100k' },
            goodsSupport: { available: false, detail: null },
            mentoring: { available: true, detail: 'Weekly' },
            cohostEvent: { available: false, detail: null },
          },
          sponsorshipTypes: ['金銭協賛'],
          coverageArea: 'Tokyo',
        },
      ],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById() {
    return null;
  }

  async findByIds() {
    return [];
  }
}

describe('SearchCompaniesUseCase', () => {
  let useCase: SearchCompaniesUseCase;
  let companyRepository: MockCompanyRepository;

  beforeEach(() => {
    companyRepository = new MockCompanyRepository();
    useCase = new SearchCompaniesUseCase(companyRepository);
  });

  describe('execute', () => {
    it('検索条件なしで企業一覧を取得できる', async () => {
      const result = await useCase.execute({});

      expect(result.companies).toHaveLength(1);
      expect(result.companies[0].name).toBe('Test Company');
      expect(result.total).toBe(1);
    });

    it('キーワード検索が動作する', async () => {
      const result = await useCase.execute({ keyword: 'Test' });

      expect(result.companies).toHaveLength(1);
    });

    it('業界フィルタが動作する', async () => {
      const result = await useCase.execute({ industryTags: ['IT'] });

      expect(result.companies).toHaveLength(1);
    });

    it('ページネーションが動作する', async () => {
      const result = await useCase.execute({ page: 2, limit: 10 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('ページ番号が1未満の場合はエラーを投げる', async () => {
      await expect(useCase.execute({ page: 0 })).rejects.toThrow(
        'ページ番号は1以上である必要があります'
      );
    });

    it('取得件数が100を超える場合はエラーを投げる', async () => {
      await expect(useCase.execute({ limit: 101 })).rejects.toThrow(
        '取得件数は1以上100以下である必要があります'
      );
    });
  });
});

