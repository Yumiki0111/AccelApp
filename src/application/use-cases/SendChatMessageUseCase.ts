import { ChatRepository, CreateChatMessageParams } from '../../domain/repositories/ChatRepository';

export class SendChatMessageUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(params: CreateChatMessageParams) {
    if (!params.chatRoomId) {
      throw new Error('チャットルームIDが指定されていません');
    }
    if (!params.message || params.message.trim().length === 0) {
      throw new Error('メッセージが指定されていません');
    }
    if (!params.senderType) {
      throw new Error('送信者タイプが指定されていません');
    }

    return await this.chatRepository.createMessage(params);
  }
}

