import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PackageRepository, ItemRepository } from 'src/package/domain/repositories/package.repository.interface';
import { Package } from 'src/package/domain/entities/package.entity';
import { Item } from 'src/package/domain/entities/item.entity';
import { PackageItem } from 'src/package/domain/entities/packageItem.entity';
import { PackageMapper, ItemMapper, PackageItemMapper } from '../../mappers/package.mapper';

@Injectable()
export class PrismaPackageRepository implements PackageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Package | null> {
    const prismaPackage = await this.prisma.package.findUnique({
      where: { id },
      include: {
        packageItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return prismaPackage ? PackageMapper.toDomain(prismaPackage) : null;
  }

  async findAll(): Promise<Package[]> {
    const prismaPackages = await this.prisma.package.findMany({
      include: {
        packageItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return prismaPackages.map(PackageMapper.toDomain);
  }

  async findByCategory(categoryId: number): Promise<Package[]> {
    const prismaPackages = await this.prisma.package.findMany({
      where: { categoryId },
      include: {
        packageItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return prismaPackages.map(PackageMapper.toDomain);
  }

  async save(packageEntity: Package): Promise<Package> {
    const prismaPackage = await this.prisma.package.create({
      data: {
        name: packageEntity.name,
        description: packageEntity.description,
        price: packageEntity.price,
        categoryId: packageEntity.categoryId,
        createdAt: packageEntity.createdAt,
        updatedAt: packageEntity.updatedAt,
      },
      include: {
        packageItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return PackageMapper.toDomain(prismaPackage);
  }

  async update(id: number, packageEntity: Partial<Package>): Promise<Package> {
    const prismaPackage = await this.prisma.package.update({
      where: { id },
      data: {
        name: packageEntity.name,
        description: packageEntity.description,
        price: packageEntity.price,
        categoryId: packageEntity.categoryId,
        updatedAt: new Date(),
      },
      include: {
        packageItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return PackageMapper.toDomain(prismaPackage);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.package.delete({
      where: { id },
    });
  }

  async addItemToPackage(packageId: number, itemId: number): Promise<PackageItem> {
    const prismaPackageItem = await this.prisma.packageItem.create({
      data: {
        packageId,
        itemId,
      },
      include: {
        item: true,
        package: true,
      },
    });

    return PackageItemMapper.toDomain(prismaPackageItem);
  }

  async removeItemFromPackage(packageId: number, itemId: number): Promise<void> {
    await this.prisma.packageItem.delete({
      where: {
        packageId_itemId: {
          packageId,
          itemId,
        },
      },
    });
  }

  async findPackageItems(packageId: number): Promise<PackageItem[]> {
    const prismaPackageItems = await this.prisma.packageItem.findMany({
      where: { packageId },
      include: {
        item: true,
        package: true,
      },
    });

    return prismaPackageItems.map(PackageItemMapper.toDomain);
  }

  async getByCategory(id: number): Promise<Package[]> {
    const cat = await this.prisma.category.findUnique({
        where : {
            id : id
        }
    })

    if(!cat) throw new Error(`There is no category with id ${id}`)
      const pkgs = await this.prisma.package.findMany({
        where : {
            categoryId : id
        }
      })
      return pkgs.map(PackageMapper.toDomain);
  }
}

@Injectable()
export class PrismaItemRepository implements ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Item | null> {
    const prismaItem = await this.prisma.item.findUnique({
      where: { id },
    });

    return prismaItem ? ItemMapper.toDomain(prismaItem) : null;
  }

  async findAll(): Promise<Item[]> {
    const prismaItems = await this.prisma.item.findMany();
    return prismaItems.map(ItemMapper.toDomain);
  }

  async save(itemEntity: Item): Promise<Item> {
    const prismaItem = await this.prisma.item.create({
      data: {
        name: itemEntity.name,
        description: itemEntity.description,
        price: itemEntity.price,
        createdAt: itemEntity.createdAt,
        updatedAt: itemEntity.updatedAt,
      },
    });

    return ItemMapper.toDomain(prismaItem);
  }

  async update(id: number, itemEntity: Partial<Item>): Promise<Item> {
    const prismaItem = await this.prisma.item.update({
      where: { id },
      data: {
        name: itemEntity.name,
        description: itemEntity.description,
        price: itemEntity.price,
        updatedAt: new Date(),
      },
    });

    return ItemMapper.toDomain(prismaItem);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    });
  }
}