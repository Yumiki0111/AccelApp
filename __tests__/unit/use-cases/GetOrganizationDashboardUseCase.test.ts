/**
 * GetOrganizationDashboardUseCase のユニットテスト
 */

import { GetOrganizationDashboardUseCase } from '@/src/application/use-cases/GetOrganizationDashboardUseCase';
import { OrganizationRepository } from '@/src/domain/repositories/OrganizationRepository';
import { ApplicationError, ErrorCode } from '@/lib/errors/error-handler';

class MockOrganizationRepository implements OrganizationRepository {
  async getDashboard() {
    return null;
  }

  async findById() {
    return null;
  }

  async findByJoinCode() {
    return null;
  }

  async getMembers() {
    return [];
  }
}

describe('GetOrganizationDashboardUseCase', () => {
  let useCase: GetOrganizationDashboardUseCase;
  let organizationRepository: MockOrganizationRepository;

  beforeEach(() => {
    organizationRepository = new MockOrganizationRepository();
    useCase = new GetOrganizationDashboardUseCase(organizationRepository);
  });

  describe('execute', () => {
    it('組織IDが指定されていない場合はエラーを投げる', async () => {
      await expect(useCase.execute('')).rejects.toThrow(ApplicationError);
      await expect(useCase.execute('')).rejects.toThrow('組織IDが指定されていません');
    });

    it('組織が見つからない場合はエラーを投げる', async () => {
      organizationRepository.getDashboard = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute('org-1')).rejects.toThrow(ApplicationError);
      await expect(useCase.execute('org-1')).rejects.toThrow('組織が見つかりません');
    });

    it('組織ダッシュボードを取得できる', async () => {
      const mockDashboard = {
        profile: {
          id: 'org-1',
          name: 'Test Organization',
          tagline: 'Test Tagline',
          description: 'Test Description',
          joinCode: 'TEST123',
          campus: 'Tokyo',
          contactEmail: 'test@example.com',
          contactPhone: '090-1234-5678',
          logoUrl: 'https://example.com/logo.png',
          representativeUserId: 'user-1',
          createdAt: new Date(),
        },
        members: [
          {
            id: 'member-1',
            userId: 'user-1',
            role: '代表' as const,
            status: 'active' as const,
            joinedAt: new Date(),
            university: 'Tokyo University',
            faculty: 'Engineering',
            department: 'Computer Science',
            grade: 3,
          },
        ],
        pendingRequests: [],
      };

      organizationRepository.getDashboard = jest.fn().mockResolvedValue(mockDashboard);

      const result = await useCase.execute('org-1');

      expect(organizationRepository.getDashboard).toHaveBeenCalledWith('org-1');
      expect(result).toBeDefined();
      expect(result?.profile.id).toBe('org-1');
      expect(result?.profile.name).toBe('Test Organization');
      expect(result?.members).toHaveLength(1);
    });
  });
});

