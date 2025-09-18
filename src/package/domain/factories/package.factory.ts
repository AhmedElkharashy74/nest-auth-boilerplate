import { Package } from '../entities/package.entity';
import { Item } from '../entities/item.entity';
import { PackageItem } from '../entities/packageItem.entity';

export class PackageFactory {
  static createPackage(createProps: {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    items?: Item[];
  }): Package {
    const now = new Date();
    const packageItems = createProps.items
      ? createProps.items.map(item => 
          PackageItem.create({
            packageId: 0, // Will be set after package is saved
            itemId: item.id,
          })
        )
      : [];

    return new Package(
      0, // ID will be assigned by database
      createProps.name,
      createProps.description || null,
      createProps.price,
      createProps.categoryId,
      now,
      now,
      packageItems,
    );
  }

  static createItem(createProps: {
    name: string;
    description?: string;
    price: number;
  }): Item {
    return Item.create(createProps);
  }

  static createPackageItem(createProps: {
    packageId: number;
    itemId: number;
  }): PackageItem {
    return PackageItem.create(createProps);
  }
}