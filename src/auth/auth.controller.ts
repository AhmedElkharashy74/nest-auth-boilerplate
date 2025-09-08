// auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() userData: { email: string; password: string; username?: string; name?: string },
  ) {
    const user = await this.authService.register(userData);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    const { password, ...user } = req.user;
    return user;
  }

  @Get('google')
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res) {
    // Handles Google OAuth callback
    const user = req.user;
    const jwt = await this.authService.login(user);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwt.access_token}`);
  }

  @Get('github')
  async githubAuth() {
    // Initiates GitHub OAuth flow
  }

  @Get('github/callback')
  async githubAuthRedirect(@Req() req, @Res() res) {
    // Handles GitHub OAuth callback
    const user = req.user;
    const jwt = await this.authService.login(user);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwt.access_token}`);
  }
}