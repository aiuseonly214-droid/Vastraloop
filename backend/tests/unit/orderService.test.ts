import { OrderService } from '../../src/services/orderService';
import { OrderRepository } from '../../src/repositories/orderRepository';
import { OutfitRepository } from '../../src/repositories/outfitRepository';
import { UserRepository } from '../../src/repositories/userRepository';

export async function runOrderUnitTests(): Promise<{ name: string; passed: boolean; error?: any }[]> {
  const results: { name: string; passed: boolean; error?: any }[] = [];

  const orderRepo = new OrderRepository();
  const outfitRepo = new OutfitRepository();
  const userRepo = new UserRepository();
  const service = new OrderService(orderRepo, outfitRepo, userRepo);

  // Test 1: Pricing curve (1-day, 2-day bundle discount, 3-day extended)
  try {
    const fee1 = service.calculateRentalFee(1500, 1);
    const fee2 = service.calculateRentalFee(1500, 2);
    const fee3 = service.calculateRentalFee(1500, 3);

    // 1-day = 1500
    // 2-day = round(1500 * 2 * 0.93) = 2790
    // 3-day = round(1500 * 3 * 0.90) = 4050
    if (fee1 === 1500 && fee2 === 2790 && fee3 === 4050) {
      results.push({ name: 'PRD Multi-Day Rental Discount Equation', passed: true });
    } else {
      results.push({
        name: 'PRD Multi-Day Rental Discount Equation',
        passed: false,
        error: `Expected 1500/2790/4050, got ${fee1}/${fee2}/${fee3}`
      });
    }
  } catch (err) {
    results.push({ name: 'PRD Multi-Day Rental Discount Equation', passed: false, error: err });
  }

  // Test 2: Order booking and timeline creation
  try {
    const customer = (await userRepo.findAll())[0];
    const outfit = (await outfitRepo.findAll())[0];

    const order = await service.createOrder(customer.id, {
      outfitId: outfit.id,
      durationDays: 2,
      startDate: '28 Aug',
      endDate: '29 Aug',
      fulfillmentType: 'delivery',
      deliveryAddress: '15, College Road, Nashik - 422005',
      paymentMethod: 'upi'
    });

    const expectedRent = service.calculateRentalFee(outfit.pricePerDay, 2);
    const expectedDelivery = 150;
    const expectedDeposit = outfit.deposit;
    const expectedTotal = expectedRent + expectedDeposit + expectedDelivery;

    if (
      order.totalAmount === expectedTotal &&
      order.rentalFee === expectedRent &&
      order.deliveryFee === 150 &&
      order.timeline.length === 5 &&
      order.status === 'ready_for_pickup'
    ) {
      results.push({ name: 'Order Creation, Escrow Calculation & 5-Step Timeline', passed: true });
    } else {
      results.push({
        name: 'Order Creation, Escrow Calculation & 5-Step Timeline',
        passed: false,
        error: `Calculated total ${order.totalAmount} != expected ${expectedTotal}`
      });
    }
  } catch (err) {
    results.push({ name: 'Order Creation, Escrow Calculation & 5-Step Timeline', passed: false, error: err });
  }

  // Test 3: Rental state machine status transitions
  try {
    const orders = await orderRepo.findAll();
    const testOrder = orders[0];

    // Transition to in_use
    const updated1 = await service.updateOrderStatus(testOrder.id, 'in_use', 'Handed over to renter at boutique');
    // Transition to completed
    const updated2 = await service.updateOrderStatus(testOrder.id, 'completed', 'Inspection passed with 0 defects');

    if (updated1.status === 'in_use' && updated2.status === 'completed' && updated2.depositRefundAmount === updated2.depositFee) {
      results.push({ name: 'Rental Lifecycle State Transitions & Deposit Release', passed: true });
    } else {
      results.push({
        name: 'Rental Lifecycle State Transitions & Deposit Release',
        passed: false,
        error: 'State transition mismatch'
      });
    }
  } catch (err) {
    results.push({ name: 'Rental Lifecycle State Transitions & Deposit Release', passed: false, error: err });
  }

  return results;
}
