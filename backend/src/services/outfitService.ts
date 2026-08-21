import { outfitRepository, OutfitRepository, OutfitFilterCriteria } from '../repositories/outfitRepository';
import { OutfitItemEntity } from '../models/types';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/appError';
import { ERROR_CODES } from '../constants/statusCodes';

export interface CreateOutfitDto {
  title: string;
  boutique: string;
  boutiqueAddress: string;
  boutiquePhone: string;
  location?: string;
  pricePerDay: number;
  deposit: number;
  size: string;
  availableSizes?: string[];
  fabric?: string;
  fit?: string;
  cancellationPolicy?: string;
  deliveryOptions?: string;
  images: string[];
  category: 'Sherwani' | 'Lehenga' | 'Tuxedo' | 'Saree' | 'Indo-Western' | 'Kurta' | 'Gown';
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  occasion: 'Wedding' | 'Festivals' | 'Party Wear' | 'Reception' | 'Sangeet' | 'Traditional';
  description?: string;
}

export class OutfitService {
  constructor(private outfitRepo: OutfitRepository = outfitRepository) {}

  async listOutfits(criteria: OutfitFilterCriteria): Promise<OutfitItemEntity[]> {
    return this.outfitRepo.searchAndFilter(criteria);
  }

  async getOutfitById(id: string): Promise<OutfitItemEntity> {
    const outfit = await this.outfitRepo.findById(id);
    if (!outfit) {
      throw new NotFoundError(`Outfit with id '${id}' not found.`, ERROR_CODES.NOT_FOUND);
    }
    return outfit;
  }

  async createOutfit(dto: CreateOutfitDto, ownerId?: string): Promise<OutfitItemEntity> {
    const now = new Date().toISOString();
    const newOutfit: OutfitItemEntity = {
      id: `outfit-${Date.now()}`,
      title: dto.title.trim(),
      boutique: dto.boutique.trim(),
      boutiqueAddress: dto.boutiqueAddress.trim(),
      boutiquePhone: dto.boutiquePhone.trim(),
      location: dto.location || dto.boutiqueAddress,
      pricePerDay: Number(dto.pricePerDay),
      deposit: Number(dto.deposit),
      rating: 5.0,
      reviewsCount: 1,
      size: dto.size,
      availableSizes: dto.availableSizes && dto.availableSizes.length > 0 ? dto.availableSizes : [dto.size],
      fabric: dto.fabric || 'Fine Silk Blend',
      fit: dto.fit || 'Tailored Fit',
      cancellationPolicy: dto.cancellationPolicy || '48hrs Prior',
      deliveryOptions: dto.deliveryOptions || 'Store Pickup / Delivery',
      images: dto.images && dto.images.length > 0 ? dto.images : ['https://lh3.googleusercontent.com/aida-public/AB6AXuAo8zZfvjKpsCM_cU5arWQAcCzofvYNLY3yS8jOKA6hMm9OifjzClqJUVJjY3PmCG-teToG6tC-B1MVF7zMyZtvtvboCfsH2RewjvnIYmGGVIZQ-3JDsbqdmlK5QjAkVdXuNmBFW-JAVuhkmMy8qz6jlY7FkxexiOJOg7VBOGpEgWUCI7NiehmGrEhcuSGizt_qn8QGUBR3_jSJd1GVKlqQknu5xwzRsdQnucOCA5Ya4KD6tFlbUik1'],
      category: dto.category,
      gender: dto.gender,
      occasion: dto.occasion,
      isBoutiqueVerified: true,
      description: dto.description || 'Stunning occasion outfit in mint condition, professionally dry cleaned and ready for rent in Nashik.',
      bookedDates: [],
      available: true,
      ownerId: ownerId,
      createdAt: now,
      updatedAt: now
    };

    return this.outfitRepo.create(newOutfit);
  }

  async updateOutfit(
    id: string,
    updates: Partial<OutfitItemEntity>,
    requestingUserId?: string,
    requestingUserRole?: string
  ): Promise<OutfitItemEntity> {
    const existing = await this.getOutfitById(id);

    // Check ownership if not admin
    if (requestingUserRole !== 'admin' && existing.ownerId && existing.ownerId !== requestingUserId) {
      throw new ForbiddenError('You can only modify outfits listed by your boutique.');
    }

    const updated = await this.outfitRepo.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return updated!;
  }

  async deleteOutfit(id: string, requestingUserId?: string, requestingUserRole?: string): Promise<boolean> {
    const existing = await this.getOutfitById(id);

    if (requestingUserRole !== 'admin' && existing.ownerId && existing.ownerId !== requestingUserId) {
      throw new ForbiddenError('You can only delete outfits listed by your boutique.');
    }

    return this.outfitRepo.delete(id);
  }

  async checkAvailability(outfitId: string, dayNumbers: number[]): Promise<{ available: boolean; conflictingDates: number[] }> {
    const outfit = await this.getOutfitById(outfitId);
    const conflicting = dayNumbers.filter((d) => outfit.bookedDates.includes(d));
    return {
      available: conflicting.length === 0,
      conflictingDates: conflicting
    };
  }
}

export const outfitService = new OutfitService();
