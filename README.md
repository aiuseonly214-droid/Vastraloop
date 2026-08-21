# Vastraloop — Occasion Wear Rental Marketplace (Nashik)

Production backend and web application for fancy, festival, and wedding occasion wear rentals in Nashik, Maharashtra.

---

## 🌟 Tech Stack

- **Backend:** Node.js (v26), Express (v4.21), TypeScript / ESM (`tsx`)
- **Frontend:** React 19, Tailwind CSS v4, Lucide React
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Architecture:** Layered Clean Architecture (`routes -> middlewares -> controllers -> services -> repositories -> models`)

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

Key environment variables:
- `PORT`: Express server port (default: `5000`)
- `JWT_SECRET`: Secret key for JWT session signing
- `GEMINI_API_KEY`: Google Gemini API key for server-side styling and damage estimation

---

## 🛠️ Running Locally

### Start Backend API Server
```bash
npm run server
```
- API Base: `http://localhost:5000/api/v1`
- Health Check: `http://localhost:5000/api/v1/health`

### Start Frontend Dev Server
```bash
npm run dev
```
- Frontend Web App: `http://localhost:3000`

---

## 🧪 Automated Testing

Run the full backend test suite (unit + end-to-end integration):
```bash
npm run test:backend
```

---

## 📁 Architecture & Context Documentation

The persistent AI and developer documentation is maintained in `/docs`:
- `docs/CONTEXT.md` - System overview & memory
- `docs/REQUIREMENTS.md` - Structured PRD requirements
- `docs/ARCHITECTURE.md` - Layer separation & data flows
- `docs/API_CONTRACT.md` - Full `/api/v1` RESTful endpoint specifications
- `docs/DATABASE.md` - Entities, schemas & indexes
- `docs/BUSINESS_RULES.md` - Multi-day pricing curves & deposit escrow rules
- `docs/SECURITY.md` - JWT, RBAC & sanitization policies
- `docs/ERROR_HANDLING.md` - Standard error codes & envelope
- `docs/TESTING.md` - Test strategy & suites
- `docs/MEMORY.md` - Compact AI developer checkpoint
