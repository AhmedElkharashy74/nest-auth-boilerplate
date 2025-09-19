import { Cart } from '../entities/cart.entity';

export interface CartServiceInterface {
  createCart(payload: { userId?: string | null; guestToken?: string | null }): Promise<Cart>;
  getCart(cartId: number): Promise<Cart | null>;
  getOrCreateByGuestToken(guestToken: string): Promise<Cart>;
  addItem(cartId: number, payload: { itemId?: number; packageId?: number; quantity?: number }): Promise<Cart>;
  updateItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<Cart>;
  removeItem(cartId: number, cartItemId: number): Promise<Cart>;
  clearCart(cartId: number): Promise<void>;
  mergeGuestCartIntoUserCart(guestToken: string, userCartId: number): Promise<Cart>;
}
