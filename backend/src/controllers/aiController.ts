import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { geminiService, GeminiService } from '../services/geminiService';
import { sendSuccess } from '../utils/response';

export class AIController {
  constructor(private service: GeminiService = geminiService) {}

  recommendStyling = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getStylingAdvice({
        occasion: req.body.occasion || 'Wedding',
        gender: req.body.gender,
        budget: req.body.budget ? Number(req.body.budget) : undefined,
        stylePreference: req.body.stylePreference
      });
      sendSuccess(res, result, 'AI Occasion Styling recommendations generated');
    } catch (error) {
      next(error);
    }
  };

  assessDamage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.assessDamage({
        issueType: req.body.issueType || 'Stain',
        description: req.body.description || 'Inspection finding',
        depositAmount: Number(req.body.depositAmount || 3000),
        fabric: req.body.fabric
      });
      sendSuccess(res, result, 'AI Damage assessment completed');
    } catch (error) {
      next(error);
    }
  };
}

export const aiController = new AIController();
