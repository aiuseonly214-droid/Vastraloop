import { claimRepository, ClaimRepository } from '../repositories/claimRepository';
import { orderRepository, OrderRepository } from '../repositories/orderRepository';
import { outfitRepository, OutfitRepository } from '../repositories/outfitRepository';
import { boutiqueRepository, BoutiqueRepository } from '../repositories/boutiqueRepository';
import { DamageClaimEntity } from '../models/types';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/appError';
import { ERROR_CODES } from '../constants/statusCodes';

export interface CreateClaimDto {
  orderNumber: string;
  itemTitle?: string;
  issueType: 'Stain' | 'Tear / Rip' | 'Missing Accessory' | 'Late Return';
  claimedAmount: number;
  evidenceDescription: string;
  evidenceImage?: string;
}

export interface ResolveClaimDto {
  status: 'Approved' | 'Rejected' | 'Adjusted';
  resolutionNotes?: string;
  adjustedAmount?: number;
}

export class ClaimService {
  constructor(
    private claimRepo: ClaimRepository = claimRepository,
    private orderRepo: OrderRepository = orderRepository,
    private outfitRepo: OutfitRepository = outfitRepository,
    private boutiqueRepo: BoutiqueRepository = boutiqueRepository
  ) {}

  async createClaim(reportedById: string, reporterName: string, dto: CreateClaimDto): Promise<DamageClaimEntity> {
    const order = await this.orderRepo.findByOrderNumber(dto.orderNumber);
    if (!order) {
      throw new NotFoundError(`Rental order '${dto.orderNumber}' not found.`, ERROR_CODES.NOT_FOUND);
    }

    if (dto.claimedAmount <= 0) {
      throw new BadRequestError('Claimed deduction amount must be greater than zero.');
    }

    if (dto.claimedAmount > order.depositFee) {
      throw new BadRequestError(
        `Claimed amount (₹${dto.claimedAmount}) exceeds the order security deposit (₹${order.depositFee}).`,
        ERROR_CODES.ESCROW_LIMIT_EXCEEDED
      );
    }

    const now = new Date().toISOString();
    const newClaim: DamageClaimEntity = {
      id: `claim-${Date.now()}`,
      orderNumber: order.orderNumber,
      orderId: order.id,
      itemTitle: dto.itemTitle || order.outfitTitle,
      reportedBy: `${reporterName} (Boutique Owner)`,
      reportedById: reportedById,
      issueType: dto.issueType,
      claimedAmount: Number(dto.claimedAmount),
      status: 'Pending Admin Review',
      evidenceDescription: dto.evidenceDescription.trim(),
      evidenceImage: dto.evidenceImage,
      createdAt: now
    };

    // Mark order as damage reported
    await this.orderRepo.update(order.id, { damageReported: true });

    return this.claimRepo.create(newClaim);
  }

  async listClaims(requestingUserId?: string, requestingUserRole?: string): Promise<DamageClaimEntity[]> {
    if (requestingUserRole === 'admin') {
      return this.claimRepo.findAll();
    }
    if (requestingUserId) {
      return this.claimRepo.findByReportedById(requestingUserId);
    }
    return this.claimRepo.findAll();
  }

  async getClaimById(id: string): Promise<DamageClaimEntity> {
    const claim = await this.claimRepo.findById(id);
    if (!claim) {
      throw new NotFoundError(`Damage claim '${id}' not found.`);
    }
    return claim;
  }

  async resolveClaim(claimId: string, dto: ResolveClaimDto): Promise<DamageClaimEntity> {
    const claim = await this.getClaimById(claimId);

    const now = new Date().toISOString();
    const resolvedDeduction =
      dto.status === 'Approved'
        ? claim.claimedAmount
        : dto.status === 'Adjusted'
        ? dto.adjustedAmount || claim.claimedAmount
        : 0;

    const updatedClaim = await this.claimRepo.update(claimId, {
      status: dto.status,
      resolutionNotes: dto.resolutionNotes || `Claim marked as ${dto.status} by Vastraloop Admin.`,
      adjustedAmount: resolvedDeduction,
      resolvedAt: now
    });

    // Settle the order deposit escrow refund
    const order = await this.orderRepo.findByOrderNumber(claim.orderNumber);
    if (order) {
      const netRefund = Math.max(0, order.depositFee - resolvedDeduction);
      await this.orderRepo.update(order.id, {
        depositRefundAmount: netRefund,
        status: 'deposit_refunded',
        inspectionNotes: `Dispute resolved: ₹${resolvedDeduction} deducted for ${claim.issueType}. Net refund: ₹${netRefund}.`
      });

      // --- FIX 3: Trigger Boutique Payout for Damage Claim ---
      if (resolvedDeduction > 0) {
        const outfit = await this.outfitRepo.findById(order.outfitId);
        if (outfit && outfit.ownerId) {
          const boutique = await this.boutiqueRepo.findByOwnerUserId(outfit.ownerId);
          if (boutique) {
            await this.boutiqueRepo.addPayout({
              id: `payout-claim-${Date.now()}`,
              boutiqueId: boutique.id,
              orderNumber: order.orderNumber,
              outfitTitle: `Damage Claim: ${order.outfitTitle}`,
              amount: resolvedDeduction,
              date: now,
              status: 'Completed'
            });
          }
        }
      }
    }

    return updatedClaim!;
  }
}

export const claimService = new ClaimService();
