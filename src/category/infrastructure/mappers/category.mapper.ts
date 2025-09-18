import { Prisma } from '@prisma/client';
import { Category } from 'src/category/domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(prismaCategory: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    isActive: boolean;
  }): Category {
    return Category.create({
      id: prismaCategory.id,
      name: prismaCategory.name,
      description: prismaCategory.description,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
      slug: prismaCategory.slug,
      isActive: prismaCategory.isActive,
    });
  }

  static toPrisma(category: Category): Prisma.CategoryCreateInput {
    return {
      name: category.name,
      description: category.description,
      slug: category.slug,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}