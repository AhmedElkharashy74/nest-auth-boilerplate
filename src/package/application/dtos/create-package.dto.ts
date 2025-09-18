import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  categoryId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  itemIds?: number[];
}