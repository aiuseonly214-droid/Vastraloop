import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { outfitService, OutfitService } from '../services/outfitService';
import { sendSuccess, sendCreated } from '../utils/response';

export class OutfitController {
  constructor(private service: OutfitService = outfitService) {}

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const criteria = {
        search: req.query.search as string,
        category: req.query.category as string,
        gender: req.query.gender as string,
        occasion: req.query.occasion as string,
        size: req.query.size as string,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        verifiedOnly: req.query.verifiedOnly === 'true',
        location: req.query.location as string,
        ownerId: req.query.ownerId as string,
      };

      const outfits = await this.service.listOutfits(criteria);
      sendSuccess(res, outfits, 'Outfits retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const outfit = await this.service.getOutfitById(req.params.id);
      sendSuccess(res, outfit, 'Outfit details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newOutfit = await this.service.createOutfit(req.body, req.user?.userId);
      sendCreated(res, newOutfit, 'Outfit listing created successfully');
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateOutfit(
        req.params.id,
        req.body,
        req.user?.userId,
        req.user?.role
      );
      sendSuccess(res, updated, 'Outfit updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteOutfit(req.params.id, req.user?.userId, req.user?.role);
      sendSuccess(res, null, 'Outfit listing deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  checkAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dayNumbers = req.body.dayNumbers || [];
      const result = await this.service.checkAvailability(req.params.id, dayNumbers);
      sendSuccess(res, result, 'Availability checked successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const outfitController = new OutfitController();
