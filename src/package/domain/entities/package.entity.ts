import { PackageItem } from "./packageItem.entity";



export class Package {
    constructor(
      public id: number,
      public name: string,
      public description: string | null,
      public price: number,
      public categoryId: number,
      public createdAt: Date,
      public updatedAt: Date,
      public packageItems?: PackageItem[],
    ) {}
  
    static create(createProps: {
      name: string;
      description?: string;
      price: number;
      categoryId: number;
      packageItems?: PackageItem[];
    }): Package {
      const now = new Date();
      return new Package(
        0, // ID will be assigned by database
        createProps.name,
        createProps.description || null,
        createProps.price,
        createProps.categoryId,
        now,
        now,
        createProps.packageItems || [],
      );
    }
  
    update(updateProps: {
      name?: string;
      description?: string | null;
      price?: number;
      categoryId?: number;
    }): void {
      if (updateProps.name !== undefined) this.name = updateProps.name;
      if (updateProps.description !== undefined) this.description = updateProps.description;
      if (updateProps.price !== undefined) this.price = updateProps.price;
      if (updateProps.categoryId !== undefined) this.categoryId = updateProps.categoryId;
      this.updatedAt = new Date();
    }
  
    addItem(item: PackageItem): void {
      if (!this.packageItems) {
        this.packageItems = [];
      }
      this.packageItems.push(item);
      this.updatedAt = new Date();
    }
  
    removeItem(itemId: number): void {
      if (this.packageItems) {
        this.packageItems = this.packageItems.filter(pi => pi.itemId !== itemId);
        this.updatedAt = new Date();
      }
    }
  
    calculateTotalPrice(): number {
      if (!this.packageItems || this.packageItems.length === 0) {
        return this.price;
      }
      return this.packageItems.reduce((total, packageItem) => {
        return total + (packageItem.item?.price || 0);
      }, this.price);
    }
  }