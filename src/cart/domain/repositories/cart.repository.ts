import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';

export interface CartRepository {
  create(cart: Cart): Promise<Cart>;
  findById(id: number): Promise<Cart | null>;
  findByGuestToken(guestToken: string): Promise<Cart | null>;
  save(cart: Cart): Promise<Cart>;
  delete(id: number): Promise<void>;

  // item-specific helpers that can be more efficient in infra
  addItem(cartId: number, item: CartItem): Promise<CartItem>;
  updateItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
  removeItem(cartItemId: number): Promise<void>;
  clearItems(cartId: number): Promise<void>;
}
