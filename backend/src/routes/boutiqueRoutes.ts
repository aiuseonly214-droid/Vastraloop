import { Router } from 'express';
import { boutiqueController } from '../controllers/boutiqueController';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac';

const router = Router();

router.get('/', boutiqueController.list);
router.get('/shop-orders', authenticate, requireRole('owner', 'admin'), boutiqueController.getShopOrders);
router.get('/:id', boutiqueController.getById);
router.get('/:id/payouts', authenticate, requireRole('owner', 'admin'), boutiqueController.getPayouts);

export default router;
