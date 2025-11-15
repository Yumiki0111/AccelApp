/**
 * PrismaRegionRepository のユニットテスト
 */

import { PrismaRegionRepository } from '@/src/infrastructure/repositories/PrismaRegionRepository';
import { prisma } from '@/src/infrastructure/database/prisma';

// Prismaクライアントをモック
jest.mock('@/src/infrastructure/database/prisma', () => ({
  prisma: {
    region: {
      findMany: jest.fn(),
    },
  },
}));

describe('PrismaRegionRepository', () => {
  let repository: PrismaRegionRepository;
  const mockPrisma = prisma as jest.Mocked<typeof prisma>;

  beforeEach(() => {
    repository = new PrismaRegionRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('全ての地域を取得できる', async () => {
      const mockRegions = [
        {
          id: 'region-1',
          code: 'JP-13',
          name: '東京都',
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'region-2',
          code: 'JP-27',
          name: '大阪府',
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.region.findMany.mockResolvedValue(mockRegions);

      const result = await repository.findAll();

      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
        orderBy: { displayOrder: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('region-1');
      expect(result[0].code).toBe('JP-13');
      expect(result[0].name).toBe('東京都');
      expect(result[1].id).toBe('region-2');
      expect(result[1].code).toBe('JP-27');
      expect(result[1].name).toBe('大阪府');
    });

    it('地域が存在しない場合は空配列を返す', async () => {
      mockPrisma.region.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });

    it('表示順序でソートされる', async () => {
      const mockRegions = [
        {
          id: 'region-2',
          code: 'JP-27',
          name: '大阪府',
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'region-1',
          code: 'JP-13',
          name: '東京都',
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.region.findMany.mockResolvedValue(mockRegions);

      const result = await repository.findAll();

      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
        orderBy: { displayOrder: 'asc' },
      });
      // モックの戻り値はそのまま返されるが、実際の実装ではソートされる
      expect(result).toHaveLength(2);
    });
  });
});

