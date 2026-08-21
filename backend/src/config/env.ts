import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'vastraloop-super-secret-jwt-key-2026-production-ready',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX_REQUESTS: 200,
};
