import { ChatRepository } from '../../domain/repositories/ChatRepository';

export class GetChatRoomsUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(organizationId?: string, companyId?: string) {
    if (organizationId) {
      return await this.chatRepository.findRoomsByOrganizationId(organizationId);
    } else if (companyId) {
      return await this.chatRepository.findRoomsByCompanyId(companyId);
    } else {
      throw new Error('組織IDまたは企業IDが指定されていません');
    }
  }
}

