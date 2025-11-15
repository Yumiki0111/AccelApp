/**
 * PrismaChatRepository のユニットテスト
 */

import { PrismaChatRepository } from '@/src/infrastructure/repositories/PrismaChatRepository';
import { prisma } from '@/src/infrastructure/database/prisma';

// Prismaクライアントをモック
jest.mock('@/src/infrastructure/database/prisma', () => ({
  prisma: {
    chatRoom: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    chatMessage: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('PrismaChatRepository', () => {
  let repository: PrismaChatRepository;
  const mockPrisma = prisma as unknown as {
    chatRoom: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    chatMessage: {
      create: jest.Mock;
      findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    repository = new PrismaChatRepository();
    jest.clearAllMocks();
  });

  describe('findRoomsByOrganizationId', () => {
    it('組織IDでチャットルーム一覧を取得できる', async () => {
      const mockRooms = [
        {
          id: 'room-1',
          organizationId: 'org-1',
          companyId: 'company-1',
          proposalId: null,
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
      ];

      mockPrisma.chatRoom.findMany.mockResolvedValue(mockRooms);

      const result = await repository.findRoomsByOrganizationId('org-1');

      expect(mockPrisma.chatRoom.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
        orderBy: { lastMessageAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('room-1');
    });

    it('チャットルームが存在しない場合は空配列を返す', async () => {
      mockPrisma.chatRoom.findMany.mockResolvedValue([]);

      const result = await repository.findRoomsByOrganizationId('org-1');

      expect(result).toHaveLength(0);
    });
  });

  describe('findRoomsByCompanyId', () => {
    it('企業IDでチャットルーム一覧を取得できる', async () => {
      const mockRooms = [
        {
          id: 'room-1',
          organizationId: 'org-1',
          companyId: 'company-1',
          proposalId: null,
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
      ];

      mockPrisma.chatRoom.findMany.mockResolvedValue(mockRooms);

      const result = await repository.findRoomsByCompanyId('company-1');

      expect(mockPrisma.chatRoom.findMany).toHaveBeenCalledWith({
        where: { companyId: 'company-1' },
        orderBy: { lastMessageAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findRoomById', () => {
    it('チャットルームIDでルームを取得できる', async () => {
      const mockRoom = {
        id: 'room-1',
        organizationId: 'org-1',
        companyId: 'company-1',
        proposalId: null,
        lastMessageAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      };

      mockPrisma.chatRoom.findUnique.mockResolvedValue(mockRoom);

      const result = await repository.findRoomById('room-1');

      expect(mockPrisma.chatRoom.findUnique).toHaveBeenCalledWith({
        where: { id: 'room-1' },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe('room-1');
    });

    it('ルームが存在しない場合はnullを返す', async () => {
      mockPrisma.chatRoom.findUnique.mockResolvedValue(null);

      const result = await repository.findRoomById('nonexistent-room');

      expect(result).toBeNull();
    });
  });

  describe('createMessage', () => {
    it('メッセージを作成できる', async () => {
      const params = {
        chatRoomId: 'room-1',
        senderType: 'user' as const,
        senderUserId: 'user-1',
        message: 'Test message',
      };

      const mockMessage = {
        id: 'message-1',
        chatRoomId: params.chatRoomId,
        senderType: params.senderType,
        senderUserId: params.senderUserId,
        senderContactId: null,
        message: params.message,
        read: false,
        readAt: null,
        createdAt: new Date(),
      };

      mockPrisma.chatMessage.create.mockResolvedValue(mockMessage);
      mockPrisma.chatRoom.findUnique.mockResolvedValue({
        id: 'room-1',
        lastMessageAt: new Date(),
      });
      mockPrisma.chatRoom.update.mockResolvedValue({
        id: 'room-1',
        organizationId: 'org-1',
        companyId: 'company-1',
        lastMessageAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await repository.createMessage(params);

      expect(mockPrisma.chatMessage.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.id).toBe('message-1');
    });
  });
});

