import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from 'src/category/domain/entities/category.entity';
import { CategoryRepository } from 'src/category/domain/repositories/category.repository';
import { CategoryMapper } from '../mappers/category.mapper';


@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return CategoryMapper.toDomain(category);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return null;
    }

    return CategoryMapper.toDomain(category);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map(CategoryMapper.toDomain);
  }

  async save(category: Category): Promise<Category> {
    const prismaData = CategoryMapper.toPrisma(category);

    let savedCategory;
    if (category.id) {
      savedCategory = await this.prisma.category.update({
        where: { id: category.id },
        data: prismaData,
      });
    } else {
      savedCategory = await this.prisma.category.create({
        data: prismaData,
      });
    }

    return CategoryMapper.toDomain(savedCategory);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: { slug },
    });
    return count > 0;
  }
}