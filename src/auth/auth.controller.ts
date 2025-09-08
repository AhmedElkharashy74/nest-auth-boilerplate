// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { loginRequestDTO } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { LogoutSessionDto } from './dto/logout.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { ProfileResponseDto } from './dto/auth-tokens-response.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _: loginRequestDTO, @CurrentUser() user: User): Promise<AuthTokensResponseDto> {
    return this.authService.login(user);
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
