import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { boutiqueService, BoutiqueService } from '../services/boutiqueService';
import { sendSuccess } from '../utils/response';

export class BoutiqueController {
  constructor(private service: BoutiqueService = boutiqueService) {}

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await this.service.listBoutiques();
      sendSuccess(res, list, 'Verified boutiques retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const boutique = await this.service.getBoutiqueById(req.params.id);
      sendSuccess(res, boutique, 'Boutique details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getPayouts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payouts = await this.service.getBoutiquePayouts(req.params.id);
      sendSuccess(res, payouts, 'Boutique payouts and earnings retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getShopOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const boutiqueName = (req.query.boutique as string) || 'Vastra Boutique';
      const orders = await this.service.getBoutiqueShopOrders(boutiqueName);
      sendSuccess(res, orders, 'Shop orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const boutiqueController = new BoutiqueController();
