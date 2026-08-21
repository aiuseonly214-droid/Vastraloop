# API Contract (`/api/v1`)

All endpoints return a standardized JSON envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## 1. Authentication & Profile

### `POST /api/v1/auth/register`
- **Auth:** Public
- **Request:** `{ "name": "string", "phone": "string", "email": "string", "password": "string", "role": "customer"|"owner" }`
- **Response (201):** `{ "token": "jwt_token", "user": UserProfile }`

### `POST /api/v1/auth/login`
- **Auth:** Public
- **Request:** `{ "email": "string", "password": "string" }` or `{ "phone": "string", "password": "string" }`
- **Response (200):** `{ "token": "jwt_token", "user": UserProfile }`

### `GET /api/v1/auth/me`
- **Auth:** Bearer Token
- **Response (200):** `{ "user": UserProfile }`

### `PUT /api/v1/auth/profile`
- **Auth:** Bearer Token
- **Request:** `{ "name": "string", "city": "string", "address": "string" }`
- **Response (200):** `{ "user": UserProfile }`

### `POST /api/v1/auth/verify-id`
- **Auth:** Bearer Token
- **Request:** `{ "aadhaarNumber": "string", "otp": "string" }`
- **Response (200):** `{ "verifiedId": true, "message": "ID successfully verified via Aadhaar OTP" }`

---

## 2. Outfit Catalog & Inventory

### `GET /api/v1/outfits`
- **Auth:** Public / Optional
- **Query Params:** `search`, `category`, `gender`, `occasion`, `size`, `maxPrice`, `verifiedOnly`, `location`
- **Response (200):** `[ OutfitItem ]`

### `GET /api/v1/outfits/:id`
- **Auth:** Public
- **Response (200):** `OutfitItem`

### `POST /api/v1/outfits`
- **Auth:** Bearer Token (Role: `owner` | `admin`)
- **Request:** Full Outfit creation payload
- **Response (201):** Created `OutfitItem`

### `PUT /api/v1/outfits/:id`
- **Auth:** Bearer Token (Role: `owner` | `admin`)
- **Request:** Partial/Full Outfit update payload
- **Response (200):** Updated `OutfitItem`

### `DELETE /api/v1/outfits/:id`
- **Auth:** Bearer Token (Role: `owner` | `admin`)
- **Response (200):** `{ "message": "Outfit removed from listings" }`

---

## 3. Rental Orders & Lifecycle

### `POST /api/v1/orders`
- **Auth:** Bearer Token (Role: `customer` | `owner` | `admin`)
- **Request:**
  ```json
  {
    "outfitId": "outfit-1",
    "durationDays": 2,
    "startDate": "24 Aug",
    "endDate": "26 Aug",
    "fulfillmentType": "pickup" | "delivery",
    "deliveryAddress": "optional string",
    "paymentMethod": "upi" | "card" | "cash"
  }
  ```
- **Response (201):** `RentalOrder` with calculated rental fee, deposit fee, delivery fee, total, and initialized 5-step timeline.

### `GET /api/v1/orders`
- **Auth:** Bearer Token
- **Query Params:** `filter=all|active|completed`
- **Response (200):** `[ RentalOrder ]`

### `GET /api/v1/orders/:id`
- **Auth:** Bearer Token
- **Response (200):** `RentalOrder`

### `PATCH /api/v1/orders/:id/status`
- **Auth:** Bearer Token (Role: `owner` | `admin` | `customer`)
- **Request:** `{ "status": RentalStatus, "note": "optional string" }`
- **Response (200):** Updated `RentalOrder` with updated timeline events and deposit refund calculation if completed.

---

## 4. Damage Claims & Disputes

### `POST /api/v1/claims`
- **Auth:** Bearer Token (Role: `owner` | `admin`)
- **Request:**
  ```json
  {
    "orderNumber": "#VL-8821",
    "itemTitle": "Royal Navy Silk Sherwani",
    "issueType": "Stain" | "Tear / Rip" | "Missing Accessory" | "Late Return",
    "claimedAmount": 500,
    "evidenceDescription": "Detailed notes on fabric condition"
  }
  ```
- **Response (201):** `DamageClaim` (status: `Pending Admin Review`)

### `GET /api/v1/claims`
- **Auth:** Bearer Token (Role: `admin` | `owner`)
- **Response (200):** `[ DamageClaim ]`

### `PATCH /api/v1/claims/:id/resolve`
- **Auth:** Bearer Token (Role: `admin`)
- **Request:** `{ "status": "Approved" | "Rejected" | "Adjusted", "resolutionNotes": "string", "adjustedAmount": 400 }`
- **Response (200):** Resolved `DamageClaim`

---

## 5. Boutiques & Payouts

### `GET /api/v1/boutiques`
- **Auth:** Public
- **Response (200):** `[ BoutiquePartner ]`

### `GET /api/v1/boutiques/:id/payouts`
- **Auth:** Bearer Token (Role: `owner` | `admin`)
- **Response (200):** `{ "totalEarnings": 14850, "payouts": [...] }`

---

## 6. AI Features (Gemini)

### `POST /api/v1/ai/recommend`
- **Auth:** Public / Optional
- **Request:** `{ "occasion": "Wedding", "gender": "Men", "budget": 2000, "stylePreference": "Regal Silk" }`
- **Response (200):** `{ "recommendations": [ ... ], "stylingAdvice": "string" }`

### `POST /api/v1/ai/damage-assessment`
- **Auth:** Bearer Token (Role: `owner` | `admin`)
- **Request:** `{ "issueType": "Stain", "description": "Beverage spill on raw silk cuff", "depositAmount": 3000 }`
- **Response (200):** `{ "estimatedCleaningCost": 450, "recommendedDeduction": 450, "reasoning": "..." }`

---

## 7. Health Check

### `GET /api/v1/health`
- **Auth:** Public
- **Response (200):** `{ "status": "healthy", "timestamp": "...", "version": "1.0.0" }`
