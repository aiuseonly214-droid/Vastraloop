export type UserRole = 'customer' | 'owner' | 'admin';

export type RentalStatus =
  | 'confirmed'
  | 'ready_for_pickup'
  | 'in_use'
  | 'return_pending'
  | 'inspection'
  | 'deposit_refunded'
  | 'completed'
  | 'cancelled';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  warning?: string;
}

export interface UserEntity {
  id: string;
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  salt: string;
  city: string;
  address: string;
  verifiedId: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  verifiedId: boolean;
  role: UserRole;
  createdAt: string;
}

export interface OutfitItemEntity {
  id: string;
  title: string;
  boutique: string;
  boutiqueAddress: string;
  boutiquePhone: string;
  location: string;
  pricePerDay: number;
  deposit: number;
  rating: number;
  reviewsCount: number;
  size: string;
  availableSizes: string[];
  fabric: string;
  fit: string;
  cancellationPolicy: string;
  deliveryOptions: string;
  images: string[];
  category: 'Sherwani' | 'Lehenga' | 'Tuxedo' | 'Saree' | 'Indo-Western' | 'Kurta' | 'Gown';
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  occasion: 'Wedding' | 'Festivals' | 'Party Wear' | 'Reception' | 'Sangeet' | 'Traditional';
  isBoutiqueVerified: boolean;
  description: string;
  bookedDates: number[]; // Day numbers in current month (e.g. [6, 7, 21, 22])
  available: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrderEntity {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  outfitId: string;
  outfitTitle: string;
  outfitImage: string;
  boutique: string;
  boutiqueAddress: string;
  boutiquePhone: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  fulfillmentType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  pickupLocation?: string;
  paymentMethod: 'upi' | 'card' | 'cash';
  rentalFee: number;
  depositFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  inspectionNotes?: string;
  depositRefundAmount?: number;
  damageReported?: boolean;
}

export interface DamageClaimEntity {
  id: string;
  orderNumber: string;
  orderId: string;
  itemTitle: string;
  reportedBy: string;
  reportedById: string;
  issueType: 'Stain' | 'Tear / Rip' | 'Missing Accessory' | 'Late Return';
  claimedAmount: number;
  status: 'Pending Admin Review' | 'Approved' | 'Rejected' | 'Adjusted';
  evidenceDescription: string;
  evidenceImage?: string;
  resolutionNotes?: string;
  adjustedAmount?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface BoutiquePartnerEntity {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  verificationType: string;
  isVerified: boolean;
  totalEarnings: number;
  bankAccountSummary: string;
  ownerUserId: string;
}

export interface PayoutRecord {
  id: string;
  boutiqueId: string;
  orderNumber: string;
  outfitTitle: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending Escrow';
}
