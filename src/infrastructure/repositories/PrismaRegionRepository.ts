import { RegionRepository, Region } from '../../domain/repositories/RegionRepository';
import { prisma } from '../database/prisma';

export class PrismaRegionRepository implements RegionRepository {
  async findAll(): Promise<Region[]> {
    const regions = await prisma.region.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return regions.map((region) => ({
      id: region.id,
      code: region.code,
      name: region.name,
      displayOrder: region.displayOrder,
    }));
  }

  async findByCode(code: string): Promise<Region | null> {
    const region = await prisma.region.findUnique({
      where: { code },
    });

    if (!region) return null;

    return {
      id: region.id,
      code: region.code,
      name: region.name,
      displayOrder: region.displayOrder,
    };
  }
}

