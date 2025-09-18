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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован и авторизован',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Пользователь с таким email уже существует или ошибка валидации',
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
  @ApiResponse({ status: 200, description: 'Успешный вход в систему' })
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
  @HttpCode(HttpStatus.OK)
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
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiResponse({ status: 400, description: 'Неверный формат данных' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему по токену из email' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно вошел в систему',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверный или истекший токен' })
  @Throttle({
    default: {
      limit: securityConfig.throttler.limit,
      ttl: securityConfig.throttler.ttl * 1000,
    },
  })
  async loginWithEmailToken(@Param('token') token: string) {
    return this.authService.loginWithEmailToken(token);
  }

  @Get('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Подтверждение email адреса' })
  @ApiResponse({
    status: 200,
    description: 'Email успешно подтвержден',
    schema: {
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            isEmailVerified: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный или истекший токен подтверждения',
  })
  @Throttle({
    default: {
      limit: securityConfig.throttler.limit,
      ttl: securityConfig.throttler.ttl * 1000,
    },
  })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Повторная отправка письма с подтверждением' })
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
    description: 'Письмо с подтверждением отправлено успешно',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Пользователь не найден или email уже подтвержден',
  })
  @Throttle({
    default: {
      limit: 3, // Ограничиваем повторную отправку
      ttl: 60000, // 1 минута
    },
  })
  async resendVerificationEmail(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }
}
