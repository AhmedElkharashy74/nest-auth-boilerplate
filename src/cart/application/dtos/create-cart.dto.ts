import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  guestToken?: string;
}
