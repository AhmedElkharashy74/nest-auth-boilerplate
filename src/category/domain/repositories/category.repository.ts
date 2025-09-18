import { Category } from '../entities/category.entity';

export interface CategoryRepository {
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  delete(id: number): Promise<void>;
  existsBySlug(slug: string): Promise<boolean>;
}