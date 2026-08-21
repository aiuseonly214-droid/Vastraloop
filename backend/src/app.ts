import express, { Request, Response, NextFunction } from 'express';
import { ENV } from './config/env';
import { logger } from './config/logger';
import { rateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './utils/appError';
import routes from './routes';

export function createApp(): express.Application {
  const app = express();

  // Basic security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Access-Control-Allow-Origin', ENV.CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Sliding Rate Limiter
  app.use(rateLimiter());

  // Request Logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // Mount API Router under /api/v1 and alias /api
  app.use('/api/v1', routes);
  app.use('/api', routes);

  // 404 Catch-all for undefined routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
  });

  // Centralized Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
