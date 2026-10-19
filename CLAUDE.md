# Billed

OpenClassrooms expense-report app: vanilla JS SPA at the repo root (`index.html`, `src/`), Express 5 + Sequelize/SQLite API in `Backend/` (pnpm workspace). The course focus is debugging and testing.

Path-scoped rules live in `.claude/rules/` (frontend, backend, deployment). `ARCHITECTURE.md` owns structure and decisions.

## Commands

- `pnpm dev`: API on :5678 (migrated and reseeded at every start) + live-server on :8080.
- `pnpm test`: frontend Jest with coverage, then backend Jest + Supertest; one side: `pnpm exec jest <file>` or `pnpm --filter billed-backend test`.
- `pnpm lint`: ESLint (`src/` + `Backend/`) + Stylelint + `prettier --check`; `pnpm fix` auto-fixes all three, including import order.

## Run modes

- Local dev: `src/app/Store.js` calls the real API at `http://localhost:5678`.
- Releases (GitHub Pages, Coolify): no backend; `USE_DEMO` (`src/app/config.js`) is on outside localhost and `src/app/DemoStore.js` answers in-browser. Locally, `?demo` turns it on.
- Demo accounts: `employee@test.tld` / `employee`, `admin@test.tld` / `admin` (backend seed and demo store).

## Rules

- Node 24, pnpm 11; keep `engines`, `devEngines` and CI `node-version` on the same major.
- Prettier owns formatting (quotes, semicolons, commas, line width 100); ESLint only checks code quality.
- Never commit real secrets; the JWT secret in `Backend/services/jwt.js` is a training placeholder.
