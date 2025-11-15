/**
 * チャットリポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
 */

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderType: 'user' | 'company';
  senderUserId: string | null;
  senderContactId: string | null;
  message: string;
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  organizationId: string;
  companyId: string;
  proposalId: string | null;
  lastMessageAt: Date | null;
  organizationUnreadCount: number;
  companyUnreadCount: number;
  messages: ChatMessage[];
}

export interface CreateChatMessageParams {
  chatRoomId: string;
  senderType: 'user' | 'company';
  senderUserId?: string;
  senderContactId?: string;
  message: string;
}

/**
 * チャットリポジトリインターフェース
 */
export interface ChatRepository {
  /**
   * 組織IDでチャットルーム一覧を取得
   */
  findRoomsByOrganizationId(organizationId: string): Promise<ChatRoom[]>;

  /**
   * 企業IDでチャットルーム一覧を取得
   */
  findRoomsByCompanyId(companyId: string): Promise<ChatRoom[]>;

  /**
   * チャットルームを取得（メッセージ含む）
   */
  findRoomById(id: string): Promise<ChatRoom | null>;

  /**
   * チャットルームを作成または取得
   */
  findOrCreateRoom(organizationId: string, companyId: string, proposalId?: string): Promise<ChatRoom>;

  /**
   * メッセージを作成
   */
  createMessage(params: CreateChatMessageParams): Promise<ChatMessage>;

  /**
   * メッセージを既読にする
   */
  markAsRead(messageId: string, userId?: string, contactId?: string): Promise<void>;
}

