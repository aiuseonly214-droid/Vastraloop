import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { authService, AuthService } from '../services/authService';
import { sendSuccess, sendCreated } from '../utils/response';

export class AuthController {
  constructor(private service: AuthService = authService) {}

  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.register(req.body);
      sendCreated(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login({
        emailOrPhone: req.body.email || req.body.phone || req.body.emailOrPhone,
        password: req.body.password
      });
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.service.getProfile(req.user!.userId);
      sendSuccess(res, { user: profile }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, { user: updated }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  verifyAadhaarId = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { aadhaarNumber, otp } = req.body;
      const verified = await this.service.verifyAadhaarId(req.user!.userId, aadhaarNumber, otp);
      sendSuccess(res, { user: verified, verifiedId: true }, 'ID successfully verified via Aadhaar OTP');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
