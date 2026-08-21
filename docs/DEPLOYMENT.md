# Deployment & Operational Guide

## 1. Environment Configuration

The backend reads configuration from environment variables:

| Variable | Description | Default (Dev) |
| :--- | :--- | :--- |
| `PORT` | HTTP Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | Secret key for signing session tokens | `vastraloop-secret-key-production-change-me` |
| `GEMINI_API_KEY` | Google Gemini AI API key | Injected by runtime or `.env` |
| `APP_URL` | Base application URL | `http://localhost:3000` |
| `CORS_ORIGIN` | Allowed client origins | `*` |

## 2. Local Development Commands

- Start backend development server:
  ```bash
  npm run server
  ```
- Start frontend Vite dev server:
  ```bash
  npm run dev
  ```
- Run backend automated tests:
  ```bash
  npm run test:backend
  ```

## 3. Health & Monitoring
- Health check route at `GET /api/v1/health` provides real-time system status and uptime metrics.
