// FILE: src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, UsePipes, ValidationPipe, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { loginRequestDTO } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { LogoutSessionDto } from './dto/logout.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { ProfileResponseDto } from './dto/auth-tokens-response.dto';
import express from 'express';

@Controller('api/auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _: loginRequestDTO, @CurrentUser() user: User): Promise<AuthTokensResponseDto> {
    return this.authService.login(user);
  }

  // Server-side Google OAuth: redirect user to Google
  @Get('google')
  async googleRedirect(@Res() res: express.Response) {
    const url = this.authService.generateGoogleAuthUrl();
    return res.redirect(url);
  }

  // Google will call this callback with a `code` query param
  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: express.Response) {
    if (!code) {
      return res.status(400).json({ message: 'Missing code from Google OAuth callback' });
    }

    const tokens = await this.authService.handleGoogleCallback(code);
    if(!tokens.session_id) throw new Error('session id must be available')
    // You can choose to redirect to the frontend with the session id or set cookies here.
    // For simple behaviour we redirect to a configured frontend URL with session_id (or send as JSON)
    // Redirect example (frontend should handle receiving session id or token in query):
    const redirectTo = process.env.FRONTEND_CALLBACK_URL || 'http://localhost:3000/api/auth/profile'
    const url = new URL(redirectTo);
    // avoid putting access_token in query string in production; prefer HttpOnly cookie
    url.searchParams.set('session_id', tokens.session_id);

    return res.redirect(url.toString());
  }

  @Post('register')
  async register(@Body() userData: { email: string; password: string; username?: string; name?: string }): Promise<AuthTokensResponseDto> {
    const user = await this.authService.register(userData);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser): ProfileResponseDto {
    return new ProfileResponseDto(req.user);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthTokensResponseDto> {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-session')
  async logoutSession(@Body() logoutSessionDto: LogoutSessionDto) {
    return this.authService.logoutSession(logoutSessionDto.session_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@CurrentUser() user: User) {
    return this.authService.logoutAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getSessions(@CurrentUser() user: User) {
    return this.authService.getUserSessions(user.id);
  }
}
