# Mesto Backend API

## Описание
Backend API для сервиса Mesto, разработанный с использованием NestJS, Prisma и PostgreSQL. Система управления бизнесами с поддержкой JWT авторизации и CRUD операций для бизнесов.

## Технологии
- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure token-based auth
- **TypeScript** - Type-safe JavaScript
- **Nodemailer** - Email sending
- **Handlebars** - Email templates
- **bcrypt** - Password hashing
- **Swagger** - API documentation

## Установка и запуск

### 1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd mesto-backend
```

### 2. Установите зависимости:
```bash
npm install
```

### 3. Настройте базу данных:
```bash
# Запустите PostgreSQL (если не запущен)
brew services start postgresql@14

# Создайте базу данных
createdb mesto
```

### 4. Создайте файл `.env` в корневой директории:
```env
# Database Configuration
DATABASE_URL="postgresql://saveliytkachenko@localhost:5432/mesto?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Mail Configuration
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
MAIL_FROM="noreply@mesto.com"

# Frontend Configuration
FRONTEND_URL="http://localhost:3000"

# Application Configuration
NODE_ENV="development"
PORT=3000
```

### 5. Примените миграции базы данных:
```bash
npx prisma migrate deploy
```

### 6. Запустите приложение:
```bash
npm run start:dev
```

## API Endpoints

### 🏠 Главная страница

#### Получение приветственного сообщения
```http
GET /
```

**Ответ:**
```json
"Hello World!"
```

### 🔐 Авторизация

#### Регистрация нового пользователя
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Ответ (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "OWNER"
  }
}
```

**Ошибки:**
- `400` - Пользователь с таким email уже существует или ошибка валидации

#### Вход в систему
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "OWNER"
  }
}
```

**Ошибки:**
- `401` - Неверные учетные данные
- `400` - Неверный формат данных

#### Отправка ссылки для входа на email
```http
POST /auth/login/email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Ответ (200):**
```json
{
  "message": "Login link sent to your email"
}
```

**Ошибки:**
- `401` - Неверные учетные данные
- `400` - Неверный формат данных

#### Вход по ссылке из email
```http
GET /auth/login/email/{token}
```

**Ответ (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "OWNER"
  }
}
```

**Ошибки:**
- `401` - Неверный или истекший токен

#### Подтверждение email адреса
```http
GET /auth/verify-email/{token}
```

**Ответ (200):**
```json
{
  "message": "Email successfully verified",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isEmailVerified": true
  }
}
```

**Ошибки:**
- `400` - Неверный или истекший токен подтверждения

#### Повторная отправка письма с подтверждением
```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Ответ (200):**
```json
{
  "message": "Verification email sent successfully"
}
```

**Ошибки:**
- `400` - Пользователь не найден или email уже подтвержден

### 👤 Пользователи

> **Примечание:** Модуль пользователей пока не реализован полностью. Endpoints будут добавлены в будущих версиях.

### 🏢 Бизнесы

#### Создание нового бизнеса
```http
POST /businesses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "My Business",
  "description": "Business description",
  "isActive": true
}
```

**Ответ (201):**
```json
{
  "id": "uuid",
  "name": "My Business",
  "description": "Business description",
  "isActive": true,
  "createdAt": "2025-01-13T12:00:00.000Z",
  "updatedAt": "2025-01-13T12:00:00.000Z",
  "ownerId": "uuid",
  "owner": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "managers": [],
  "employees": []
}
```

**Ошибки:**
- `400` - Ошибка валидации
- `401` - Неавторизованный доступ

#### Получение всех бизнесов текущего пользователя
```http
GET /businesses
Authorization: Bearer <jwt_token>
```

**Ответ (200):**
```json
[
  {
    "id": "uuid",
    "name": "My Business",
    "description": "Business description",
    "isActive": true,
    "createdAt": "2025-01-13T12:00:00.000Z",
    "updatedAt": "2025-01-13T12:00:00.000Z",
    "ownerId": "uuid",
    "owner": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "managers": [],
    "employees": []
  }
]
```

**Ошибки:**
- `401` - Неавторизованный доступ

#### Получение бизнеса по ID
```http
GET /businesses/{id}
Authorization: Bearer <jwt_token>
```

