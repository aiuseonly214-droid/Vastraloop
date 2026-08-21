# Technical Architecture

## 1. System Overview

```
Frontend (React 19 / Vite / Tailwind)
   │
   │  HTTPS / JSON / Bearer JWT
   ▼
Express Web Server (Node.js 26)
   │
   ├─► Global Middleware Pipeline
   │     ├─ Security Headers & CORS
   │     ├─ Sliding Rate Limiter
   │     ├─ Request Logger (Structured)
   │     └─ Body Parser
   │
   ├─► API Router (/api/v1/*)
   │     ├─ /auth       -> AuthController       -> AuthService       -> UserRepository
   │     ├─ /outfits    -> OutfitController     -> OutfitService     -> OutfitRepository
   │     ├─ /orders     -> OrderController      -> OrderService      -> OrderRepository
   │     ├─ /claims     -> ClaimController      -> ClaimService      -> ClaimRepository
   │     ├─ /boutiques  -> BoutiqueController   -> BoutiqueService   -> BoutiqueRepository
   │     ├─ /ai         -> AIController         -> GeminiService     -> Google Gemini API
   │     └─ /health     -> Health Check
   │
   ├─► Error Handling Middleware (Centralized AppError catch & formatting)
   │
   └─► Data Persistence Layer (In-memory cache with JSON disk persistence & Repository Abstraction)
```

## 2. Request Data Flow

```text
HTTP Request
   ↓
Route Definition (URL + HTTP Verb + Middleware Chain)
   ↓
Auth / RBAC Middleware (Extracts JWT & Checks Permissions)
   ↓
Validation Middleware (Sanitizes & Validates Request Body/Query/Params)
   ↓
Controller (Parses Request, Invokes Service, Returns Standard Response)
   ↓
Service Layer (Executes Business Logic, Validates Domain Rules, State Machine)
   ↓
Repository Layer (Encapsulates Data Access, Filtering, Sorting, Persistence)
   ↓
Data Store (In-Memory Indexed Collections + Persistent Storage)
```

## 3. Layer Separation of Concerns
- **Routes:** Map HTTP verb + path to middlewares and controller actions. No business logic.
- **Middlewares:** Authentication, Authorization, Validation, Rate Limiting, Error Handling.
- **Controllers:** HTTP request parsing, status code assignment, service delegation, standard response serialization.
- **Services:** Pure business rules, pricing equations, rental state transitions, dispute escrow reconciliation, external AI calls.
- **Repositories:** Abstract database queries, CRUD operations, indexing, and data isolation.
- **Models/Types:** Schema contracts, types, interfaces, and constraints.
