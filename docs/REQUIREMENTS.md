# Backend Requirements

Structured requirements derived from the PRD, Frontend behavior, and Architecture specifications.

| Requirement ID | Description | Source | Priority | Backend Impact | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-001** | User authentication with phone/email, password/OTP, and JWT session handling | PRD & Frontend | High | `authRoutes`, `authService`, `userRepository` | Pending |
| **REQ-002** | Role-based authorization (`customer`, `owner`, `admin`) with object-level permissions | PRD & Frontend | High | `rbac` middleware, object ownership checks | Pending |
| **REQ-003** | Government ID / Aadhaar verification badge management | PRD & Frontend | Medium | User model `verifiedId` flag, KYC verification endpoint | Pending |
| **REQ-004** | Outfit catalog browsing with multi-attribute filtering (Category, Occasion, Gender, Size, Max Price, Verified Boutique, Search query) | PRD & Frontend | High | `outfitRoutes`, `outfitService`, `outfitRepository` with indexed search filters | Pending |
| **REQ-005** | Real-time calendar availability checking and booked date conflict prevention | PRD & Frontend | High | Outfit booked dates array, date overlap validation | Pending |
| **REQ-006** | Boutique owner outfit listing management (Create, Update, Delete, Toggle Availability) | PRD & Frontend | High | `outfitRoutes` (owner guarded), validation schema | Pending |
| **REQ-007** | Rental order creation with calculated multi-day discount, delivery fee calculation, and refundable security deposit lock | PRD & Frontend | Critical | `orderRoutes`, `orderService`, price calculator engine | Pending |
| **REQ-008** | Complete 5-stage rental lifecycle tracking (`confirmed` -> `ready_for_pickup` -> `in_use` -> `return_pending` / `inspection` -> `deposit_refunded` / `completed`) | PRD & Frontend | Critical | Order state machine, timeline event generator | Pending |
| **REQ-009** | Damage & dispute reporting workflow for boutique owners (Stains, Tears, Missing accessories, Late fees) | PRD & Frontend | High | `claimRoutes`, `claimService`, evidence storage | Pending |
| **REQ-010** | Admin dispute resolution and security deposit escrow deduction/refund settlement | PRD & Frontend | High | Admin resolve claim endpoint, escrow ledger adjustment | Pending |
| **REQ-011** | Boutique owner partner hub (Shop orders, handover logs, payout transaction history) | PRD & Frontend | Medium | `boutiqueRoutes`, `boutiqueService`, payout calculation | Pending |
| **REQ-012** | Gemini AI server-side integration for occasion styling advice and damage claim assessment | PRD & `metadata.json` | Medium | `aiRoutes`, `geminiService` | Pending |
| **REQ-013** | Centralized structured error handling and standard API response envelope | Best Practice | High | `errorHandler` middleware, `AppError` classes | Pending |
| **REQ-014** | Input validation and sanitization on all untrusted API request payloads | Security Rule | High | Centralized `validator` middleware | Pending |
