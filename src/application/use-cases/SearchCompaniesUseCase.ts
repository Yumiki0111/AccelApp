import { CompanyRepository, CompanySearchParams, CompanyListResult } from '../../domain/repositories/CompanyRepository';
import { ApplicationError, ErrorCode } from '../../../lib/errors/error-handler';

export class SearchCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(params: CompanySearchParams): Promise<CompanyListResult> {
    // バリデーション
    if (params.page !== undefined && params.page < 1) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        'ページ番号は1以上である必要があります',
        { page: params.page }
      );
    }
    if (params.limit !== undefined && (params.limit < 1 || params.limit > 100)) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        '取得件数は1以上100以下である必要があります',
        { limit: params.limit }
      );
    }

    return await this.companyRepository.search(params);
  }
}

