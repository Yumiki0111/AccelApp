/**
 * PrismaAuthRepository のユニットテスト
 */

import { PrismaAuthRepository } from '@/src/infrastructure/repositories/PrismaAuthRepository';
import { prisma } from '@/src/infrastructure/database/prisma';
import bcrypt from 'bcryptjs';

// Prismaクライアントとbcryptをモック
jest.mock('@/src/infrastructure/database/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('PrismaAuthRepository', () => {
  let repository: PrismaAuthRepository;
  const mockPrisma = prisma as jest.Mocked<typeof prisma>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    repository = new PrismaAuthRepository();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('正しい認証情報でユーザーを認証できる', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User',
        userType: 'organization' as const,
        emailVerified: true,
        status: 'active' as const,
        lastActiveAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        organizationMembers: [
          {
            organizationId: 'org-1',
            organization: {
              id: 'org-1',
              name: 'Test Organization',
            },
          },
        ],
        companyContacts: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(true as any);

      const result = await repository.authenticate('test@example.com', 'password123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
        include: {
          organizationMembers: { take: 1 },
          companyContacts: { take: 1 },
        },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
      expect(result?.userType).toBe('organization');
    });

    it('間違ったパスワードで認証に失敗する', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User',
        userType: 'organization' as const,
        emailVerified: true,
        status: 'active' as const,
        lastActiveAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        organizationId: 'org-1',
        companyId: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(false as any);

      const result = await repository.authenticate('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });

    it('ユーザーが存在しない場合はnullを返す', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.authenticate('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('ユーザーのステータスがactiveでない場合はnullを返す', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User',
        userType: 'organization' as const,
        emailVerified: true,
        status: 'pending' as const,
        lastActiveAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        organizationMembers: [],
        companyContacts: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(true as any);

      const result = await repository.authenticate('test@example.com', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('createSession', () => {
    it('セッションを作成できる', async () => {
      const userId = 'user-1';
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const mockSession = {
        id: 'session-1',
        userId,
        sessionToken: 'test-token-123',
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.session.create.mockResolvedValue(mockSession as any);

      const result = await repository.createSession(userId, expiresAt);

      expect(mockPrisma.session.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.sessionToken).toBeDefined();
      expect(result.expiresAt).toEqual(expiresAt);
      // sessionTokenはランダムに生成されるため、値の検証はしない
    });
  });

  describe('getSessionByToken', () => {
    it('セッショントークンでセッションを取得できる', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'user-1',
        sessionToken: 'test-token-123',
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.session.findUnique.mockResolvedValue(mockSession as any);

      const result = await repository.getSessionByToken('test-token-123');

      expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
        where: { sessionToken: 'test-token-123' },
      });
      expect(result).toBeDefined();
      expect(result?.sessionToken).toBe('test-token-123');
    });

    it('セッションが存在しない場合はnullを返す', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(null);

      const result = await repository.getSessionByToken('nonexistent-token');

      expect(result).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('セッションを削除できる', async () => {
      mockPrisma.session.delete.mockResolvedValue({} as any);

      await repository.deleteSession('test-token-123');

      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { sessionToken: 'test-token-123' },
      });
    });
  });

  describe('deleteAllUserSessions', () => {
    it('ユーザーの全セッションを削除できる', async () => {
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 3 } as any);

      await repository.deleteAllUserSessions('user-1');

      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('deleteExpiredSessions', () => {
    it('期限切れセッションを削除できる', async () => {
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 5 } as any);

      const result = await repository.deleteExpiredSessions();

      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
      expect(result).toBe(5);
    });
  });
});

