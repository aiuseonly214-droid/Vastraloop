import { InMemoryRepository } from './baseRepository';
import { BoutiquePartnerEntity, PayoutRecord } from '../models/types';
import { SEED_BOUTIQUES, SEED_PAYOUTS } from '../data/seedData';

export class BoutiqueRepository extends InMemoryRepository<BoutiquePartnerEntity> {
  private payouts: PayoutRecord[] = [...SEED_PAYOUTS];

  constructor() {
    super(SEED_BOUTIQUES);
  }

  async findByOwnerUserId(ownerUserId: string): Promise<BoutiquePartnerEntity | null> {
    const list = await this.findAll((b) => b.ownerUserId === ownerUserId);
    return list.length > 0 ? list[0] : null;
  }

  async getPayoutsForBoutique(boutiqueId: string): Promise<PayoutRecord[]> {
    return this.payouts.filter((p) => p.boutiqueId === boutiqueId);
  }

  async addPayout(payout: PayoutRecord): Promise<PayoutRecord> {
    this.payouts.unshift(payout);
    const boutique = await this.findById(payout.boutiqueId);
    if (boutique) {
      await this.update(boutique.id, { totalEarnings: boutique.totalEarnings + payout.amount });
    }
    return payout;
  }
}

export const boutiqueRepository = new BoutiqueRepository();
