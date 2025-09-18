import { Injectable, Inject } from '@nestjs/common';
import {
  PackageServiceInterface,
  PACKAGE_SERVICE_TOKEN,
} from '../../domain/services/package.service';
import {
  ItemServiceInterface,
  ITEM_SERVICE_TOKEN,
} from '../../domain/services/package.service';
import { Package } from '../../domain/entities/package.entity';
import { Item } from '../../domain/entities/item.entity';
import { PackageItem } from '../../domain/entities/packageItem.entity';
import { PACKAGE_REPOSITORY_TOKEN } from '../../domain/repositories/package.repository.interface';
import { ITEM_REPOSITORY_TOKEN } from '../../domain/repositories/package.repository.interface';
import type { ItemRepository } from '../../domain/repositories/package.repository.interface';
import type { PackageRepository } from '../../domain/repositories/package.repository.interface';

@Injectable()
export class PackageService implements PackageServiceInterface {
  constructor(
    @Inject(PACKAGE_REPOSITORY_TOKEN)
    private readonly packageRepository: PackageRepository,
    @Inject(ITEM_REPOSITORY_TOKEN)
    private readonly itemRepository: ItemRepository,
  ) {}

  async createPackage(createData: {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    itemIds?: number[];
  }): Promise<Package> {
    const newPackage = Package.create({
      name: createData.name,
      description: createData.description,
      price: createData.price,
      categoryId: createData.categoryId,
    });

    const savedPackage = await this.packageRepository.save(newPackage);

    if (createData.itemIds && createData.itemIds.length > 0) {
      for (const itemId of createData.itemIds) {
        await this.packageRepository.addItemToPackage(savedPackage.id, itemId);
      }
    }

    return this.getPackageById(savedPackage.id);
  }

  async updatePackage(
    id: number,
    updateData: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: number;
    },
  ): Promise<Package> {
    return this.packageRepository.update(id, updateData);
  }

  async deletePackage(id: number): Promise<void> {
    return this.packageRepository.delete(id);
  }
  async getByCategory(id : number) : Promise<Package[]>{
    const pkgs = await this.packageRepository.getByCategory(id);
    return pkgs;
  }
  async getPackageById(id: number): Promise<Package> {
    const packageEntity = await this.packageRepository.findById(id);
    if (!packageEntity) {
      throw new Error(`Package with id ${id} not found`);
    }
    return packageEntity;
  }

  async getAllPackages(): Promise<Package[]> {
    return this.packageRepository.findAll();
  }

  async getPackagesByCategory(categoryId: number): Promise<Package[]> {
    return this.packageRepository.findByCategory(categoryId);
  }

  async addItemToPackage(packageId: number, itemId: number): Promise<PackageItem> {
    // Verify item exists
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    // Verify package exists
    const packageEntity = await this.packageRepository.findById(packageId);
    if (!packageEntity) {
      throw new Error(`Package with id ${packageId} not found`);
    }

    return this.packageRepository.addItemToPackage(packageId, itemId);
  }

  async removeItemFromPackage(packageId: number, itemId: number): Promise<void> {
    return this.packageRepository.removeItemFromPackage(packageId, itemId);
  }

  async calculatePackagePrice(id: number): Promise<number> {
    const packageEntity = await this.getPackageById(id);
    return packageEntity.calculateTotalPrice();
  }
}

@Injectable()
export class ItemService implements ItemServiceInterface {
  constructor(
    @Inject(ITEM_REPOSITORY_TOKEN)
    private readonly itemRepository: ItemRepository,
  ) {}

  async createItem(createData: {
    name: string;
    description?: string;
    price: number;
    isPhysical : boolean;
  }): Promise<Item> {
    const newItem = Item.create({
      name: createData.name,
      description: createData.description,
      price: createData.price,
    });

    return this.itemRepository.save(newItem);
  }

  async updateItem(
    id: number,
    updateData: {
      name?: string;
      description?: string;
      price?: number;
    },
  ): Promise<Item> {
    return this.itemRepository.update(id, updateData);
  }

  async deleteItem(id: number): Promise<void> {
    return this.itemRepository.delete(id);
  }

  async getItemById(id: number): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  async getAllItems(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }
}