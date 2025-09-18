import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './application/services/category.service';
import { CategoryFactory } from './domain/factories/category.factory';
import { PrismaCategoryRepository } from './infrastructure/repositories/category.repository';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryFactory,
    PrismaService,
    {
      provide: 'CATEGORY_REPOSITORY',
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}