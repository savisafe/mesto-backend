import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { securityConfig } from '../config/security.config';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email already exists',
  })
  @Throttle({
    default: {
      limit: securityConfig.throttler.limit,
      ttl: securityConfig.throttler.ttl * 1000,
    },
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiResponse({ status: 400, description: 'Неверный формат данных' })
  @Throttle({
    default: {
      limit: securityConfig.throttler.limit,
      ttl: securityConfig.throttler.ttl * 1000,
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login/email')
  @ApiOperation({ summary: 'Отправка ссылки для входа на email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ссылка для входа отправлена на email',
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @Throttle({
    default: {
      limit: securityConfig.throttler.limit,
      ttl: securityConfig.throttler.ttl * 1000,
    },
  })
  async sendLoginLink(@Body('email') email: string) {
    return this.authService.sendEmailLoginLink(email);
  }

  @Get('login/email/:token')
  @ApiOperation({ summary: 'Login with email token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @Throttle({
    default: {
      limit: securityConfig.throttler.limit,
      ttl: securityConfig.throttler.ttl * 1000,
    },
  })
  async loginWithEmailToken(@Param('token') token: string) {
    return this.authService.loginWithEmailToken(token);
  }
}
