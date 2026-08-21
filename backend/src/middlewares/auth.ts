import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/crypto';
import { UnauthorizedError } from '../utils/appError';
import { ERROR_CODES } from '../constants/statusCodes';
import { userRepository } from '../repositories/userRepository';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required. Missing Bearer token.', ERROR_CODES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired authentication token.', ERROR_CODES.INVALID_TOKEN);
    }

    // Verify user still exists in repository
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User session is no longer valid.', ERROR_CODES.UNAUTHORIZED);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }
    next();
  } catch {
    next();
  }
}
