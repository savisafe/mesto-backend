import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : '';

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        isEmailVerified: true, // Автоматически считаем email подтвержденным
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    // Если у пользователя нет пароля, отправляем ссылку для входа
    if (!user.password) {
      return this.sendEmailLoginLink(user.email);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: user.loginAttempts + 1,
          isBlocked: user.loginAttempts >= 4,
        },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    return this.generateTokens(user);
  }

  async sendEmailLoginLink(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return { message: 'If your email is registered, you will receive a login link' };
    }

    const loginToken = uuidv4();
    const loginTokenExpires = new Date();
    loginTokenExpires.setMinutes(loginTokenExpires.getMinutes() + 15); // Токен действителен 15 минут

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailLoginToken: loginToken,
        emailLoginTokenExpires: loginTokenExpires,
      },
    });

    // Отправляем письмо со ссылкой для входа
    await this.mailService.sendLoginLink(email, loginToken);

    return { message: 'If your email is registered, you will receive a login link' };
  }

  async loginWithEmailToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailLoginToken: token,
        emailLoginTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired login token');
    }

    // Очищаем токен после использования
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailLoginToken: null,
        emailLoginTokenExpires: null,
        lastLoginAt: new Date(),
        loginAttempts: 0,
      },
    });

    return this.generateTokens(user);
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
