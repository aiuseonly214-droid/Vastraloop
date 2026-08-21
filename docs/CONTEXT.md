# Vastraloop - System Context

## 1. Project Overview
- **Project Name:** Vastraloop
- **Project Purpose:** Premium Web & Mobile Occasion Wear Rental Marketplace for Nashik, Maharashtra.
- **Target Users:**
  1. **Customers (Renters):** Rent high-end designer sherwanis, bridal/party lehengas, tuxedos, and sarees for weddings, sangeet, receptions, and festivals instead of buying single-use expensive outfits.
  2. **Boutique Owners / Lenders:** Local Nashik designer boutiques and high-end closet owners listing occasion wear to earn recurring rental revenue.
  3. **Admin Operations:** Platform administrators managing boutique verifications, security deposit escrows, and damage dispute resolution.

## 2. Core Modules
- **Authentication & KYC:** Role-based access control (`customer`, `owner`, `admin`), Government ID/Aadhaar verification badges.
- **Outfit Catalog & Inventory:** Rich filtering (Category, Occasion, Gender, Size, Rental Price, Boutique Verification), booked dates calendar availability.
- **Rental Order Lifecycle:** Booking calculation, fulfillment (Store Pickup in Nashik vs. Home Delivery), 5-stage rental lifecycle tracking.
- **Security Deposit Escrow & Dispute Management:** 100% refundable deposit escrow, boutique damage/stain claims, admin adjudication.
- **Partner Hub & Payouts:** Boutique inventory management, handover logs, payout transaction history.
- **Server-side AI Styling & Damage Assessment:** Gemini AI occasion styling advisor and damage assessment assistant.

## 3. Technology Stack
- **Runtime:** Node.js (v26.7.0) with TypeScript / ESM (`tsx` runtime)
- **Framework:** Express.js (v4.21.2)
- **Frontend:** React 19, Tailwind CSS v4, Lucide React, Google Fonts (Playfair Display, Inter, Material Symbols)
- **AI Integration:** `@google/genai` (Gemini API server-side)
- **Architecture:** Layered Clean Architecture (Routes -> Middlewares -> Controllers -> Services -> Repositories -> Data Store)

## 4. Current Status & Phase
- **Phase:** Production Backend Development & AI Context Architecture Setup
- **Status:** Architecture defined, context documentation established, implementation plan ready for execution.
