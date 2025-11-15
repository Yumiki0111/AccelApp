/**
 * PrismaProposalRepository のユニットテスト
 */

import { PrismaProposalRepository } from '@/src/infrastructure/repositories/PrismaProposalRepository';
import { prisma } from '@/src/infrastructure/database/prisma';

// Prismaクライアントをモック
jest.mock('@/src/infrastructure/database/prisma', () => ({
  prisma: {
    proposal: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('PrismaProposalRepository', () => {
  let repository: PrismaProposalRepository;
  const mockPrisma = prisma as jest.Mocked<typeof prisma>;

  beforeEach(() => {
    repository = new PrismaProposalRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('提案を作成できる', async () => {
      const params = {
        organizationId: 'org-1',
        companyId: 'company-1',
        planId: 'plan-1',
        message: 'Test proposal message',
        submittedByUserId: 'user-1',
      };

      const mockProposal = {
        id: 'proposal-1',
        organizationId: params.organizationId,
        companyId: params.companyId,
        planId: params.planId,
        message: params.message,
        status: '申請済み' as const,
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.proposal.create.mockResolvedValue(mockProposal as any);

      const result = await repository.create(params);

      expect(mockPrisma.proposal.create).toHaveBeenCalledWith({
        data: {
          organizationId: params.organizationId,
          companyId: params.companyId,
          planId: params.planId,
          message: params.message,
          status: '申請済み',
          submittedByUserId: params.submittedByUserId,
          submittedAt: expect.any(Date),
        },
      });
      expect(result).toBeDefined();
      expect(result.id).toBe('proposal-1');
      expect(result.status).toBe('申請済み');
    });
  });

  describe('findByOrganizationId', () => {
    it('組織IDで提案一覧を取得できる', async () => {
      const mockProposals = [
        {
          id: 'proposal-1',
          organizationId: 'org-1',
          companyId: 'company-1',
          planId: 'plan-1',
          message: 'Test message 1',
          status: '申請済み' as const,
          submittedAt: new Date(),
          reviewedAt: null,
          reviewedByUserId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'proposal-2',
          organizationId: 'org-1',
          companyId: 'company-2',
          planId: 'plan-2',
          message: 'Test message 2',
          status: '審査中' as const,
          submittedAt: new Date(),
          reviewedAt: null,
          reviewedByUserId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.proposal.findMany.mockResolvedValue(mockProposals as any);

      const result = await repository.findByOrganizationId('org-1');

      expect(mockPrisma.proposal.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
        orderBy: { submittedAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('proposal-1');
      expect(result[1].id).toBe('proposal-2');
    });

    it('提案が存在しない場合は空配列を返す', async () => {
      mockPrisma.proposal.findMany.mockResolvedValue([]);

      const result = await repository.findByOrganizationId('org-1');

      expect(result).toHaveLength(0);
    });
  });
});

