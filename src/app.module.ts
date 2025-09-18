import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { PackageModule } from './package/package.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, CategoryModule, PackageModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
