import { InMemoryRepository } from './baseRepository';
import { DamageClaimEntity } from '../models/types';
import { SEED_CLAIMS } from '../data/seedData';

export class ClaimRepository extends InMemoryRepository<DamageClaimEntity> {
  constructor() {
    super(SEED_CLAIMS);
  }

  async findByOrderNumber(orderNumber: string): Promise<DamageClaimEntity[]> {
    return this.findAll((c) => c.orderNumber.toLowerCase() === orderNumber.toLowerCase());
  }

  async findByReportedById(userId: string): Promise<DamageClaimEntity[]> {
    return this.findAll((c) => c.reportedById === userId);
  }
}

export const claimRepository = new ClaimRepository();
