import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryFactory {
  create({
    id,
    name,
    description,
    createdAt,
    updatedAt,
    slug,
    isActive,
  }: {
    id?: number;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    slug: string;
    isActive?: boolean;
  }): Category {
    return Category.create({
      id,
      name,
      description,
      createdAt,
      updatedAt,
      slug,
      isActive,
    });
  }

  createFromPrisma(data: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    isActive: boolean;
  }): Category {
    return Category.create({
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      slug: data.slug,
      isActive: data.isActive,
    });
  }
}