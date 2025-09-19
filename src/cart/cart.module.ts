import { Module } from '@nestjs/common';
import { CartFactory } from './domain/factories/cart.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaCartRepository } from './infrastructure/repositories/cart.repositories';
import { CartController } from './controllers/cart.controller';
import { CART_REPOSITORY, CART_SERVICE, CartService } from './application/services/cart.service';

@Module({
  controllers: [CartController],
  providers: [
    CartFactory,
    {
      provide: CART_REPOSITORY,
      useClass: PrismaCartRepository,
    },
    {
      provide: CART_SERVICE,
      useClass: CartService,
    },
    // PrismaService is expected to be exported by a global Prisma module; if not, add it here
    PrismaService,
  ],
  exports: [
    {
      provide: CART_SERVICE,
      useClass: CartService,
    },
    {
      provide: CART_REPOSITORY,
      useClass: PrismaCartRepository,
    },
  ],
})
export class CartModule {}
