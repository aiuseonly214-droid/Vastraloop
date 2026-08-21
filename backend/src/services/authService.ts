import { userRepository, UserRepository } from '../repositories/userRepository';
import { UserEntity, UserProfileResponse, UserRole } from '../models/types';
import { hashPassword, verifyPassword, generateToken } from '../utils/crypto';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/appError';
import { ERROR_CODES } from '../constants/statusCodes';

export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  city?: string;
  address?: string;
}

export interface LoginDto {
  emailOrPhone: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: UserProfileResponse;
}

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingEmail = await this.userRepo.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictError('A user with this email address already exists.', ERROR_CODES.CONFLICT);
    }

    const existingPhone = await this.userRepo.findByPhone(dto.phone);
    if (existingPhone) {
      throw new ConflictError('A user with this phone number already exists.', ERROR_CODES.CONFLICT);
    }

    const { hash, salt } = hashPassword(dto.password);
    const now = new Date().toISOString();

    const newUser: UserEntity = {
      id: `user-${Date.now()}`,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      passwordHash: hash,
      salt: salt,
      city: dto.city || 'Nashik, Maharashtra',
      address: dto.address || 'Nashik, Maharashtra',
      verifiedId: false,
      role: dto.role || 'customer',
      createdAt: now,
      updatedAt: now,
    };

    const saved = await this.userRepo.create(newUser);
    const token = generateToken({
      userId: saved.id,
      email: saved.email,
      role: saved.role,
      name: saved.name
    });

    return {
      token,
      user: this.userRepo.toProfileResponse(saved)
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const identifier = dto.emailOrPhone.trim();
    let user: UserEntity | null = null;

    if (identifier.includes('@')) {
      user = await this.userRepo.findByEmail(identifier);
    } else {
      user = await this.userRepo.findByPhone(identifier);
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email/phone or password.', ERROR_CODES.INVALID_CREDENTIALS);
    }

    const isMatch = verifyPassword(dto.password, user.passwordHash, user.salt);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email/phone or password.', ERROR_CODES.INVALID_CREDENTIALS);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return {
      token,
      user: this.userRepo.toProfileResponse(user)
    };
  }

  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found.', ERROR_CODES.NOT_FOUND);
    }
    return this.userRepo.toProfileResponse(user);
  }

  async updateProfile(userId: string, updates: { name?: string; city?: string; address?: string; role?: UserRole }): Promise<UserProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found.', ERROR_CODES.NOT_FOUND);
    }

    const updated = await this.userRepo.update(userId, {
      ...(updates.name ? { name: updates.name.trim() } : {}),
      ...(updates.city ? { city: updates.city.trim() } : {}),
      ...(updates.address ? { address: updates.address.trim() } : {}),
      ...(updates.role ? { role: updates.role } : {}),
      updatedAt: new Date().toISOString()
    });

    return this.userRepo.toProfileResponse(updated!);
  }

  async verifyAadhaarId(userId: string, aadhaarNumber: string, otp: string): Promise<UserProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found.');
    }

    const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
    if (cleanAadhaar.length !== 12 || isNaN(Number(cleanAadhaar))) {
      throw new BadRequestError('Invalid Aadhaar number format. Must be 12 digits.');
    }

    if (!otp || otp.trim().length < 4) {
      throw new BadRequestError('Invalid Aadhaar OTP code.');
    }

    const updated = await this.userRepo.update(userId, {
      verifiedId: true,
      updatedAt: new Date().toISOString()
    });

    return this.userRepo.toProfileResponse(updated!);
  }
}

export const authService = new AuthService();
