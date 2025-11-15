import { TagRepository } from '../../domain/repositories/TagRepository';
import { RegionRepository } from '../../domain/repositories/RegionRepository';

export interface FilterOptions {
  industries: { id: string; label: string }[];
  sponsorshipTypes: { value: string; label: string }[];
  regions: { id: string; code: string; name: string }[];
}

export class LoadFiltersUseCase {
  constructor(
    private tagRepository: TagRepository,
    private regionRepository: RegionRepository
  ) {}

  async execute(): Promise<FilterOptions> {
    // 業界タグを取得
    const industryTags = await this.tagRepository.findByType('industry');
    const industries = industryTags.map((tag) => ({
      id: tag.id,
      label: tag.label,
    }));

    // 地域を取得
    const regions = await this.regionRepository.findAll();
    const regionOptions = regions.map((region) => ({
      id: region.id,
      code: region.code,
      name: region.name,
    }));

    // 協賛タイプは固定値
    const sponsorshipTypes = [
      { value: '金銭協賛', label: '金銭協賛' },
      { value: '物品提供', label: '物品提供' },
      { value: 'メンタリング', label: 'メンタリング' },
      { value: 'イベント共催', label: 'イベント共催' },
    ];

    return {
      industries,
      sponsorshipTypes,
      regions: regionOptions,
    };
  }
}

