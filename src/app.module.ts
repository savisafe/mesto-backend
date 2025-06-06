import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { securityConfig } from './config/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: securityConfig.throttler.ttl,
        limit: securityConfig.throttler.limit,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    MailModule,
  ],
})
export class AppModule {}
