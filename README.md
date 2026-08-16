# SaloneBiz Frontend

This starter is intentionally auth-gated:
- The public landing/auth page can open.
- Private workspace is hidden until `/api/auth/login` or `/api/auth/register` succeeds.
- API health uses `GET /api/health`.
- Login uses `POST /api/auth/login`.
- Register uses `POST /api/auth/register`.
- Register includes `phone` because the current database requires it.
- User session is stored in browser sessionStorage for this starter.

## Setup
Edit `config.js` and replace `https://YOUR-BACKEND.onrender.com` with your real Render backend URL.
Then host the folder as a static website.
Do not put PostgreSQL credentials or other server secrets in frontend code.