**Ответ (200):**
```json
{
  "id": "uuid",
  "name": "My Business",
  "description": "Business description",
  "isActive": true,
  "createdAt": "2025-01-13T12:00:00.000Z",
  "updatedAt": "2025-01-13T12:00:00.000Z",
  "ownerId": "uuid",
  "owner": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "managers": [],
  "employees": []
}
```

**Ошибки:**
- `404` - Бизнес не найден
- `401` - Неавторизованный доступ

#### Обновление бизнеса
```http
PATCH /businesses/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Business Name",
  "description": "Updated description",
  "isActive": false
}
```

**Ответ (200):**
```json
{
  "id": "uuid",
  "name": "Updated Business Name",
  "description": "Updated description",
  "isActive": false,
  "createdAt": "2025-01-13T12:00:00.000Z",
  "updatedAt": "2025-01-13T12:00:00.000Z",
  "ownerId": "uuid",
  "owner": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "managers": [],
  "employees": []
}
```

**Ошибки:**
- `404` - Бизнес не найден
- `400` - Ошибка валидации
- `401` - Неавторизованный доступ

#### Удаление бизнеса
```http
DELETE /businesses/{id}
Authorization: Bearer <jwt_token>
```

**Ответ (200):**
```json
{
  "message": "Business deleted successfully"
}
```

**Ошибки:**
- `404` - Бизнес не найден
- `401` - Неавторизованный доступ

### 📊 Статус коды ответов

- `200` - Успешный запрос
- `201` - Ресурс успешно создан
- `400` - Ошибка валидации или неверные данные
- `401` - Неавторизованный доступ
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

### 🔒 Авторизация

Все защищенные endpoints требуют JWT токен в заголовке:
```http
Authorization: Bearer <jwt_token>
```

Токен получается при регистрации или входе в систему и действителен в течение 7 дней.

### 🚦 Rate Limiting

- **Общие запросы**: 10 запросов в минуту
- **Повторная отправка верификации**: 3 запроса в минуту
- **Защита от брутфорса**: 50 запросов за 15 минут

## 📋 Примеры использования

### Быстрый старт

1. **Регистрация пользователя:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456", "name": "John Doe"}'
```

2. **Вход в систему:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'
```

3. **Создание бизнеса:**
```bash
curl -X POST http://localhost:3000/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "My Business", "description": "Business description"}'
```

4. **Получение списка бизнесов:**
```bash
curl -X GET http://localhost:3000/businesses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Полный цикл работы

```bash
# 1. Регистрация
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456", "name": "Test User"}')

# 2. Извлечение токена
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token')

# 3. Создание бизнеса
curl -X POST http://localhost:3000/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Test Business", "description": "Test Description"}'

# 4. Получение бизнесов
curl -X GET http://localhost:3000/businesses \
  -H "Authorization: Bearer $TOKEN"
