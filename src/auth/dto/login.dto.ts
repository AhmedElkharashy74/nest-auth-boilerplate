import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";



export class loginRequestDTO {
    @IsEmail()
    email : string

    @IsNotEmpty()
    password : string
}

export class LoginResponseDto {
    access_token: string;
    refresh_token: string;
    session_id: string;
    expires_in: number;
    user: {
      id: string;
      email: string;
      username?: string;
      name?: string;
      image?: string;
    };
  
    constructor(access_token: string, refresh_token: string, session_id: string, expires_in: number, user: any) {
      this.access_token = access_token;
      this.refresh_token = refresh_token;
      this.session_id = session_id;
      this.expires_in = expires_in;
      this.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        image: user.image,
      };
    }
  }