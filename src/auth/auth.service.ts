// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { BCRYPT_ROUNDS } from '../common/constants/constants.module';
import { SessionsService } from './sessions/session.service';
import { randomBytes, createHash } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import ms from 'ms';

@Injectable()
export class AuthService {
  private googleClient;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

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

  async validateOAuthUser(profile: any, provider: string) {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        username: profile.username || profile.email.split('@')[0],
        name: profile.name,
        image: profile.picture,
        // provider,
      });
    }

    return user;
  }

  async login(user: any): Promise<AuthTokensResponseDto> {
    const payload = { sub: user.id, email: user.email, username: user.username };

    const accessTokenTtl = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    const expiresIn = ms(accessTokenTtl) / 1000;

    const accessToken = this.jwtService.sign(payload, { expiresIn: accessTokenTtl });

    const refreshToken = await this.generateRefreshToken(user.id);

    return new AuthTokensResponseDto({
      access_token: accessToken,
      refresh_token: refreshToken.token,
      expires_in: expiresIn,
      session_id: refreshToken.id,
      user,
    });
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException('Invalid Google token');

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }

  async googleLogin(idToken: string): Promise<AuthTokensResponseDto> {
    // 1. Verify with Google
    const profile = await this.verifyGoogleToken(idToken);

    // 2. Find/create user
    const user = await this.validateOAuthUser(profile, 'google');

    // 3. Issue your JWT + refresh token
    return this.login(user);
  }

  private async generateRefreshToken(userId: string) {
    const token = randomBytes(40).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await this.sessionsService.create(userId, hashedToken, expiresAt);

    return { ...session, token };
  }

  async register(userData: { email: string; password: string; username?: string; name?: string }) {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);

    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthTokensResponseDto> {
    const hashedToken = createHash('sha256').update(refreshToken).digest('hex');

    const isValid = await this.sessionsService.isValid(hashedToken);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const session = await this.sessionsService.findByToken(hashedToken);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: session.user.id, email: session.user.email, username: session.user.username };

    const accessTokenTtl = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    const expiresIn = ms(accessTokenTtl) / 1000;

    const accessToken = this.jwtService.sign(payload, { expiresIn: accessTokenTtl });

    return new AuthTokensResponseDto({ access_token: accessToken, expires_in: expiresIn });
  }

  async logout(refreshToken: string) {
    const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
    await this.sessionsService.revoke(hashedToken);
    return { message: 'Logged out successfully' };
  }

  async logoutSession(sessionId: string) {
    await this.sessionsService.revokeById(sessionId);
    return { message: 'Session logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.sessionsService.revokeAllForUser(userId);
    return { message: 'Logged out from all devices' };
  }

  async getUserSessions(userId: string) {
    return this.sessionsService.findByUserId(userId);
  }
}
