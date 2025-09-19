import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  HttpCode,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type { CartServiceInterface } from '../domain/services/cart.service.interface';
import { CreateCartDto } from '../application/dtos/create-cart.dto';
import { CreateCartItemDto } from '../application/dtos/create-cart-item.dto';
import { UpdateCartItemDto } from '../application/dtos/update-cart-item.dto';
import { CART_SERVICE } from '../application/services/cart.service';
import { CartResponseDto } from '../application/dtos/cart-response.dto';
import { CartItemResponseDto } from '../application/dtos/cart-item-response.dto';

@Controller('carts')
export class CartController {
  constructor(
    @Inject(CART_SERVICE)
    private readonly service: CartServiceInterface,
  ) {}

  @Post()
  async create(@Body() dto: CreateCartDto): Promise<CartResponseDto> {
    if (!dto.userId && !dto.guestToken) {
      throw new BadRequestException('Either userId or guestToken is required');
    }
    const cart = await this.service.createCart({
      userId: dto.userId,
      guestToken: dto.guestToken,
    });
    return this.mapCartToDto(cart);
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<CartResponseDto> {
    const cart = await this.service.getCart(id);
    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }
    return this.mapCartToDto(cart);
  }

  @Post(':id/items')
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCartItemDto,
  ): Promise<CartResponseDto> {
    if (!dto.itemId && !dto.packageId) {
      throw new BadRequestException('Either itemId or packageId is required');
    }

    const cart = await this.service.addItem(id, {
      itemId: dto.itemId,
      packageId: dto.packageId,
      quantity: dto.quantity,
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }

    return this.mapCartToDto(cart);
  }

  @Put(':id/items/:itemId')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.service.updateItemQuantity(id, itemId, dto.quantity);
    if (!cart) {
      throw new NotFoundException(`Cart or item not found (cartId=${id}, itemId=${itemId})`);
    }

    return this.mapCartToDto(cart);
  }

  @Delete(':id/items/:itemId')
  @HttpCode(204)
  async removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<void> {
    const result = await this.service.removeItem(id, itemId);
    if (!result) {
      throw new NotFoundException(`Item with id ${itemId} not found in cart ${id}`);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async clearCart(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.service.clearCart(id);
    
  }

  @Post('guest/merge')
  async mergeGuestIntoUser(
    @Body() body: { guestToken: string; userCartId: number },
  ): Promise<CartResponseDto> {
    if (!body.guestToken || !body.userCartId) {
      throw new BadRequestException('guestToken and userCartId are required');
    }

    const cart = await this.service.mergeGuestCartIntoUserCart(
      body.guestToken,
      body.userCartId,
    );

    if (!cart) {
      throw new ConflictException('Unable to merge guest cart into user cart');
    }

    return this.mapCartToDto(cart);
  }

  private mapCartToDto(cart: any): CartResponseDto {
    return {
      id: cart.id!,
      userId: cart.userId ?? null,
      guestToken: cart.guestToken ?? null,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: (cart.items ?? []).map((i: any) => this.mapCartItem(i)),
    };
  }

  private mapCartItem(i: any): CartItemResponseDto {
    return {
      id: i.id,
      cartId: i.cartId,
      itemId: i.itemId ?? null,
      packageId: i.packageId ?? null,
      quantity: i.quantity,
    };
  }
}
