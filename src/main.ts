import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { securityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Применяем настройки безопасности
  app.use(helmet.default(securityConfig.helmet));
  app.enableCors(securityConfig.cors);

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет неопределенные в DTO поля
      transform: true, // Автоматически преобразует типы
      forbidNonWhitelisted: true, // Запрещает поля, не определенные в DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Mesto API')
    .setDescription('API для системы управления бизнесом')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

void bootstrap();
