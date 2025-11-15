/**
 * SubmitProposalUseCase のユニットテスト
 */

import { SubmitProposalUseCase } from '@/src/application/use-cases/SubmitProposalUseCase';
import { ProposalRepository } from '@/src/domain/repositories/ProposalRepository';
import { ApplicationError, ErrorCode } from '@/lib/errors/error-handler';

class MockProposalRepository implements ProposalRepository {
  async create() {
    return {
      id: 'proposal-1',
      organizationId: 'org-1',
      companyId: 'company-1',
      planId: 'plan-1',
      message: 'Test message',
      status: '申請済み' as const,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedByUserId: null,
    };
  }

  async findByOrganizationId() {
    return [];
  }
}

describe('SubmitProposalUseCase', () => {
  let useCase: SubmitProposalUseCase;
  let proposalRepository: MockProposalRepository;

  beforeEach(() => {
    proposalRepository = new MockProposalRepository();
    useCase = new SubmitProposalUseCase(proposalRepository);
  });

  describe('execute', () => {
    it('提案を提出できる', async () => {
      const params = {
        organizationId: 'org-1',
        companyId: 'company-1',
        planId: 'plan-1',
        message: 'Test proposal message',
        submittedByUserId: 'user-1',
      };

      const result = await useCase.execute(params);

      expect(result).toBeDefined();
      expect(result.id).toBe('proposal-1');
      expect(result.status).toBe('申請済み');
    });

    it('組織IDが指定されていない場合はエラーを投げる', async () => {
      const params = {
        organizationId: '',
        companyId: 'company-1',
        planId: 'plan-1',
        message: 'Test message',
        submittedByUserId: 'user-1',
      };

      await expect(useCase.execute(params)).rejects.toThrow(ApplicationError);
      await expect(useCase.execute(params)).rejects.toThrow('組織IDが指定されていません');
    });

    it('企業IDが指定されていない場合はエラーを投げる', async () => {
      const params = {
        organizationId: 'org-1',
        companyId: '',
        planId: 'plan-1',
        message: 'Test message',
        submittedByUserId: 'user-1',
      };

      await expect(useCase.execute(params)).rejects.toThrow(ApplicationError);
      await expect(useCase.execute(params)).rejects.toThrow('企業IDが指定されていません');
    });

    it('メッセージが指定されていない場合はエラーを投げる', async () => {
      const params = {
        organizationId: 'org-1',
        companyId: 'company-1',
        planId: 'plan-1',
        message: '',
        submittedByUserId: 'user-1',
      };

      await expect(useCase.execute(params)).rejects.toThrow(ApplicationError);
      await expect(useCase.execute(params)).rejects.toThrow('メッセージが指定されていません');
    });

    it('メッセージが空白のみの場合はエラーを投げる', async () => {
      const params = {
        organizationId: 'org-1',
        companyId: 'company-1',
        planId: 'plan-1',
        message: '   ',
        submittedByUserId: 'user-1',
      };

      await expect(useCase.execute(params)).rejects.toThrow(ApplicationError);
      await expect(useCase.execute(params)).rejects.toThrow('メッセージが指定されていません');
    });

    it('提出者IDが指定されていない場合はエラーを投げる', async () => {
      const params = {
        organizationId: 'org-1',
        companyId: 'company-1',
        planId: 'plan-1',
        message: 'Test message',
        submittedByUserId: '',
      };

      await expect(useCase.execute(params)).rejects.toThrow(ApplicationError);
      await expect(useCase.execute(params)).rejects.toThrow('提出者IDが指定されていません');
    });
  });
});

