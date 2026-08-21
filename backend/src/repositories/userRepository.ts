import { InMemoryRepository } from './baseRepository';
import { UserEntity, UserProfileResponse } from '../models/types';
import { SEED_USERS } from '../data/seedData';

export class UserRepository extends InMemoryRepository<UserEntity> {
  constructor() {
    super(SEED_USERS);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalized = email.trim().toLowerCase();
    const users = await this.findAll((u) => u.email.toLowerCase() === normalized);
    return users.length > 0 ? users[0] : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const cleanPhone = phone.replace(/\s+/g, '');
    const users = await this.findAll((u) => u.phone.replace(/\s+/g, '') === cleanPhone);
    return users.length > 0 ? users[0] : null;
  }

  toProfileResponse(user: UserEntity): UserProfileResponse {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      city: user.city,
      address: user.address,
      verifiedId: user.verifiedId,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const userRepository = new UserRepository();
