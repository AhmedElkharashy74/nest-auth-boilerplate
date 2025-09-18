import { Package } from 'src/package/domain/entities/package.entity';
import { Item } from 'src/package/domain/entities/item.entity';
import { PackageItem } from 'src/package/domain/entities/packageItem.entity';
import { Package as PrismaPackage, Item as PrismaItem, PackageItem as PrismaPackageItem } from '@prisma/client';
import { Prisma } from '@prisma/client';
export class PackageMapper {
  static toDomain(prismaPackage: PrismaPackage & { packageItems?: (PrismaPackageItem & { item?: PrismaItem })[] }): Package {
    const packageItems = prismaPackage.packageItems
      ? prismaPackage.packageItems.map(pi => 
          PackageItemMapper.toDomain(pi)
        )
      : undefined;

    return new Package(
      prismaPackage.id,
      prismaPackage.name,
      prismaPackage.description,
      Number(prismaPackage.price),
      prismaPackage.categoryId,
      prismaPackage.createdAt,
      prismaPackage.updatedAt,
      packageItems,
    );
  }

  static toPersistence(packageEntity: Package): PrismaPackage {
    return {
      id: packageEntity.id,
      name: packageEntity.name,
      description: packageEntity.description,
      price: new Prisma.Decimal(packageEntity.price),
      categoryId: packageEntity.categoryId,
      createdAt: packageEntity.createdAt,
      updatedAt: packageEntity.updatedAt,
    };
  }
}

export class ItemMapper {
  static toDomain(prismaItem: PrismaItem): Item {
    return new Item(
      prismaItem.id,
      prismaItem.name,
      prismaItem.description,
      Number(prismaItem.price),
      prismaItem.createdAt,
      prismaItem.updatedAt,
    );
  }

  static toPersistence(itemEntity: Item): PrismaItem {
    return {
      id: itemEntity.id,
      name: itemEntity.name,
      description: itemEntity.description,
      price: new Prisma.Decimal(itemEntity.price),
      createdAt: itemEntity.createdAt,
      updatedAt: itemEntity.updatedAt,
    };
  }
}

export class PackageItemMapper {
  static toDomain(prismaPackageItem: PrismaPackageItem & { item?: PrismaItem; package?: PrismaPackage }): PackageItem {
    const item = prismaPackageItem.item ? ItemMapper.toDomain(prismaPackageItem.item) : undefined;
    const packageEntity = prismaPackageItem.package ? PackageMapper.toDomain(prismaPackageItem.package) : undefined;

    return new PackageItem(
      prismaPackageItem.id,
      prismaPackageItem.packageId,
      prismaPackageItem.itemId,
      packageEntity,
      item,
    );
  }

  static toPersistence(packageItemEntity: PackageItem): PrismaPackageItem {
    return {
      id: packageItemEntity.id,
      packageId: packageItemEntity.packageId,
      itemId: packageItemEntity.itemId,
    };
  }
}