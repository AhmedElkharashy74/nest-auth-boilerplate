export class CategoryResponseDto {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    isActive: boolean;
  
    constructor(category: {
      id: number;
      name: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      slug: string;
      isActive: boolean;
    }) {
      this.id = category.id;
      this.name = category.name;
      this.description = category.description;
      this.createdAt = category.createdAt;
      this.updatedAt = category.updatedAt;
      this.slug = category.slug;
      this.isActive = category.isActive;
    }
  }