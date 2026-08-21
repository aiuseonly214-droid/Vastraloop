import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';
import { validate, Validators } from '../middlewares/validate';

const router = Router();

router.post(
  '/',
  authenticate,
  validate({
    body: {
      outfitId: Validators.required('Outfit ID'),
      durationDays: Validators.positiveNumber('Duration days'),
      startDate: Validators.required('Start date'),
      endDate: Validators.required('End date'),
      fulfillmentType: Validators.oneOf(['delivery', 'pickup'], 'Fulfillment type'),
      paymentMethod: Validators.oneOf(['upi', 'card', 'cash'], 'Payment method')
    }
  }),
  orderController.create
);

router.get('/', authenticate, orderController.list);
router.get('/:id', authenticate, orderController.getById);

router.patch(
  '/:id/status',
  authenticate,
  validate({
    body: {
      status: Validators.required('Status')
    }
  }),
  orderController.updateStatus
);

export default router;
