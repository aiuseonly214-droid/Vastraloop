# Validation Rules & Schemas

## 1. Input Validation Rules

### User Registration / Login
- `email`: Valid email format, normalized lowercase.
- `phone`: Required, valid Indian phone format (e.g. `+91 98220 41234` or 10 digits).
- `password`: Minimum 6 characters.
- `role`: Enum `['customer', 'owner', 'admin']`.

### Outfit Listing
- `title`: String, min 3, max 120 characters.
- `pricePerDay`: Positive integer >= 100.
- `deposit`: Non-negative integer.
- `category`: Enum `['Sherwani', 'Lehenga', 'Tuxedo', 'Saree', 'Indo-Western', 'Kurta', 'Gown']`.
- `gender`: Enum `['Men', 'Women', 'Kids', 'Unisex']`.
- `occasion`: Enum `['Wedding', 'Festivals', 'Party Wear', 'Reception', 'Sangeet', 'Traditional']`.
- `size`: Required string (e.g., `'S'`, `'M'`, `'L'`, `'XL'`, `'Free Size'`).
- `images`: Array of valid image URLs, min 1 image.

### Order Booking
- `outfitId`: Required string referencing existing outfit.
- `durationDays`: Integer between 1 and 30.
- `startDate` & `endDate`: Valid date string format.
- `fulfillmentType`: Enum `['delivery', 'pickup']`.
- `deliveryAddress`: Required if `fulfillmentType === 'delivery'`, min 10 characters.
- `paymentMethod`: Enum `['upi', 'card', 'cash']`.

### Damage Claim
- `orderNumber`: Required string referencing existing order.
- `issueType`: Enum `['Stain', 'Tear / Rip', 'Missing Accessory', 'Late Return']`.
- `claimedAmount`: Positive integer <= `order.depositFee`.
- `evidenceDescription`: String, min 10 characters.

## 2. Server-side Validation Layer
Validation is enforced via the `validateRequest` middleware which evaluates request body, params, and query strings prior to invoking controllers.
