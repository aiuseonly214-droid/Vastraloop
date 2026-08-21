# Testing Strategy

## 1. Test Levels

### Unit Tests
- **Rental Calculation Unit Tests:** Multi-day discount algorithms, delivery fee addition, deposit math.
- **Rental State Machine Tests:** Legal vs. illegal status transitions.
- **Authentication & Crypto Tests:** Password hashing, verification, token encoding/decoding.
- **Validation Engine Tests:** Sanitization and payload constraints.

### Integration / API Tests
- `POST /api/v1/auth/login` and `GET /api/v1/auth/me` with JWT Bearer header.
- `GET /api/v1/outfits` with query filters (category, maxPrice, verified).
- `POST /api/v1/orders` end-to-end rental creation.
- `PATCH /api/v1/orders/:id/status` lifecycle state transition.
- `POST /api/v1/claims` and `PATCH /api/v1/claims/:id/resolve` dispute workflow.
- `GET /api/v1/health` system health check.

## 2. Test Execution Commands
- Run backend automated test runner:
  ```bash
  npm run test:backend
  ```
- Run unit test suite:
  ```bash
  npx tsx backend/tests/runAllTests.ts
  ```
