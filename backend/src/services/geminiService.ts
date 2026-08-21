import { GoogleGenAI } from '@google/genai';
import { ENV } from '../config/env';
import { outfitRepository } from '../repositories/outfitRepository';
import { logger } from '../config/logger';

export interface StyleAdviceRequest {
  occasion: string;
  gender?: string;
  budget?: number;
  stylePreference?: string;
}

export interface DamageAssessmentRequest {
  issueType: string;
  description: string;
  depositAmount: number;
  fabric?: string;
}

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (ENV.GEMINI_API_KEY) {
      try {
        this.ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
      } catch (err) {
        logger.warn('Failed to initialize GoogleGenAI with provided key.', err);
      }
    }
  }

  async getStylingAdvice(req: StyleAdviceRequest): Promise<{ recommendations: any[]; stylingAdvice: string }> {
    const matchingOutfits = await outfitRepository.searchAndFilter({
      occasion: req.occasion,
      gender: req.gender,
      maxPrice: req.budget
    });

    const curated = matchingOutfits.slice(0, 3);

    let advice = `For a ${req.occasion} in Nashik, we recommend pairing rich silk textures like Raw Silk or Pure Paithani with elegant gold jewelry and classic Kolhapuri or Mojari footwear.`;

    if (this.ai && ENV.GEMINI_API_KEY) {
      try {
        const prompt = `You are the lead luxury fashion stylist for Vastraloop in Nashik, Maharashtra.
A customer is looking for occasion wear for:
- Occasion: ${req.occasion}
- Gender: ${req.gender || 'Any'}
- Budget: ₹${req.budget || 2500}/day
- Preference: ${req.stylePreference || 'Traditional & Royal'}

Provide a 2-3 sentence personalized styling tip (mentioning fabric, accessory pairings like Kolhapuri or Jutti, and draping/fit tips suitable for celebrations in Maharashtra).`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response && response.text) {
          advice = response.text.trim();
        }
      } catch (err) {
        logger.warn('Gemini API call failed, using rule-based styling advice.', err);
      }
    }

    return {
      recommendations: curated,
      stylingAdvice: advice
    };
  }

  async assessDamage(req: DamageAssessmentRequest): Promise<{
    estimatedCleaningCost: number;
    recommendedDeduction: number;
    reasoning: string;
  }> {
    let estimatedCost = 400;
    let reasoning = `Standard dry-cleaning and fabric restoration estimation for ${req.issueType} on occasion wear.`;

    if (req.issueType === 'Stain') estimatedCost = 450;
    else if (req.issueType === 'Tear / Rip') estimatedCost = 800;
    else if (req.issueType === 'Missing Accessory') estimatedCost = 600;
    else if (req.issueType === 'Late Return') estimatedCost = 500;

    const recommendedDeduction = Math.min(estimatedCost, req.depositAmount);

    if (this.ai && ENV.GEMINI_API_KEY) {
      try {
        const prompt = `You are the Vastraloop quality control and fabric restoration expert in Nashik.
A boutique owner filed a rental return issue:
- Issue Type: ${req.issueType}
- Description: ${req.description}
- Security Deposit: ₹${req.depositAmount}
- Fabric: ${req.fabric || 'Silk Blend'}

Provide a short 2-sentence objective assessment of the standard restoration fee in INR and fair escrow deduction.`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response && response.text) {
          reasoning = response.text.trim();
        }
      } catch (err) {
        logger.warn('Gemini damage assessment call failed, using rule-based estimate.', err);
      }
    }

    return {
      estimatedCleaningCost: estimatedCost,
      recommendedDeduction,
      reasoning
    };
  }
}

export const geminiService = new GeminiService();
