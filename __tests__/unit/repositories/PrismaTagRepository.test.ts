/**
 * PrismaTagRepository のユニットテスト
 */

import { PrismaTagRepository } from '@/src/infrastructure/repositories/PrismaTagRepository';
import { prisma } from '@/src/infrastructure/database/prisma';

// Prismaクライアントをモック
jest.mock('@/src/infrastructure/database/prisma', () => ({
  prisma: {
    tag: {
      findMany: jest.fn(),
    },
  },
}));

describe('PrismaTagRepository', () => {
  let repository: PrismaTagRepository;
  const mockPrisma = prisma as jest.Mocked<typeof prisma>;

  beforeEach(() => {
    repository = new PrismaTagRepository();
    jest.clearAllMocks();
  });

  describe('findByType', () => {
    it('業界タグを取得できる', async () => {
      const mockTags = [
        {
          id: 'tag-1',
          type: 'industry' as const,
          label: 'IT',
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'tag-2',
          type: 'industry' as const,
          label: '金融',
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.tag.findMany.mockResolvedValue(mockTags);

      const result = await repository.findByType('industry');

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: { type: 'industry' },
        orderBy: { displayOrder: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('tag-1');
      expect(result[0].label).toBe('IT');
      expect(result[1].id).toBe('tag-2');
      expect(result[1].label).toBe('金融');
    });

    it('タグが存在しない場合は空配列を返す', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([]);

      const result = await repository.findByType('industry');

      expect(result).toHaveLength(0);
    });

    it('異なるタイプのタグを取得できる', async () => {
      const mockTags = [
        {
          id: 'tag-3',
          type: 'feature' as const,
          label: 'リモートワーク',
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.tag.findMany.mockResolvedValue(mockTags);

      const result = await repository.findByType('feature');

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: { type: 'feature' },
        orderBy: { displayOrder: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('feature');
    });
  });
});

