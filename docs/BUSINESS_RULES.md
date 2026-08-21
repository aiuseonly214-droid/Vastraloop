# Business Rules

Domain and business logic enforced by the backend service layer:

---

### BR-001: Multi-Day Pricing & Discount Structure
- Day 1 rental price = Base `pricePerDay`.
- Day 2 rental price = `round(pricePerDay * 2 * 0.93)` (7% 2-day bundle discount).
- Day 3+ rental price = `round(pricePerDay * durationDays * 0.90)` (10% extended rental discount).

### BR-002: Security Deposit Escrow & Refund Rules
- Every rental requires a 100% refundable security deposit as set on the outfit model (e.g. ₹1,500 - ₹5,000).
- The deposit is held in escrow upon booking confirmation (`confirmed`).
- Deposits can **only** be released when:
  1. The boutique completes inspection with zero damages (`deposit_refunded` / `completed`).
  2. Or after an admin adjudicates a filed damage claim.
- The refund amount equals `depositFee - approvedDamageAmount`.

### BR-003: Fulfillment Pricing & Address Validation
- `fulfillmentType: 'pickup'` has a delivery fee of **₹0** (Free Store Pickup in Nashik).
- `fulfillmentType: 'delivery'` has a flat delivery fee of **₹150** within the Nashik municipal region.
- When `delivery` is selected, a valid delivery address is mandatory.

### BR-004: Date Conflict & Overlap Prevention
- An outfit cannot be booked for overlapping dates with existing confirmed or in-use orders.
- Outfit calendar day reservations must be validated at order creation.

### BR-005: Dispute & Damage Claim Authority
- Only registered boutique owners can report a damage claim against an order.
- A damage claim can only be filed when the order is in `in_use`, `return_pending`, or `inspection` status.
- The maximum claim amount cannot exceed the order's `depositFee`.
- Only `admin` role users have the authority to approve, reject, or adjust damage claims and release the net deposit.

### BR-006: Role Permission Isolation
- `customer`: Can view public outfits, create bookings, view their own orders, cancel uncollected bookings, update their own profile.
- `owner`: Can add/update their own outfit listings, view shop orders for their boutique, trigger handover to customer (`in_use`), and file damage claims.
- `admin`: Can view all platform orders, inspect escrow balances, verify boutique providers, and resolve disputes.

### BR-007: Return Deadline Policy
- Outfits must be returned to the boutique by 10:00 AM following the rental end date.
