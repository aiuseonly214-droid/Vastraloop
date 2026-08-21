import { orderRepository, OrderRepository } from '../repositories/orderRepository';
import { outfitRepository, OutfitRepository } from '../repositories/outfitRepository';
import { userRepository, UserRepository } from '../repositories/userRepository';
import { boutiqueRepository, BoutiqueRepository } from '../repositories/boutiqueRepository';
import { RentalOrderEntity, RentalStatus, TimelineEvent } from '../models/types';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/appError';
import { ERROR_CODES } from '../constants/statusCodes';

export interface CreateOrderDto {
  outfitId: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  fulfillmentType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  paymentMethod: 'upi' | 'card' | 'cash';
}

export class OrderService {
  constructor(
    private orderRepo: OrderRepository = orderRepository,
    private outfitRepo: OutfitRepository = outfitRepository,
    private userRepo: UserRepository = userRepository,
    private boutiqueRepo: BoutiqueRepository = boutiqueRepository
  ) {}

  /**
   * Calculate rental fee according to PRD multi-day discount curve
   */
  calculateRentalFee(pricePerDay: number, durationDays: number): number {
    if (durationDays <= 1) return pricePerDay;
    if (durationDays === 2) return Math.round(pricePerDay * 2 * 0.93);
    return Math.round(pricePerDay * durationDays * 0.9);
  }

  async createOrder(customerId: string, dto: CreateOrderDto): Promise<RentalOrderEntity> {
    const user = await this.userRepo.findById(customerId);
    if (!user) {
      throw new NotFoundError('Customer user not found.');
    }

    const outfit = await this.outfitRepo.findById(dto.outfitId);
    if (!outfit) {
      throw new NotFoundError(`Outfit with id '${dto.outfitId}' not found.`);
    }

    if (!outfit.available) {
      throw new BadRequestError('This outfit is currently unavailable for rental.');
    }

    if (dto.durationDays < 1 || dto.durationDays > 30) {
      throw new BadRequestError('Rental duration must be between 1 and 30 days.');
    }

    // --- FIX 2: Validate Date Spans vs Duration ---
    const parsedStart = new Date(dto.startDate + ' 2026'); // Assume current year if not provided
    const parsedEnd = new Date(dto.endDate + ' 2026');
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      throw new BadRequestError('Invalid start or end date format.');
    }

    // Calculate absolute difference in days
    const diffTime = Math.abs(parsedEnd.getTime() - parsedStart.getTime());
    const actualDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start and end day
    
    if (actualDays !== dto.durationDays) {
      throw new BadRequestError(`Requested duration (${dto.durationDays} days) does not match the date span from ${dto.startDate} to ${dto.endDate} (${actualDays} days).`);
    }

