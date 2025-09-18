import { Exclude, Expose, Type } from 'class-transformer';
import { ItemResponseDto } from './item-response.dto';

@Exclude()
export class PackageResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  price: number;

  @Expose()
  categoryId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ItemResponseDto)
  items?: ItemResponseDto[];

  @Expose()
  totalPrice?: number;
}