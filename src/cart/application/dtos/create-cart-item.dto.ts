import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  itemId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  packageId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number = 1;
}
