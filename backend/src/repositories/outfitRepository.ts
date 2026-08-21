import { InMemoryRepository } from './baseRepository';
import { OutfitItemEntity } from '../models/types';
import { SEED_OUTFITS } from '../data/seedData';

export interface OutfitFilterCriteria {
  search?: string;
  category?: string;
  gender?: string;
  occasion?: string;
  size?: string;
  maxPrice?: number;
  verifiedOnly?: boolean;
  location?: string;
  ownerId?: string;
}

export class OutfitRepository extends InMemoryRepository<OutfitItemEntity> {
  constructor() {
    super(SEED_OUTFITS);
  }

  async searchAndFilter(criteria: OutfitFilterCriteria): Promise<OutfitItemEntity[]> {
    return this.findAll((item) => {
      // Must be available unless filtered by owner
      if (!criteria.ownerId && !item.available) return false;

      if (criteria.ownerId && item.ownerId !== criteria.ownerId) {
        return false;
      }

      if (criteria.gender && criteria.gender !== 'All' && item.gender !== criteria.gender) {
        return false;
      }

      if (criteria.occasion && criteria.occasion !== 'All' && item.occasion.toLowerCase() !== criteria.occasion.toLowerCase()) {
        return false;
      }

      if (criteria.category && criteria.category !== 'All') {
        const catLower = criteria.category.toLowerCase();
        const itemCatLower = item.category.toLowerCase();
        if (itemCatLower !== catLower && !itemCatLower.includes(catLower.slice(0, -1))) {
          return false;
        }
      }

      if (criteria.size && criteria.size !== 'All') {
        const hasSize = item.size === criteria.size || item.availableSizes.includes(criteria.size);
        if (!hasSize) return false;
      }

      if (criteria.maxPrice && item.pricePerDay > criteria.maxPrice) {
        return false;
      }

      if (criteria.verifiedOnly && !item.isBoutiqueVerified) {
        return false;
      }

      if (criteria.location && criteria.location !== 'All') {
        if (!item.location.toLowerCase().includes(criteria.location.toLowerCase())) {
          return false;
        }
      }

      if (criteria.search) {
        const q = criteria.search.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.boutique.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.fabric.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }

  async addReservedDates(outfitId: string, dayNumbers: number[]): Promise<OutfitItemEntity | null> {
    const outfit = await this.findById(outfitId);
    if (!outfit) return null;
    const updatedDates = Array.from(new Set([...outfit.bookedDates, ...dayNumbers]));
    return this.update(outfitId, { bookedDates: updatedDates });
  }

  async removeReservedDates(outfitId: string, dayNumbers: number[]): Promise<OutfitItemEntity | null> {
    const outfit = await this.findById(outfitId);
    if (!outfit) return null;
    const updatedDates = outfit.bookedDates.filter((d) => !dayNumbers.includes(d));
    return this.update(outfitId, { bookedDates: updatedDates });
  }
}

export const outfitRepository = new OutfitRepository();