    // --- FIX 1: Prevent Double-Booking ---
    // Generate the array of day numbers (e.g. 24, 25, 26)
    const dayNumbers: number[] = [];
    const currentDate = new Date(parsedStart);
    for (let i = 0; i < actualDays; i++) {
      dayNumbers.push(currentDate.getDate());
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Lock dates in outfit repository
    await this.outfitRepo.addReservedDates(outfit.id, dayNumbers);

    if (dto.fulfillmentType === 'delivery' && (!dto.deliveryAddress || dto.deliveryAddress.trim().length < 5)) {
      throw new BadRequestError('A valid delivery address in Nashik is required for home delivery.');
    }

    const rentalFee = this.calculateRentalFee(outfit.pricePerDay, dto.durationDays);
    const depositFee = outfit.deposit;
    const deliveryFee = dto.fulfillmentType === 'delivery' ? 150 : 0;
    const totalAmount = rentalFee + depositFee + deliveryFee;

    const now = new Date();
    const orderNumber = `#VL-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeString = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    const timeline: TimelineEvent[] = [
      {
        id: 't-1',
        title: 'Order Confirmed',
        timestamp: timeString,
        description: `Payment of ₹${totalAmount.toLocaleString('en-IN')} received via ${dto.paymentMethod.toUpperCase()}. Deposit of ₹${depositFee.toLocaleString('en-IN')} held safely in escrow.`,
        status: 'completed'
      },
      {
        id: 't-2',
        title: dto.fulfillmentType === 'delivery' ? 'Dispatching to Address' : 'Ready for Pickup',
        timestamp: 'Active Now',
        description:
          dto.fulfillmentType === 'delivery'
            ? `Delivery partner assigned. Outfit will arrive at ${dto.deliveryAddress} before your rental start date.`
            : `Collect your items at ${outfit.boutique}, Nashik branch before 8:00 PM today.`,
        warning: 'Please bring a valid photo ID matching the name on your order.',
        status: 'current'
      },
      {
        id: 't-3',
        title: 'In Use',
        timestamp: 'Pending handover',
        description: 'Enjoy your special occasion in style.',
        status: 'upcoming'
      },
      {
        id: 't-4',
        title: 'Return Pending',
        timestamp: `Due by ${dto.endDate}, 10:00 AM`,
        description: `Return the outfit to ${outfit.boutique} for quality inspection.`,
        status: 'upcoming'
      },
      {
        id: 't-5',
        title: 'Deposit Refunded',
        timestamp: 'After inspection',
        description: `₹${depositFee.toLocaleString('en-IN')} refundable security deposit will be transferred automatically to your UPI account.`,
        status: 'upcoming'
      }
    ];

    const newOrder: RentalOrderEntity = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      outfitId: outfit.id,
      outfitTitle: outfit.title,
      outfitImage: outfit.images[0] || '',
      boutique: outfit.boutique,
      boutiqueAddress: outfit.boutiqueAddress,
      boutiquePhone: outfit.boutiquePhone,
      durationDays: dto.durationDays,
      startDate: dto.startDate,
      endDate: dto.endDate,
      fulfillmentType: dto.fulfillmentType,
      deliveryAddress: dto.fulfillmentType === 'delivery' ? dto.deliveryAddress : undefined,
      pickupLocation: `${outfit.boutique}, Nashik branch`,
      paymentMethod: dto.paymentMethod,
      rentalFee,
      depositFee,
      deliveryFee,
      totalAmount,
      status: 'ready_for_pickup',
      createdAt: timeString,
      updatedAt: now.toISOString(),
      timeline,
      depositRefundAmount: depositFee,
      damageReported: false
    };

    return this.orderRepo.create(newOrder);
  }

  async getOrderById(orderId: string, requestingUserId?: string, requestingUserRole?: string): Promise<RentalOrderEntity> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Rental order '${orderId}' not found.`, ERROR_CODES.NOT_FOUND);
    }

    if (
      requestingUserRole &&
      requestingUserRole === 'customer' &&
      requestingUserId &&
      order.customerId !== requestingUserId
    ) {
      throw new ForbiddenError('You can only view your own rental orders.');
    }

    return order;
  }

  async listCustomerOrders(
    customerId: string,
    filter?: 'all' | 'active' | 'completed'
  ): Promise<RentalOrderEntity[]> {
    return this.orderRepo.findByCustomerId(customerId, filter);
  }

  async listAllOrders(filter?: 'all' | 'active' | 'completed'): Promise<RentalOrderEntity[]> {
    return this.orderRepo.findAll();
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: RentalStatus,
    note?: string,
    requestingUserId?: string,
    requestingUserRole?: string
  ): Promise<RentalOrderEntity> {
    const order = await this.getOrderById(orderId, requestingUserId, requestingUserRole);

    const now = new Date();
    const timeString = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    // Update timeline stages
    const updatedTimeline = order.timeline.map((event) => {
      if (newStatus === 'in_use' && event.id === 't-3') {
        return { ...event, status: 'current' as const, timestamp: timeString };
      }
      if ((newStatus === 'return_pending' || newStatus === 'inspection') && event.id === 't-4') {
        return { ...event, status: 'current' as const, timestamp: timeString };
      }
      if ((newStatus === 'deposit_refunded' || newStatus === 'completed') && event.id === 't-5') {
        return { ...event, status: 'completed' as const, timestamp: timeString };
      }
      return event;
    });

    const updates: Partial<RentalOrderEntity> = {
      status: newStatus,
      timeline: updatedTimeline,
      updatedAt: now.toISOString(),
    };

    if (note) {
      updates.inspectionNotes = note;
    }

    if (newStatus === 'deposit_refunded' || newStatus === 'completed') {
      updates.depositRefundAmount = order.depositRefundAmount || order.depositFee;
    }

    const updated = await this.orderRepo.update(orderId, updates);

    // --- FIX 3: Trigger Boutique Payout on Completion ---
    if (newStatus === 'completed') {
      const outfit = await this.outfitRepo.findById(order.outfitId);
      if (outfit && outfit.ownerId) {
        const boutique = await this.boutiqueRepo.findByOwnerUserId(outfit.ownerId);
        if (boutique) {
          await this.boutiqueRepo.addPayout({
            id: `payout-${Date.now()}`,
            boutiqueId: boutique.id,
            orderNumber: order.orderNumber,
            outfitTitle: order.outfitTitle,
            amount: order.rentalFee,
            date: new Date().toISOString(),
            status: 'Completed'
          });
        }
      }
    }

    return updated!;
  }
}

export const orderService = new OrderService();
