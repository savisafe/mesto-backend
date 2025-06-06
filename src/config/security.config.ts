import { HelmetOptions } from 'helmet';

export const securityConfig = {
  // Настройки CORS
  cors: {
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://10-x-red.vercel.app',
      'https://system10x.btlz-api.ru',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },

  // Настройки Helmet
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://system10x.btlz-api.ru'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' as const },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  } as HelmetOptions,

  // Настройки rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 50, // Лимит запросов с одного IP
    message: JSON.stringify({
      statusCode: 429,
      message: 'Слишком много запросов. Пожалуйста, подождите немного.',
      error: 'Too Many Requests',
    }),
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Настройки throttler
  throttler: {
    limit: 10,
    ttl: 60,
  },

  // Настройки JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '1d',
    refreshExpiresIn: '7d',
  },
};
