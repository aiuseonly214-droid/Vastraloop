import { boutiqueRepository, BoutiqueRepository } from '../repositories/boutiqueRepository';
import { orderRepository, OrderRepository } from '../repositories/orderRepository';
import { BoutiquePartnerEntity, PayoutRecord, RentalOrderEntity } from '../models/types';
import { NotFoundError } from '../utils/appError';

export class BoutiqueService {
  constructor(
    private boutiqueRepo: BoutiqueRepository = boutiqueRepository,
    private orderRepo: OrderRepository = orderRepository
  ) {}

  async listBoutiques(): Promise<BoutiquePartnerEntity[]> {
    return this.boutiqueRepo.findAll();
  }

  async getBoutiqueById(id: string): Promise<BoutiquePartnerEntity> {
    const boutique = await this.boutiqueRepo.findById(id);
    if (!boutique) {
      throw new NotFoundError(`Boutique '${id}' not found.`);
    }
    return boutique;
  }

  async getBoutiquePayouts(boutiqueId: string): Promise<{ totalEarnings: number; payouts: PayoutRecord[] }> {
    const boutique = await this.getBoutiqueById(boutiqueId);
    const payouts = await this.boutiqueRepo.getPayoutsForBoutique(boutiqueId);
    return {
      totalEarnings: boutique.totalEarnings,
      payouts
    };
  }

  async getBoutiqueShopOrders(boutiqueName: string): Promise<RentalOrderEntity[]> {
    return this.orderRepo.findByBoutique(boutiqueName);
  }
}

export const boutiqueService = new BoutiqueService();
