/**
 * ViewCompanyDetailUseCase のユニットテスト
 */

import { ViewCompanyDetailUseCase } from '@/src/application/use-cases/ViewCompanyDetailUseCase';
import { CompanyRepository } from '@/src/domain/repositories/CompanyRepository';
import { ApplicationError, ErrorCode } from '@/lib/errors/error-handler';

class MockCompanyRepository implements CompanyRepository {
  async findById() {
    return null;
  }

  async search() {
    return {
      companies: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }

  async findByIds() {
    return [];
  }
}

describe('ViewCompanyDetailUseCase', () => {
  let useCase: ViewCompanyDetailUseCase;
  let companyRepository: MockCompanyRepository;

  beforeEach(() => {
    companyRepository = new MockCompanyRepository();
    useCase = new ViewCompanyDetailUseCase(companyRepository);
  });

  describe('execute', () => {
    it('企業IDが指定されていない場合はエラーを投げる', async () => {
      await expect(useCase.execute('')).rejects.toThrow(ApplicationError);
      await expect(useCase.execute('')).rejects.toThrow('企業IDが指定されていません');
    });

    it('企業が見つからない場合はnullを返す', async () => {
      companyRepository.findById = jest.fn().mockResolvedValue(null);

      const result = await useCase.execute('company-1');

      expect(companyRepository.findById).toHaveBeenCalledWith('company-1');
      expect(result).toBeNull();
    });

    it('企業詳細を取得できる', async () => {
      const mockCompany = {
        id: 'company-1',
        name: 'Test Company',
        logoUrl: 'https://example.com/logo.png',
        heroImageUrl: 'https://example.com/hero.png',
        philosophy: 'Test Philosophy',
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
        industryTags: ['IT'],
        achievements: [],
      };

      companyRepository.findById = jest.fn().mockResolvedValue(mockCompany);

      const result = await useCase.execute('company-1');

      expect(companyRepository.findById).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockCompany);
    });
  });
});

