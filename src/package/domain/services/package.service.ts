import { Package } from '../entities/package.entity';
import { Item } from '../entities/item.entity';
import { PackageItem } from '../entities/packageItem.entity';

export interface PackageServiceInterface {
  createPackage(createData: {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    itemIds?: number[];
  }): Promise<Package>;

  updatePackage(
    id: number,
    updateData: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: number;
    },
  ): Promise<Package>;

  deletePackage(id: number): Promise<void>;

  getPackageById(id: number): Promise<Package>;

  getByCategory(id : number ) : Promise<Package[]>

  getAllPackages(): Promise<Package[]>;

  getPackagesByCategory(categoryId: number): Promise<Package[]>;

  addItemToPackage(packageId: number, itemId: number): Promise<PackageItem>;

  removeItemFromPackage(packageId: number, itemId: number): Promise<void>;

  calculatePackagePrice(id: number): Promise<number>;
}

export interface ItemServiceInterface {
  createItem(createData: {
    name: string;
    description?: string;
    price: number;
  }): Promise<Item>;

  updateItem(
    id: number,
    updateData: {
      name?: string;
      description?: string;
      price?: number;
    },
  ): Promise<Item>;

  deleteItem(id: number): Promise<void>;

  getItemById(id: number): Promise<Item>;

  getAllItems(): Promise<Item[]>;
}

export const PACKAGE_SERVICE_TOKEN = Symbol('PACKAGE_SERVICE_TOKEN');
export const ITEM_SERVICE_TOKEN = Symbol('ITEM_SERVICE_TOKEN');