
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { CartItem } from 'src/cart/domain/entities/cart-item.entity';
export class PrismaCartMapper {
  static toDomain(prismaCart: any): Cart {
    const items = (prismaCart.items ?? []).map((pi: any) =>
      CartItem.create({
        id: pi.id,
        cartId: pi.cartId,
        itemId: pi.itemId ?? null,
        packageId: pi.packageId ?? null,
        quantity: pi.quantity,
      }),
    );
    return Cart.create({
      id: prismaCart.id,
      userId: prismaCart.userId ?? null,
      guestToken: prismaCart.guestToken ?? null,
      createdAt: prismaCart.createdAt,
      updatedAt: prismaCart.updatedAt,
      items,
    });
  }

  static toPrisma(cart: Cart) {
    return {
      id: cart.id ?? undefined,
      userId: cart.userId ?? undefined,
      guestToken: cart.guestToken ?? undefined,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      // items handled separately in repository operations
    };
  }

  static cartItemToDomain(pi: any): CartItem {
    return CartItem.create({
      id: pi.id,
      cartId: pi.cartId,
      itemId: pi.itemId ?? null,
      packageId: pi.packageId ?? null,
      quantity: pi.quantity,
    });
  }
}
