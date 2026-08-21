import { InMemoryRepository } from './baseRepository';
import { RentalOrderEntity, RentalStatus } from '../models/types';
import { SEED_ORDERS } from '../data/seedData';

export class OrderRepository extends InMemoryRepository<RentalOrderEntity> {
  constructor() {
    super(SEED_ORDERS);
  }

  async findByOrderNumber(orderNumber: string): Promise<RentalOrderEntity | null> {
    const orders = await this.findAll((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
    return orders.length > 0 ? orders[0] : null;
  }

  async findByCustomerId(customerId: string, filter?: 'all' | 'active' | 'completed'): Promise<RentalOrderEntity[]> {
    const activeStatuses: RentalStatus[] = ['confirmed', 'ready_for_pickup', 'in_use', 'return_pending', 'inspection'];
    const completedStatuses: RentalStatus[] = ['deposit_refunded', 'completed', 'cancelled'];

    return this.findAll((o) => {
      if (o.customerId !== customerId) return false;
      if (filter === 'active') return activeStatuses.includes(o.status);
      if (filter === 'completed') return completedStatuses.includes(o.status);
      return true;
    });
  }

  async findByBoutique(boutiqueName: string): Promise<RentalOrderEntity[]> {
    return this.findAll((o) => o.boutique.toLowerCase().includes(boutiqueName.toLowerCase()));
  }

  async findActiveByOutfitId(outfitId: string): Promise<RentalOrderEntity[]> {
    const activeStatuses: RentalStatus[] = ['confirmed', 'ready_for_pickup', 'in_use', 'return_pending', 'inspection'];
    return this.findAll((o) => o.outfitId === outfitId && activeStatuses.includes(o.status));
  }
}

export const orderRepository = new OrderRepository();
