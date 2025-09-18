import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}