import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';

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
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : '';

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        isEmailVerified: true, // Сразу считаем email подтвержденным
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    // Проверяем, подтвержден ли email
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Пожалуйста, подтвердите ваш email перед входом в систему',
      );
    }

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверные учетные данные');
      }
    } else {
      throw new UnauthorizedException(
        'Вход по паролю недоступен для этого аккаунта',
      );
    }

    // Сбрасываем счетчик попыток входа при успешном входе
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
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const token = Math.random().toString(36).substring(2, 15);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailLoginToken: token,
        emailLoginTokenExpires: expires,
      },
    });

    // Временно отключаем отправку email
    // await this.mailService.sendLoginLink(email, token);
    console.log(`Login token for ${email}: ${token}`);

    return { message: 'Ссылка для входа отправлена на ваш email' };
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
      throw new UnauthorizedException('Неверный или истекший токен');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    // Проверяем, подтвержден ли email
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Пожалуйста, подтвердите ваш email перед входом в систему',
      );
    }

    // Очищаем токен после использования
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailLoginToken: null,
        emailLoginTokenExpires: null,
        lastLoginAt: new Date(),
      },
    });

    return this.generateTokens(user);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Неверный или истекший токен подтверждения',
      );
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email уже подтвержден');
    }

    // Подтверждаем email
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });

    return {
      message: 'Email успешно подтвержден',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: true,
      },
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email уже подтвержден');
    }

    // Генерируем новый токен
    const verificationToken = Math.random().toString(36).substring(2, 15);
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: verificationExpires,
      },
    });

    await this.mailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Письмо с подтверждением отправлено успешно' };
  }

  private generateTokens(user: User) {
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
