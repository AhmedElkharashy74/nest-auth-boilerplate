import { Injectable } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartFactory {
  create(props: { userId?: string | null; guestToken?: string | null }) {
    return Cart.create({
      userId: props.userId ?? null,
      guestToken: props.guestToken ?? null,
      items: [],
    });
  }

  createItem(props: {
    id?: number | null;
    cartId?: number | null;
    itemId?: number | null;
    packageId?: number | null;
    quantity?: number;
  }) {
    return CartItem.create({
      id: props.id ?? null,
      cartId: props.cartId ?? null,
      itemId: props.itemId ?? null,
      packageId: props.packageId ?? null,
      quantity: props.quantity ?? 1,
    });
  }
}
