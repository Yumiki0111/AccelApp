import { CompanyRepository, CompanyDetail } from '../../domain/repositories/CompanyRepository';
import { ApplicationError, ErrorCode } from '../../../lib/errors/error-handler';

export class ViewCompanyDetailUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(companyId: string): Promise<CompanyDetail | null> {
    if (!companyId) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        '企業IDが指定されていません'
      );
    }

    return await this.companyRepository.findById(companyId);
  }
}

