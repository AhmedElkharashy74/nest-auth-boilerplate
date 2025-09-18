import { Injectable, Inject } from '@nestjs/common';
import { Category } from 'src/category/domain/entities/category.entity';
import type { CategoryRepository } from 'src/category/domain/repositories/category.repository';
import { CategoryServiceInterface } from 'src/category/domain/services/category.service';
import { CategoryFactory } from 'src/category/domain/factories/category.factory';

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryFactory: CategoryFactory,
  ) {}

  async createCategory(
    name: string,
    description: string,
    slug: string,
  ): Promise<Category> {
    const slugExists = await this.categoryRepository.existsBySlug(slug);
    if (slugExists) {
      throw new Error('Category with this slug already exists');
    }

    const category = this.categoryFactory.create({
      name,
      description,
      slug,
    });

    return this.categoryRepository.save(category);
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async updateCategory(
    id: number,
    updates: { name?: string; description?: string; slug?: string },
  ): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (updates.name) {
      category.updateName(updates.name);
    }

    if (updates.description) {
      category.updateDescription(updates.description);
    }

    if (updates.slug && updates.slug !== category.slug) {
      const slugExists = await this.categoryRepository.existsBySlug(updates.slug);
      if (slugExists) {
        throw new Error('Category with this slug already exists');
      }
      category.updateSlug(updates.slug);
    }

    return this.categoryRepository.save(category);
  }

  async activateCategory(id: number): Promise<Category> {
    const category = await this.getCategoryById(id);
    category.activate();
    return this.categoryRepository.save(category);
  }

  async deactivateCategory(id: number): Promise<Category> {
    const category = await this.getCategoryById(id);
    category.deactivate();
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.getCategoryById(id); // Verify category exists
    return this.categoryRepository.delete(id);
  }
}