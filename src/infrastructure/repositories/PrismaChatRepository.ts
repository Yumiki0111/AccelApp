import {
  ChatRepository,
  ChatRoom,
  ChatMessage,
  CreateChatMessageParams,
} from '../../domain/repositories/ChatRepository';
import { prisma } from '../database/prisma';

export class PrismaChatRepository implements ChatRepository {
  async findRoomsByOrganizationId(organizationId: string): Promise<ChatRoom[]> {
    const rooms = await prisma.chatRoom.findMany({
      where: { organizationId },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return rooms.map((room) => this.mapChatRoom(room));
  }

  async findRoomsByCompanyId(companyId: string): Promise<ChatRoom[]> {
    const rooms = await prisma.chatRoom.findMany({
      where: { companyId },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return rooms.map((room) => this.mapChatRoom(room));
  }

  async findRoomById(id: string): Promise<ChatRoom | null> {
    const room = await prisma.chatRoom.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!room) return null;

    return this.mapChatRoom(room);
  }

  async findOrCreateRoom(
    organizationId: string,
    companyId: string,
    proposalId?: string
  ): Promise<ChatRoom> {
    // 既存のルームを検索
    const existingRoom = await prisma.chatRoom.findUnique({
      where: {
        organizationId_companyId: {
          organizationId,
          companyId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (existingRoom) {
      return this.mapChatRoom(existingRoom);
    }

    // 新規ルームを作成
    const newRoom = await prisma.chatRoom.create({
      data: {
        organizationId,
        companyId,
        proposalId: proposalId || null,
        organizationUnreadCount: 0,
        companyUnreadCount: 0,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.mapChatRoom(newRoom);
  }

  async createMessage(params: CreateChatMessageParams): Promise<ChatMessage> {
    const message = await prisma.chatMessage.create({
      data: {
        chatRoomId: params.chatRoomId,
        senderType: params.senderType,
        senderUserId: params.senderUserId || null,
        senderContactId: params.senderContactId || null,
        message: params.message,
        read: false,
      },
    });

    // ルームの最終メッセージ日時と未読数を更新
    await prisma.chatRoom.update({
      where: { id: params.chatRoomId },
      data: {
        lastMessageAt: message.createdAt,
        ...(params.senderType === 'user'
          ? { companyUnreadCount: { increment: 1 } }
          : { organizationUnreadCount: { increment: 1 } }),
      },
    });

    return {
      id: message.id,
      chatRoomId: message.chatRoomId,
      senderType: message.senderType,
      senderUserId: message.senderUserId,
      senderContactId: message.senderContactId,
      message: message.message,
      read: message.read,
      readAt: message.readAt,
      createdAt: message.createdAt,
    };
  }

  async markAsRead(messageId: string, userId?: string, contactId?: string): Promise<void> {
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    // ルームの未読数を更新
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { chatRoom: true },
    });

    if (message) {
      const isUser = message.senderType === 'company';
      await prisma.chatRoom.update({
        where: { id: message.chatRoomId },
        data: {
          ...(isUser
            ? { organizationUnreadCount: { decrement: 1 } }
            : { companyUnreadCount: { decrement: 1 } }),
        },
      });
    }
  }

  private mapChatRoom(room: any): ChatRoom {
    return {
      id: room.id,
      organizationId: room.organizationId,
      companyId: room.companyId,
      proposalId: room.proposalId,
      lastMessageAt: room.lastMessageAt,
      organizationUnreadCount: room.organizationUnreadCount,
      companyUnreadCount: room.companyUnreadCount,
      messages: room.messages.map((msg: any) => ({
        id: msg.id,
        chatRoomId: msg.chatRoomId,
        senderType: msg.senderType,
        senderUserId: msg.senderUserId,
        senderContactId: msg.senderContactId,
        message: msg.message,
        read: msg.read,
        readAt: msg.readAt,
        createdAt: msg.createdAt,
      })),
    };
  }
}

