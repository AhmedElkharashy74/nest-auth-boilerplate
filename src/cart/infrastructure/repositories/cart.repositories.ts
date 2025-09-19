import { Injectable, Inject } from '@nestjs/common';
import { CartRepository } from 'src/cart/domain/repositories/cart.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaCartMapper } from '../mappers/cart.mapper';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { CartItem } from 'src/cart/domain/entities/cart-item.entity';


@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(cart: Cart): Promise<Cart> {
    const data: any = {
      userId: cart.userId ?? null,
      guestToken: cart.guestToken ?? null,
    };

    const created = await this.prisma.cart.create({
      data,
      include: { items: true },
    });
    return PrismaCartMapper.toDomain(created);
  }

  async findById(id: number): Promise<Cart | null> {
    const found = await this.prisma.cart.findUnique({
      where: { id },
      include: { items: true },
    });
    return found ? PrismaCartMapper.toDomain(found) : null;
  }

  async findByGuestToken(guestToken: string): Promise<Cart | null> {
    const found = await this.prisma.cart.findUnique({
      where: { guestToken },
      include: { items: true },
    });
    return found ? PrismaCartMapper.toDomain(found) : null;
  }

  async save(cart: Cart): Promise<Cart> {
    // Save cart meta then reconcile items (simple approach: upsert items one by one)
    const prismaData: any = {
      userId: cart.userId ?? null,
      guestToken: cart.guestToken ?? null,
    };

    const updated = await this.prisma.cart.update({
      where: { id: cart.id! },
      data: prismaData,
      include: { items: true },
    });

    // reconcile items (naive): delete all items then create from domain
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id! } });
    for (const item of cart.items) {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id!,
          itemId: item.itemId ?? null,
          packageId: item.packageId ?? null,
          quantity: item.quantity,
        },
      });
    }

    const reloaded = await this.prisma.cart.findUnique({
      where: { id: cart.id! },
      include: { items: true },
    });

    return PrismaCartMapper.toDomain(reloaded);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId: id } });
    await this.prisma.cart.delete({ where: { id } });
  }

  async addItem(cartId: number, item: CartItem): Promise<CartItem> {
    const created = await this.prisma.cartItem.create({
      data: {
        cartId,
        itemId: item.itemId ?? null,
        packageId: item.packageId ?? null,
        quantity: item.quantity,
      },
    });
    return PrismaCartMapper.cartItemToDomain(created);
  }

  async updateItemQuantity(cartItemId: number, quantity: number): Promise<CartItem> {
    const updated = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
    return PrismaCartMapper.cartItemToDomain(updated);
  }

  async removeItem(cartItemId: number): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearItems(cartId: number): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
