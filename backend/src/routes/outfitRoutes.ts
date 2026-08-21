import { Router } from 'express';
import { outfitController } from '../controllers/outfitController';
import { authenticate, optionalAuthenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac';
import { validate, Validators } from '../middlewares/validate';

const router = Router();

router.get('/', optionalAuthenticate, outfitController.list);
router.get('/:id', optionalAuthenticate, outfitController.getById);

router.post(
  '/',
  authenticate,
  requireRole('owner', 'admin'),
  validate({
    body: {
      title: Validators.required('Title'),
      boutique: Validators.required('Boutique name'),
      pricePerDay: Validators.positiveNumber('Price per day'),
      deposit: Validators.required('Security deposit'),
      size: Validators.required('Size')
    }
  }),
  outfitController.create
);

router.put('/:id', authenticate, requireRole('owner', 'admin'), outfitController.update);
router.delete('/:id', authenticate, requireRole('owner', 'admin'), outfitController.delete);

router.post('/:id/availability', outfitController.checkAvailability);

export default router;
