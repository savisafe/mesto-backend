# Mesto Backend API

## Описание
Backend API для сервиса Mesto, разработанный с использованием NestJS, Prisma и PostgreSQL.

## Технологии
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- TypeScript
- Nodemailer for email sending

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd mesto-backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env в корневой директории:
```env
DATABASE_URL="postgresql://saveliytkachenko@localhost:5432/mesto?schema=public"
PORT=3000
```

4. Примените миграции базы данных:
```bash
npx prisma migrate dev
```

5. Запустите приложение:
```bash
npm run start:dev
```

## API Endpoints

### Авторизация

#### Регистрация
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John",
}
```

#### Вход с паролем
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Вход по email (без пароля)
```http
GET /auth/login-with-email?email=user@example.com
```

#### Вход по ссылке из email
```http
GET /auth/login-with-email/:token
```

### Ответы авторизации

#### Успешная авторизация
```json
{
  "access_token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT"
  }
}
```

#### Ошибки
- `400 Bad Request` - Неверный формат данных
- `401 Unauthorized` - Неверные учетные данные
- `403 Forbidden` - Аккаунт заблокирован

### Пользователи

#### Получение профиля текущего пользователя
```http
GET /users/me
Authorization: Bearer <jwt_token>
```

#### Обновление профиля
```http
PATCH /users/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Бизнесы

#### Создание нового бизнеса
```http
POST /businesses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "My Business",
  "description": "Business description",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

#### Получение списка бизнесов
```http
GET /businesses
Authorization: Bearer <jwt_token>
```

#### Получение бизнеса по ID
```http
GET /businesses/:id
Authorization: Bearer <jwt_token>
```

### Заказы

#### Создание нового заказа
```http
POST /orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "businessId": "business_id",
  "items": [
    {
      "itemType": "PRODUCT",
      "productId": "product_id",
      "quantity": 2
    },
    {
      "itemType": "SERVICE",
      "serviceId": "service_id",
      "quantity": 1
    }
  ]
}
```

#### Получение списка заказов
```http
GET /orders
Authorization: Bearer <jwt_token>
```

#### Получение заказа по ID
```http
GET /orders/:id
Authorization: Bearer <jwt_token>
```

### Продукты

#### Создание нового продукта
```http
POST /products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "businessId": "business_id"
}
```

#### Получение списка продуктов
```http
GET /products
Authorization: Bearer <jwt_token>
```

### Услуги

#### Создание новой услуги
```http
POST /services
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Service Name",
  "description": "Service description",
  "price": 149.99,
  "duration": 60,
  "businessId": "business_id"
}
```

#### Получение списка услуг
```http
GET /services
Authorization: Bearer <jwt_token>
```

## Роли пользователей

Система поддерживает следующие роли:
- Admin: Полный доступ ко всем функциям
- Owner: Владелец бизнеса
- Manager: Управляющий бизнесом
- Employee: Сотрудник
- Client: Клиент

## Безопасность

- Все пароли хешируются перед сохранением
- JWT токены используются для аутентификации
- Реализована защита от брутфорса
- Поддерживается вход по email без пароля
- Все запросы валидируются
- Настроен CORS для безопасной работы с фронтендом
- Nodemailer for secure email sending

## Разработка

Для запуска в режиме разработки:
```bash
npm run start:dev
```

Для сборки:
```bash
npm run build
```

Для запуска в production:
```bash
npm run start:prod
```

## Структура проекта

```
src/
├── prisma/           # Конфигурация Prisma
├── modules/          # Модули приложения
├── controllers/      # Контроллеры
├── services/         # Сервисы
└── main.ts          # Точка входа приложения
```

## Разработка

### Генерация Prisma клиента
```bash
npx prisma generate
```

### Создание новой миграции
```bash
npx prisma migrate dev --name <имя-миграции>
```

### Просмотр базы данных
```bash
npx prisma studio
```

## Тестирование

```bash
# unit тесты
npm run test

# e2e тесты
npm run test:e2e

# тестовое покрытие
npm run test:cov
```

## Лицензия

MIT

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mesto?schema=public"
PORT=3000