```

## 🗄️ Модель данных

### User (Пользователь)
- `id` - UUID
- `email` - Email (уникальный)
- `password` - Хешированный пароль (может быть null)
- `name` - Имя пользователя
- `about` - Описание пользователя
- `avatar` - URL аватара
- `role` - Роль (ADMIN, OWNER, MANAGER, EMPLOYEE, CLIENT)
- `isEmailVerified` - Подтвержден ли email (временно всегда true)
- `emailVerificationToken` - Токен подтверждения email (не используется)
- `emailVerificationTokenExpires` - Срок действия токена (не используется)
- `lastLoginAt` - Последний вход
- `loginAttempts` - Количество попыток входа
- `isBlocked` - Заблокирован ли аккаунт

### Business (Бизнес)
- `id` - UUID
- `name` - Название бизнеса
- `description` - Описание
- `isActive` - Активен ли бизнес
- `ownerId` - ID владельца
- `managers` - Менеджеры
- `employees` - Сотрудники

### Order (Заказ)
- `id` - UUID
- `total` - Общая сумма
- `status` - Статус (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
- `notes` - Заметки
- `userId` - ID пользователя
- `items` - Элементы заказа

### Product/Service (Продукт/Услуга)
- `id` - UUID
- `name` - Название
- `basePrice` - Базовая цена
- `isActive` - Активен ли
- `businessId` - ID бизнеса
- `duration` - Длительность (только для услуг)

## 🔒 Безопасность

### Аутентификация
- **JWT токены** для безопасной аутентификации
- **Password hashing** с bcrypt
- **Rate limiting** защита от брутфорса
- **Token expiration** JWT токены действительны 7 дней

### Защита от атак
- **Throttling** - 10 запросов в минуту
- **Rate limiting** - 50 запросов за 15 минут
- **CORS** настроен для безопасной работы с фронтендом
- **Helmet** для HTTP заголовков безопасности
- **Input validation** все входящие данные валидируются

### Email Security (временно отключено)
- **SMTP authentication** для отправки писем (настраивается при необходимости)
- **HTML templates** с безопасным рендерингом
- **Token-based verification** вместо прямых ссылок

## 🚀 Разработка

### Текущий статус проекта

✅ **Реализовано:**
- JWT авторизация (регистрация, вход)
- CRUD операции для бизнесов
- Валидация данных с class-validator
- Swagger документация
- Rate limiting и безопасность
- PostgreSQL интеграция с Prisma
- Правильные HTTP статус коды

🔄 **Временно отключено:**
- Email verification (можно включить при настройке SMTP)
- Отправка писем с подтверждением

📋 **Планируется:**
- Модуль пользователей (профиль, обновление)
- Модуль заказов
- Модуль продуктов/услуг
- Система ролей и разрешений
- Загрузка файлов
- Уведомления

### Команды разработки
```bash
# Запуск в режиме разработки
npm run start:dev

# Сборка проекта
npm run build

# Запуск в production
npm run start:prod

# Линтинг
npm run lint

# Форматирование кода
npm run format
```

### Prisma команды
```bash
# Генерация Prisma клиента
npx prisma generate

# Создание новой миграции
npx prisma migrate dev --name <имя-миграции>

# Применение миграций
npx prisma migrate deploy

# Просмотр базы данных
npx prisma studio

# Сброс базы данных
npx prisma migrate reset
```

### Тестирование
```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Тестовое покрытие
npm run test:cov

# Тесты в watch режиме
npm run test:watch
```

## 📁 Структура проекта

```
src/
├── auth/                 # Модуль авторизации
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # JWT Guard
│   ├── strategies/      # JWT Strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── businesses/          # Модуль бизнесов
├── users/              # Модуль пользователей
├── mail/               # Модуль отправки email
│   ├── templates/      # HTML шаблоны
│   ├── mail.service.ts
│   └── mail.module.ts
├── prisma/             # Prisma конфигурация
├── config/             # Конфигурация безопасности
├── app.module.ts       # Главный модуль
└── main.ts            # Точка входа
```

## 📊 Swagger Documentation

После запуска приложения документация API доступна по адресу:
```
http://localhost:3000/api
```

## 🔧 Конфигурация

### Переменные окружения

#### Обязательные:
- `DATABASE_URL` - Строка подключения к PostgreSQL
- `JWT_SECRET` - Секретный ключ для JWT
- `JWT_EXPIRES_IN` - Время жизни JWT токена (по умолчанию: 7d)
- `NODE_ENV` - Окружение (development/production)
- `PORT` - Порт приложения (по умолчанию: 3000)

#### Опциональные (для email):
- `MAIL_HOST` - SMTP хост (например: smtp.gmail.com)
- `MAIL_PORT` - SMTP порт (например: 587)
- `MAIL_USER` - Email для отправки
- `MAIL_PASS` - Пароль для email (App Password для Gmail)
- `MAIL_FROM` - От кого отправляются письма
- `FRONTEND_URL` - URL фронтенда для ссылок в email

## 🐛 Troubleshooting

### Проблемы с базой данных
```bash
# Проверка подключения
npx prisma db pull --print

# Сброс и пересоздание
npx prisma migrate reset
```

### Проблемы с JWT
- Убедитесь, что JWT_SECRET установлен
- Проверьте время жизни токена

### Проблемы с email (если используется)
- Убедитесь, что SMTP настройки корректны
- Для Gmail используйте App Password
- Проверьте настройки firewall

## 📝 Лицензия

MIT License

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>