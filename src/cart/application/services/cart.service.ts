import { Injectable, Inject } from '@nestjs/common';
import { CartServiceInterface } from '../../domain/services/cart.service.interface';
import type { CartRepository } from '../../domain/repositories/cart.repository';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { CartItem } from 'src/cart/domain/entities/cart-item.entity';
import { CartFactory } from 'src/cart/domain/factories/cart.factory';


export const CART_REPOSITORY = 'CART_REPOSITORY';
export const CART_SERVICE = 'CART_SERVICE';

@Injectable()
export class CartService implements CartServiceInterface {
  constructor(
    @Inject(CART_REPOSITORY) private readonly repository: CartRepository,
    private readonly factory: CartFactory,
  ) {}

  async createCart(payload: { userId?: string | null; guestToken?: string | null }): Promise<Cart> {
    const cart = this.factory.create({
      userId: payload.userId ?? null,
      guestToken: payload.guestToken ?? null,
    });
    return this.repository.create(cart);
  }

  async getCart(cartId: number): Promise<Cart | null> {
    return this.repository.findById(cartId);
  }

  async getOrCreateByGuestToken(guestToken: string): Promise<Cart> {
    const existing = await this.repository.findByGuestToken(guestToken);
    if (existing) return existing;
    const cart = this.factory.create({ guestToken });
    return this.repository.create(cart);
  }

  async addItem(cartId: number, payload: { itemId?: number; packageId?: number; quantity?: number }): Promise<Cart> {
    // business validation: either itemId or packageId must be provided
    if ((payload.itemId === undefined || payload.itemId === null) &&
        (payload.packageId === undefined || payload.packageId === null)) {
      throw new Error('Either itemId or packageId must be provided');
    }
    // create domain CartItem
    const item = this.factory.createItem({
      cartId,
      itemId: payload.itemId ?? null,
      packageId: payload.packageId ?? null,
      quantity: payload.quantity ?? 1,
    });

    await this.repository.addItem(cartId, item);
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new Error('Cart not found after adding item');
    return cart;
  }

  async updateItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<Cart> {
    if (quantity <= 0) throw new Error('Quantity must be > 0');
    await this.repository.updateItemQuantity(cartItemId, quantity);
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  async removeItem(cartId: number, cartItemId: number): Promise<Cart> {
    await this.repository.removeItem(cartItemId);
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  async clearCart(cartId: number): Promise<void> {
    await this.repository.clearItems(cartId);
  }

  async mergeGuestCartIntoUserCart(guestToken: string, userCartId: number): Promise<Cart> {
    const guest = await this.repository.findByGuestToken(guestToken);
    if (!guest) return (await this.repository.findById(userCartId))!;
    const userCart = await this.repository.findById(userCartId);
    if (!userCart) throw new Error('User cart not found');

    userCart.mergeFrom(guest);
    const saved = await this.repository.save(userCart);
    await this.repository.delete(guest.id!); // delete guest cart after merge
    return saved;
  }
}
