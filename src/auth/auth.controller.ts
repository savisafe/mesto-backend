import { Controller, Post, Body, UseGuards, Get, Query, Param, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 запроса в минуту
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 запросов в минуту
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('login/email')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 запроса в минуту
  async sendEmailLoginLink(@Body('email') email: string) {
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }
    return this.authService.sendEmailLoginLink(email);
  }

  @Get('login/email/:token')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 запросов в минуту
  async loginWithEmailToken(@Param('token') token: string) {
    return this.authService.loginWithEmailToken(token);
  }
}
