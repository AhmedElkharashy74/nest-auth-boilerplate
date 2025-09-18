import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PackageController, ItemController } from './controllers/package.controller';
import { PackageService, ItemService } from './application/services/package.service';
import { PrismaPackageRepository, PrismaItemRepository } from './infrastructure/repositories/prisma/package.repository';
import {
  PACKAGE_REPOSITORY_TOKEN,
  ITEM_REPOSITORY_TOKEN,

} from './domain/repositories/package.repository.interface';

import {
    PACKAGE_SERVICE_TOKEN,
    ITEM_SERVICE_TOKEN,
} from './domain/services/package.service'

@Module({
  imports: [PrismaModule],
  controllers: [PackageController, ItemController],
  providers: [
    {
      provide: PACKAGE_REPOSITORY_TOKEN,
      useClass: PrismaPackageRepository,
    },
    {
      provide: ITEM_REPOSITORY_TOKEN,
      useClass: PrismaItemRepository,
    },
    {
      provide: PACKAGE_SERVICE_TOKEN,
      useClass: PackageService,
    },
    {
      provide: ITEM_SERVICE_TOKEN,
      useClass: ItemService,
    },
  ],
  exports: [
    PACKAGE_SERVICE_TOKEN,
    ITEM_SERVICE_TOKEN,
  ],
})
export class PackageModule {}