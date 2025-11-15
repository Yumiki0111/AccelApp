/**
 * チャット関連API呼び出し
 */

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderType: 'user' | 'company';
  senderUserId: string | null;
  senderContactId: string | null;
  message: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  organizationId: string;
  companyId: string;
  proposalId: string | null;
  lastMessageAt: string | null;
  organizationUnreadCount: number;
  companyUnreadCount: number;
  messages: ChatMessage[];
}

/**
 * チャットルーム一覧を取得
 */
export async function getChatRooms(params: {
  organizationId?: string;
  companyId?: string;
}): Promise<ChatRoom[]> {
  const searchParams = new URLSearchParams();
  if (params.organizationId) searchParams.append('organizationId', params.organizationId);
  if (params.companyId) searchParams.append('companyId', params.companyId);

  const response = await fetch(`/api/chat/rooms?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`チャットルームの取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * チャットルームのメッセージ一覧を取得
 */
export async function getChatMessages(roomId: string): Promise<ChatMessage[]> {
  const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
  
  if (!response.ok) {
    throw new Error(`メッセージの取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * メッセージを送信
 */
export async function sendChatMessage(
  roomId: string,
  data: {
    senderType: 'user' | 'company';
    senderUserId?: string;
    senderContactId?: string;
    message: string;
  }
): Promise<ChatMessage> {
  const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'メッセージの送信に失敗しました' }));
    throw new Error(error.error || error.message || 'メッセージの送信に失敗しました');
  }

  return response.json();
}

