/**
 * LoadFiltersUseCase のユニットテスト
 */

import { LoadFiltersUseCase } from '@/src/application/use-cases/LoadFiltersUseCase';
import { TagRepository } from '@/src/domain/repositories/TagRepository';
import { RegionRepository } from '@/src/domain/repositories/RegionRepository';

class MockTagRepository implements TagRepository {
  async findByType() {
    return [
      { id: 'tag-1', type: 'industry' as const, label: 'IT', displayOrder: 1 },
      { id: 'tag-2', type: 'industry' as const, label: '金融', displayOrder: 2 },
    ];
  }
}

class MockRegionRepository implements RegionRepository {
  async findAll() {
    return [
      { id: 'region-1', code: 'JP-13', name: '東京都', displayOrder: 1 },
      { id: 'region-2', code: 'JP-27', name: '大阪府', displayOrder: 2 },
    ];
  }
}

describe('LoadFiltersUseCase', () => {
  let useCase: LoadFiltersUseCase;
  let tagRepository: MockTagRepository;
  let regionRepository: MockRegionRepository;

  beforeEach(() => {
    tagRepository = new MockTagRepository();
    regionRepository = new MockRegionRepository();
    useCase = new LoadFiltersUseCase(tagRepository, regionRepository);
  });

  describe('execute', () => {
    it('フィルタオプションを取得できる', async () => {
      const result = await useCase.execute();

      expect(result).toHaveProperty('industries');
      expect(result).toHaveProperty('sponsorshipTypes');
      expect(result).toHaveProperty('regions');
    });

    it('業界タグが正しく変換される', async () => {
      const result = await useCase.execute();

      expect(result.industries).toHaveLength(2);
      expect(result.industries[0]).toEqual({ id: 'tag-1', label: 'IT' });
      expect(result.industries[1]).toEqual({ id: 'tag-2', label: '金融' });
    });

    it('地域が正しく変換される', async () => {
      const result = await useCase.execute();

      expect(result.regions).toHaveLength(2);
      expect(result.regions[0]).toEqual({
        id: 'region-1',
        code: 'JP-13',
        name: '東京都',
      });
      expect(result.regions[1]).toEqual({
        id: 'region-2',
        code: 'JP-27',
        name: '大阪府',
      });
    });

    it('協賛タイプが固定値で返される', async () => {
      const result = await useCase.execute();

      expect(result.sponsorshipTypes).toHaveLength(4);
      expect(result.sponsorshipTypes).toEqual([
        { value: '金銭協賛', label: '金銭協賛' },
        { value: '物品提供', label: '物品提供' },
        { value: 'メンタリング', label: 'メンタリング' },
        { value: 'イベント共催', label: 'イベント共催' },
      ]);
    });

    it('タグが存在しない場合は空配列を返す', async () => {
      tagRepository.findByType = jest.fn().mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result.industries).toHaveLength(0);
    });

    it('地域が存在しない場合は空配列を返す', async () => {
      regionRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result.regions).toHaveLength(0);
    });
  });
});

