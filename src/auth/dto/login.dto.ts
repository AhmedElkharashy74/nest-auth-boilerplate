import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";



export class loginDto {
    @IsEmail()
    email : string

    @IsNotEmpty()
    password : string
}