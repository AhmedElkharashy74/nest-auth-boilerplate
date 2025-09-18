import { Package } from '../entities/package.entity';
import { Item } from '../entities/item.entity';
import { PackageItem } from '../entities/packageItem.entity';

export interface PackageRepository {
  findById(id: number): Promise<Package | null>;
  findAll(): Promise<Package[]>;
  findByCategory(categoryId: number): Promise<Package[]>;
  save(pkge: Package): Promise<Package>;
  update(id: number, pkge: Partial<Package>): Promise<Package>;
  delete(id: number): Promise<void>;
  addItemToPackage(packageId: number, itemId: number): Promise<PackageItem>;
  removeItemFromPackage(packageId: number, itemId: number): Promise<void>;
  findPackageItems(packageId: number): Promise<PackageItem[]>;
  getByCategory(id : number) : Promise<Package[]>
}

export interface ItemRepository {
  findById(id: number): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  save(item: Item): Promise<Item>;
  update(id: number, item: Partial<Item>): Promise<Item>;
  delete(id: number): Promise<void>;
}

export const PACKAGE_REPOSITORY_TOKEN = Symbol('PACKAGE_REPOSITORY_TOKEN');
export const ITEM_REPOSITORY_TOKEN = Symbol('ITEM_REPOSITORY_TOKEN');