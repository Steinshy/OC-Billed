---
paths:
  - "Backend/**/*"
---

# Backend

- Express 5 + Sequelize 6 on SQLite, CommonJS; layout: `server.js`, `app.js`, `routes/`, `controllers/`, `middlewares/`, `models/`, `migrations/`, `services/`.
- Middleware order: `cors()` → `helmet()` → `express.json()` → static `/public` → auth (sets `req.user`, never blocks) → multer `upload.single("file")` → routers; each controller rejects requests without `req.user`.
- Authorization lives in controllers: admins see every bill, employees only bills with their email; public objects expose `key` as `id`.
- Migrations run through `sequelize-cli` in the `dev`, `seed` and `test` scripts; `server.js` reseeds demo data at every start.
- Tests: `pnpm --filter billed-backend test` (Supertest against `database_test.sqlite`, fixtures reset before each test by `setupTests.js`).
- The backend is never deployed: releases use `src/app/DemoStore.js`. When changing routes, response shapes or error messages, update the demo store to match.
- API details: `Backend/README.md`.
