export class Category {
  private constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public slug: string,
    public isActive: boolean,
  ) {}

  static create({
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
    return new Category(
      id || 0,
      name,
      description,
      createdAt || new Date(),
      updatedAt || new Date(),
      slug,
      isActive || false,
    );
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updateSlug(slug: string): void {
    this.slug = slug;
    this.updatedAt = new Date();
  }
}