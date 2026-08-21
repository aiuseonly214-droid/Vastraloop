# Security Architecture & Policies

## 1. Authentication & JWT Handling
- Passwords are encrypted using salted SHA-256 / PBKDF2 hashing before storage.
- JWT tokens are issued upon valid credentials verification with standard expiry (`7d`).
- Sensitive attributes (`passwordHash`, private keys) are stripped from all user serialization transforms.

## 2. Authorization & RBAC
- Role verification middleware (`requireRole('owner', 'admin')`) prevents unauthorized access.
- Object-level authorization: Orders and profile mutations verify that the requesting user's identity matches `customerId` or `boutique` owner identity.

## 3. Rate Limiting & DDoS Prevention
- Sliding window in-memory rate limiter applied to all `/api/v1/*` routes (e.g. 100 requests per 15 minutes per IP).
- Stricter limits applied to auth endpoints (`/auth/login`, `/auth/register`) to prevent credential stuffing.

## 4. Input Sanitization & Injection Prevention
- All request parameters, body attributes, and query strings are sanitized to prevent NoSQL/SQL injection and XSS.
- Strict payload validators reject undeclared unexpected properties.

## 5. Security Headers & CORS
- Configured CORS policy restricted to approved origins.
- Standard security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.

## 6. Secrets Management
- All secrets (`JWT_SECRET`, `GEMINI_API_KEY`, `PORT`) are loaded via environment variables (`.env`).
- Never committed into source control. Sample template provided in `.env.example`.
