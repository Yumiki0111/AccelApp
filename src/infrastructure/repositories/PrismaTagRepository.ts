import { TagRepository, Tag } from '../../domain/repositories/TagRepository';
import { prisma } from '../database/prisma';

export class PrismaTagRepository implements TagRepository {
  async findByType(type: 'industry' | 'feature' | 'university'): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: { type },
      orderBy: { displayOrder: 'asc' },
    });

    return tags.map((tag: any) => ({
      id: tag.id,
      type: tag.type,
      label: tag.label,
      displayOrder: tag.displayOrder,
    }));
  }

  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: [{ type: 'asc' }, { displayOrder: 'asc' }],
    });

    return tags.map((tag: any) => ({
      id: tag.id,
      type: tag.type,
      label: tag.label,
      displayOrder: tag.displayOrder,
    }));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) return null;

    return {
      id: tag.id,
      type: tag.type,
      label: tag.label,
      displayOrder: tag.displayOrder,
    };
  }
}

