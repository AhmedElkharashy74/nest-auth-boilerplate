import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {
  id: number;
  userId?: string | null;
  guestToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: CartItemResponseDto[];
}
