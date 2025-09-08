// src/auth/dto/auth-tokens-response.dto.ts
import { User } from 'src/users/entities/user.entity';

export class AuthTokensResponseDto {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  session_id?: string;
  user?: Partial<User>;

  constructor(data: Partial<AuthTokensResponseDto>) {
    Object.assign(this, data);
  }
}

// src/auth/dto/profile-response.dto.ts
export class ProfileResponseDto {
  id: string;
  email: string;
  username?: string;
  name?: string;
  image?: string;

  constructor(partial: Partial<ProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
