import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutSessionDto {
  @IsNotEmpty()
  @IsString()
  session_id: string;
}