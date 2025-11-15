import { ProposalRepository, CreateProposalParams } from '../../domain/repositories/ProposalRepository';
import { ApplicationError, ErrorCode } from '../../../lib/errors/error-handler';

export class SubmitProposalUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute(params: CreateProposalParams) {
    if (!params.organizationId) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        '組織IDが指定されていません',
        { organizationId: params.organizationId }
      );
    }
    if (!params.companyId) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        '企業IDが指定されていません',
        { companyId: params.companyId }
      );
    }
    if (!params.message || params.message.trim().length === 0) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        'メッセージが指定されていません'
      );
    }
    if (!params.submittedByUserId) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        '提出者IDが指定されていません',
        { submittedByUserId: params.submittedByUserId }
      );
    }

    // TODO: 重複チェック（同じ組織が同じ企業に既に申請しているか）
    // TODO: レート制限チェック

    return await this.proposalRepository.create(params);
  }
}

