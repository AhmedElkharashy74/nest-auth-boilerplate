

import { Package } from './package.entity';

import { Item } from './item.entity';

export class PackageItem {
  constructor(
    public id: number,
    public packageId: number,
    public itemId: number,
    public pkge?: Package,
    public item?: Item,
  ) {}

  static create(createProps: {
    packageId: number;
    itemId: number;
  }): PackageItem {
    return new PackageItem(
      0, // ID will be assigned by database
      createProps.packageId,
      createProps.itemId,
    );
  }
}