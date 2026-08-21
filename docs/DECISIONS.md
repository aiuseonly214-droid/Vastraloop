# Architecture Decision Log (ADR)

---

### DEC-001: Modular TypeScript / Express Architecture with Layered Separation
- **Decision:** Build the backend in Express.js with TypeScript and explicit layered separation (`routes -> middlewares -> controllers -> services -> repositories -> data/models`).
- **Why:** Delivers strict type safety across domain models, prevents mixing business logic in controllers, and conforms cleanly with existing TypeScript tooling in the workspace.
- **Alternatives Considered:** Plain JavaScript with loose objects (rejected: prone to runtime regressions in complex rental calculations).
- **Impact:** Modular code structure where services and repositories can be tested independently.
- **Date:** 2026-08-21

---

### DEC-002: Repository Pattern with Zero-Dependency In-Memory Store & JSON Disk Sync
- **Decision:** Implement a clean repository interface with fast in-memory indexing backed by persistent JSON storage.
- **Why:** Enables instant, zero-setup developer execution and CI verification without requiring external PostgreSQL/MongoDB daemon installations, while allowing 1-line plug-in of Mongo/Postgres drivers later.
- **Alternatives Considered:** Forcing local PostgreSQL or MongoDB docker container (rejected: causes setup blockers for local evaluations).
- **Impact:** Immediate reproducibility, high throughput, zero latency overhead.
- **Date:** 2026-08-21

---

### DEC-003: JWT Authentication with Role-Based & Object-Level Access Control (RBAC)
- **Decision:** Use stateless Bearer JWTs signed with HMAC-SHA256 containing `userId`, `email`, and `role`. Combine with explicit object-level checks so users cannot modify foreign orders.
- **Why:** Ensures seamless scalability across mobile and web clients without session store overhead.
- **Alternatives Considered:** Stateful express sessions with cookies (rejected: less compatible with mobile apps and cross-origin clients).
- **Impact:** Secure endpoint protection with strict privilege separation (`customer`, `owner`, `admin`).
- **Date:** 2026-08-21

---

### DEC-004: 5-Stage Explicit State Machine for Rental Lifecycle
- **Decision:** Enforce a strict state transition flow (`confirmed` -> `ready_for_pickup` -> `in_use` -> `return_pending` / `inspection` -> `deposit_refunded` / `completed`).
- **Why:** Guarantees that security deposit refunds cannot be released prior to boutique inspection or dispute adjudication, fulfilling PRD Section 9 & 10.
- **Alternatives Considered:** Loose status updates without guard validation (rejected: violates financial escrow integrity).
- **Impact:** Prevents illegal state jumps and generates predictable timeline events.
- **Date:** 2026-08-21

---

### DEC-005: Standardized API Response & Centralized AppError Envelope
- **Decision:** Wrap all responses in `{ success: boolean, message: string, data?: any, errors?: any }` with a centralized error middleware.
- **Why:** Guarantees frontend client consistency and prevents sensitive stack traces from leaking to clients.
- **Impact:** Predictable UI error handling across checkout, order tracking, and claim disputes.
- **Date:** 2026-08-21
