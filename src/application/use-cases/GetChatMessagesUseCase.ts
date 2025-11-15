import { ChatRepository } from '../../domain/repositories/ChatRepository';

export class GetChatMessagesUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(chatRoomId: string) {
    if (!chatRoomId) {
      throw new Error('チャットルームIDが指定されていません');
    }

    const room = await this.chatRepository.findRoomById(chatRoomId);

    if (!room) {
      throw new Error('チャットルームが見つかりません');
    }

    return room.messages;
  }
}

