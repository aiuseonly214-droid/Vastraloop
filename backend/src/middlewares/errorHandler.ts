import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/response';
import { HTTP_STATUS, ERROR_CODES } from '../constants/statusCodes';
import { logger } from '../config/logger';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[Operational 5xx] ${err.message}`, { stack: err.stack, path: req.path });
    } else {
      logger.warn(`[Client ${err.statusCode}] ${err.message}`, { path: req.path, code: err.code });
    }

    sendError(res, err.message, err.statusCode, err.code, err.errors);
    return;
  }

  // Uncaught system errors
  logger.error(`[Unhandled Exception] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  sendError(
    res,
    'Internal server error occurred',
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.INTERNAL_ERROR
  );
}
