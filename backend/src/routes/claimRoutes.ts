import { Router } from 'express';
import { claimController } from '../controllers/claimController';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac';
import { validate, Validators } from '../middlewares/validate';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole('owner', 'admin'),
  validate({
    body: {
      orderNumber: Validators.required('Order number'),
      claimedAmount: Validators.positiveNumber('Claimed amount'),
      issueType: Validators.oneOf(['Stain', 'Tear / Rip', 'Missing Accessory', 'Late Return'], 'Issue type'),
      evidenceDescription: Validators.required('Evidence description')
    }
  }),
  claimController.create
);

router.get('/', authenticate, claimController.list);
router.get('/:id', authenticate, claimController.getById);

router.patch(
  '/:id/resolve',
  authenticate,
  requireRole('admin'),
  validate({
    body: {
      status: Validators.oneOf(['Approved', 'Rejected', 'Adjusted'], 'Resolution status')
    }
  }),
  claimController.resolve
);

export default router;
