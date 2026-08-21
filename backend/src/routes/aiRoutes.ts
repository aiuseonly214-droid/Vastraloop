import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticate, optionalAuthenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac';

const router = Router();

router.post('/recommend', optionalAuthenticate, aiController.recommendStyling);
router.post('/damage-assessment', authenticate, requireRole('owner', 'admin'), aiController.assessDamage);

export default router;
