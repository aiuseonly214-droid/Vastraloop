import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { validate, Validators } from '../middlewares/validate';

const router = Router();

router.post(
  '/register',
  validate({
    body: {
      name: Validators.required('Name'),
      email: Validators.email,
      phone: Validators.phone,
      password: Validators.minLength(6, 'Password')
    }
  }),
  authController.register
);

router.post(
  '/login',
  validate({
    body: {
      password: Validators.required('Password')
    }
  }),
  authController.login
);

router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);

router.post(
  '/verify-id',
  authenticate,
  validate({
    body: {
      aadhaarNumber: Validators.required('Aadhaar number'),
      otp: Validators.required('Aadhaar OTP')
    }
  }),
  authController.verifyAadhaarId
);

export default router;
