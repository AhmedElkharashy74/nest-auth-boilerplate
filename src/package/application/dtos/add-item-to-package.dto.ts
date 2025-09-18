import { IsNumber } from 'class-validator';

export class AddItemToPackageDto {
  @IsNumber()
  itemId: number;
}