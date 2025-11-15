import { OrganizationRepository } from '../../domain/repositories/OrganizationRepository';
import { ApplicationError, ErrorCode } from '../../../lib/errors/error-handler';

export class GetOrganizationDashboardUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(organizationId: string) {
    if (!organizationId) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        '組織IDが指定されていません'
      );
    }

    const dashboard = await this.organizationRepository.getDashboard(organizationId);

    if (!dashboard) {
      throw new ApplicationError(
        ErrorCode.RESOURCE_NOT_FOUND,
        '組織が見つかりません',
        { organizationId }
      );
    }

    return dashboard;
  }
}

