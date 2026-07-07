# CLAUDE.md

Guidance for AI coding agents working in this repository.

## Project

Billed — an expense-report app (OpenClassrooms project). pnpm workspace with two packages:

- `Backend/` (`billed-backend`) — Express 5 + Sequelize (SQLite) REST API, CommonJS.
- `Frontend/` (`billed-frontend`) — framework-free JavaScript SPA, ES modules, served by live-server. jQuery/Bootstrap come from CDN in `index.html`.

See `ARCHITECTURE.md` for how the pieces fit together.

## Commands

Use **pnpm** (≥10) — never npm or yarn. There is a single lockfile at the root (`pnpm-lock.yaml`); shared dev tooling (eslint, jest, prettier…) lives in the root `package.json`.

From the repo root:

```bash
pnpm install               # install everything
pnpm dev                   # backend (port 5678) + frontend (port 8080)
pnpm seed                  # run migrations + seed demo data (first run)
pnpm test                  # test both packages
pnpm lint                  # lint both packages
pnpm --filter billed-backend test    # backend only
pnpm --filter billed-frontend test   # frontend only
```

Run a single frontend test file:

```bash
pnpm --filter billed-frontend exec jest src/__tests__/Bills.js
```

Backend tests need the test DB migrated first; the package `test` script does this automatically (`sequelize-cli db:migrate` under `NODE_ENV=test`).

## Conventions

- Backend is CommonJS (`require`), Frontend is ESM (`import`). Don't mix.
- Frontend containers (`src/containers/`) hold logic; views (`src/views/`) return HTML strings. Tests target `data-testid` attributes — keep them stable.
- Backend exposes bills/users by their `key` (short-uuid) as the public `id`; the numeric DB `id` never leaves the API.
- Frontend tests mock the store (`src/__mocks__/store.js`) and localStorage; backend tests are supertest integration tests over the real (SQLite) test DB, reset from `tests/fixtures.js` before each test.
- Lint configs: `eslint.config.js` per package (flat config); Prettier and Stylelint configured at package level.
- CI (`.github/workflows/ci.yml`) runs lint + tests for both packages on pushes/PRs to `main`. Keep it green.

## Gotchas

- pnpm's strict `node_modules`: undeclared transitive deps break. Fix with `packageExtensions` in `pnpm-workspace.yaml` (already done for `eslint-plugin-sonarjs` → `ts-api-utils`), not by installing stray deps.
- Native modules (`bcrypt`, `sqlite3`, `@swc/core`) must be allowed in `onlyBuiltDependencies` in `pnpm-workspace.yaml` or their build scripts are skipped.
- The frontend `Store` hardcodes `http://localhost:5678` as the API base URL; the backend port is `PORT` (default 5678).
- `Backend/database_dev.sqlite` / `database_test.sqlite` are gitignored local files — never commit them.
- Test coverage output (`Frontend/coverage/`, `test-report.html`) is generated — gitignored, never commit it.
