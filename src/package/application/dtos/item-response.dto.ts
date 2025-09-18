import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  price: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}