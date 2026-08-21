import { Router } from 'express';
import authRoutes from './authRoutes';
import outfitRoutes from './outfitRoutes';
import orderRoutes from './orderRoutes';
import claimRoutes from './claimRoutes';
import boutiqueRoutes from './boutiqueRoutes';
import aiRoutes from './aiRoutes';
import { sendSuccess } from '../utils/response';

const router = Router();

// Root Welcome Route
router.get('/', (req, res) => {
  sendSuccess(res, { version: '1.0.0' }, 'Welcome to Vastraloop API');
});

// Health Check
router.get('/health', (req, res) => {
  sendSuccess(
    res,
    {
      status: 'healthy',
      service: 'Vastraloop Backend API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
    },
    'Vastraloop API is operational'
  );
});

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/outfits', outfitRoutes);
router.use('/orders', orderRoutes);
router.use('/claims', claimRoutes);
router.use('/boutiques', boutiqueRoutes);
router.use('/ai', aiRoutes);

export default router;
