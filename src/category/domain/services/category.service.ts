import { Category } from '../entities/category.entity';

export interface CategoryServiceInterface {
  createCategory(
    name: string,
    description: string,
    slug: string,
  ): Promise<Category>;
  getCategoryById(id: number): Promise<Category>;
  getCategoryBySlug(slug: string): Promise<Category>;
  getAllCategories(): Promise<Category[]>;
  updateCategory(
    id: number,
    updates: { name?: string; description?: string; slug?: string },
  ): Promise<Category>;
  activateCategory(id: number): Promise<Category>;
  deactivateCategory(id: number): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
}