import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { UserRole } from '../models/types';
import { ForbiddenError, UnauthorizedError } from '../utils/appError';
import { ERROR_CODES } from '../constants/statusCodes';

/**
 * Require one of the specified roles to access an endpoint
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required before role check.', ERROR_CODES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Forbidden - Role '${req.user.role}' is not authorized to access this resource. Allowed roles: [${allowedRoles.join(', ')}]`,
          ERROR_CODES.FORBIDDEN
        )
      );
    }

    next();
  };
}
