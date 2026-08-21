import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { claimService, ClaimService } from '../services/claimService';
import { sendSuccess, sendCreated } from '../utils/response';

export class ClaimController {
  constructor(private service: ClaimService = claimService) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const claim = await this.service.createClaim(
        req.user!.userId,
        req.user!.name,
        req.body
      );
      sendCreated(res, claim, 'Damage claim submitted to Vastraloop Admin for inspection');
    } catch (error) {
      next(error);
    }
  };

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const claims = await this.service.listClaims(req.user?.userId, req.user?.role);
      sendSuccess(res, claims, 'Claims retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const claim = await this.service.getClaimById(req.params.id);
      sendSuccess(res, claim, 'Claim details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  resolve = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resolved = await this.service.resolveClaim(req.params.id, req.body);
      sendSuccess(res, resolved, `Damage claim has been marked as ${req.body.status}`);
    } catch (error) {
      next(error);
    }
  };
}

export const claimController = new ClaimController();
