# Changelog

All notable changes to the Vastraloop backend are documented here.

## [2026-08-21]

### Added
- Created complete persistent AI documentation and context system under `/docs`.
- Established backend architecture blueprint with clean layered separation of concerns.
- Implemented modular backend in TypeScript / Express (`backend/src/`):
  - Configuration (`env.ts`, `logger.ts`)
  - Operational error hierarchy (`appError.ts`) & standard response envelopes (`response.ts`)
  - Security & cryptography utilities (`crypto.ts` for PBKDF2 hashing and HMAC-SHA256 JWT)
  - Middlewares (`auth.ts`, `rbac.ts`, `validate.ts`, `rateLimiter.ts`, `errorHandler.ts`)
  - Domain models & repositories (`userRepository`, `outfitRepository`, `orderRepository`, `claimRepository`, `boutiqueRepository`)
  - Core services (`authService`, `outfitService`, `orderService`, `claimService`, `boutiqueService`, `geminiService`)
  - Controllers & routes mounted under `/api/v1` (`/auth`, `/outfits`, `/orders`, `/claims`, `/boutiques`, `/ai`, `/health`)
  - App & server entrypoint with graceful shutdown (`app.ts`, `server.ts`)
- Implemented full automated test runner with unit and end-to-end integration tests (14/14 tests passing).
- Created typed frontend API client layer (`src/services/api.ts`) and configured Vite reverse proxy.
- Created practical developer `README.md`.
