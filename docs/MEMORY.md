# PROJECT MEMORY

## Current State
- Current backend status: Production-Ready & Tested (14/14 automated tests passing)
- Current module: All core modules completed (Auth, Outfits, Orders, Claims, Boutiques, AI Styling, Health)
- Current implementation phase: Completed & Verified

## Completed
- AI Context Documentation System (`/docs`)
- Configuration, Structured Logger, AppError Hierarchy, Response Envelopes
- Middlewares: Auth JWT, RBAC, Validation Engine, Sliding Rate Limiter, Centralized Error Handler
- Domain Models & Types, Seed Data for Nashik Boutiques, Outfits, Users, Orders, Claims
- Repositories: UserRepository, OutfitRepository, OrderRepository, ClaimRepository, BoutiqueRepository
- Services: AuthService, OutfitService, OrderService, ClaimService, BoutiqueService, GeminiService
- Controllers & Routes: Auth, Outfits, Orders, Claims, Boutiques, AI, Health Check mounted under `/api/v1`
- Express App & Server Bootstrap with Graceful Shutdown
- Automated Unit & End-to-End Integration Test Suite (100% pass)
- Frontend API Client (`src/services/api.ts`) & Vite Proxy Configuration

## In Progress
- Ready for deployment or feature expansion

## Important Decisions
- DEC-001: Modular TypeScript/Express with layered separation
- DEC-002: Repository pattern with in-memory store + persistent JSON storage
- DEC-003: Stateless JWT authentication + Role & Object-level Authorization
- DEC-004: 5-Stage strict rental state machine with escrow deposit guard
- DEC-005: Standardized API response format and centralized AppError hierarchy

## Important Constraints
- Node.js ESM + `tsx` runtime for zero-transpile execution
- API base path: `/api/v1`
- Security deposit 100% refundable rule, held in escrow until boutique inspection / dispute adjudication
- Nashik local fulfillment options: Store pickup (₹0) vs. Home delivery (₹150)

## Known Issues
- None

## Next Actions
- Production deployment or client extensions

## Important Files
- `backend/src/app.ts`: Express application setup
- `backend/src/server.ts`: Server entrypoint
- `backend/tests/runAllTests.ts`: Automated test runner
- `src/services/api.ts`: Typed frontend API client
- `docs/API_CONTRACT.md`: API specifications
