// auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { JwtPayload } from '../common/interfaces/jwtPayload.interface';
import { BCRYPT_ROUNDS } from '../common/constants/constants.module';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles?.map(userRole => userRole.role.name) || [],
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: {
    email: string;
    password: string;
    username?: string;
    name?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);

    // Create user
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async validateOAuthUser(profile: any, provider: string) {
    let user = await this.usersService.findByEmail(profile.email);
    
    if (!user) {
      // Create new user for OAuth
      user = await this.usersService.create({
        email: profile.email,
        username: profile.username || profile.email.split('@')[0],
        name: profile.name,
        image: profile.picture,
      });
    }
    
    // Create or update account connection
    // This would typically be handled in a separate service for accounts
    
    return user;
  }
}