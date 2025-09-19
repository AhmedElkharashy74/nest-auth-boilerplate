export class CartItemResponseDto {
    id: number;
    cartId: number;
    itemId?: number | null;
    packageId?: number | null;
    quantity: number;
  }
  