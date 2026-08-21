import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, ERROR_CODES } from '../constants/statusCodes';
import { sendError } from '../utils/response';
import { ENV } from '../config/env';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

// Cleanup stale records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipMap.entries()) {
    if (now > record.resetTime) {
      ipMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export function rateLimiter(maxRequests: number = ENV.RATE_LIMIT_MAX_REQUESTS, windowMs: number = ENV.RATE_LIMIT_WINDOW_MS) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const record = ipMap.get(ip);
    if (!record || now > record.resetTime) {
      ipMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > maxRequests) {
      sendError(
        res,
        'Too many requests from this IP, please try again later.',
        HTTP_STATUS.TOO_MANY_REQUESTS,
        ERROR_CODES.TOO_MANY_REQUESTS
      );
      return;
    }

    next();
  };
}
