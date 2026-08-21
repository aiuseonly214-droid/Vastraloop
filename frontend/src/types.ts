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

export interface OutfitItem {
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
  bookedDates: number[]; // Day numbers in current month (e.g. [6, 7, 18, 19])
  available: boolean;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
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
  timeline: TimelineEvent[];
  customerName: string;
  customerPhone: string;
  inspectionNotes?: string;
  depositRefundAmount?: number;
  damageReported?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  verifiedId: boolean;
  role: 'customer' | 'owner' | 'admin';
}

export interface DamageClaim {
  id: string;
  orderNumber: string;
  itemTitle: string;
  reportedBy: string;
  issueType: 'Stain' | 'Tear / Rip' | 'Missing Accessory' | 'Late Return';
  claimedAmount: number;
  status: 'Pending Admin Review' | 'Approved' | 'Rejected' | 'Adjusted';
  evidenceDescription: string;
  evidenceImage?: string;
  createdAt: string;
}
