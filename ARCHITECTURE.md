# Architecture

Billed is an expense-report application: a vanilla JS SPA at the repo root and an Express API in `Backend/` (pnpm workspace). Releases ship the frontend alone with an in-browser demo store standing in for the API.

```
┌──────────────────────────┐         ┌───────────────────────────────┐
│  Frontend (root, :8080)  │  fetch  │  Backend (port 5678)          │
│  vanilla JS SPA          │ ──────► │  Express 5 + Sequelize        │
│  live-server (dev)       │  JWT    │  SQLite (dev/test files)      │
└──────────────────────────┘         └───────────────────────────────┘
```

## Backend (`Backend/`, CommonJS)

Request flow:

```
server.js → app.js → middlewares/auth.js → multer → routes/* → controllers/* → models/*
```

- **`server.js`** — entry point: authenticates the DB connection, seeds demo data, listens on `PORT` (default 5678).
- **`app.js`** — Express app: CORS, helmet (`crossOriginResourcePolicy: cross-origin` so the frontend can load uploaded images), JSON body parsing, static `/public` (uploaded receipts), then auth middleware and routers.
- **`middlewares/auth.js`** — if an `Authorization: Bearer <jwt>` header is present, verifies the token and attaches the matching `User` to `req.user`; invalid tokens get a 401. Requests without a header pass through, and each controller enforces `req.user` itself.
- **Routes** — `/auth` (login/logout), `/bills`, `/users` (CRUD). File upload is a global `multer` single-file middleware (`file` field) storing into `public/`.
- **Controllers** — authorization rules live here: Admins see all bills; employees only bills matching their email. Public objects expose the `key` (short-uuid) as `id`; the numeric DB id is internal. Non-picture uploads (only jpg/jpeg/png/gif mimetypes count) are stored with `fileName`/`filePath` set to `null`.
- **Models** (`models/`) — `User` (type: Admin/Employee, bcrypt-hashed password) and `Bill`; both get a generated `key` via short-uuid. Schema managed by `migrations/` (sequelize-cli), config in `config/config.json` (per-`NODE_ENV` SQLite files).
- **Services** — `services/jwt.js` (sign/verify, secret is hardcoded for this training project) and `services/password.js` (bcrypt hash/compare).
- **Tests** (`tests/`, `services/*.test.js`) — supertest integration tests against the real test DB; `setupTests.js` resets fixtures (`tests/fixtures.js`, via sequelize-fixtures) before each test and closes the DB connection afterwards so jest exits.

## Frontend (repo root: `index.html` + `src/`, ES modules)

A single `index.html` contains every page's markup shell; the app swaps rendered HTML into the DOM.

```
index.html → src/app/App.js → src/app/Router.js → views/* (HTML strings)
                                   │
                                   └─► containers/* (event handlers, API calls)
                                            │
                                            └─► src/store/Store.js → Backend API
                                                    or src/store/DemoStore.js (USE_DEMO)
```

- **`app/Router.js`** — hash-based routing over `constants/routes.js` (`#employee/bills`, `#admin/dashboard`…). Renders the matching view then instantiates its container.
- **Views** (`src/views/`) — pure functions returning HTML strings (`BillsUI`, `NewBillUI`, `DashboardUI`, `LoginUI`, error/loading pages). All interactive elements carry `data-testid` attributes used by both containers and tests.
- **Icons** — Lucide 1.59.0 from unpkg (pinned, SRI hash) next to the Bootstrap/jQuery CDN scripts; it defines the global `lucide`, and views build SVG markup with `lucide.createElement(...).outerHTML`. Jest gets the same global from the `lucide` devDependency (`tests/setup.cjs`).
- **Containers** (`src/containers/`) — classes wiring DOM events to behavior: `Login`, `Bills` (list + receipt modal), `NewBill` (file validation jpg/jpeg/png + create/update), `Dashboard` (admin), `Logout`.
- **`store/Store.js`** — thin fetch client (`Api`/`ApiEntity`) exposing `bills()`/`users()`/`login()`. Reads the JWT from localStorage and sends it as a Bearer header. Base URL is hardcoded to `http://localhost:5678`. Exports `DemoStore` instead when `USE_DEMO` (`src/store/config.js`) is true.
- **`store/DemoStore.js`** — release-only stand-in for the API with the same surface, routes, response shapes and error messages as `Backend/controllers`. Seeded from `Backend/seed.js` (two demo accounts, six bills); data lives in `sessionStorage` because `Logout` clears localStorage. Receipts are stored as data URLs.
- **Base path** — `Router.js` resolves URLs against the directory the app is served from, so it works at `/` and under `/OC-Billed/` on GitHub Pages.
- **Auth state** — the logged-in user (`user`) and token (`jwt`) live in localStorage; `Logout` clears it.
- **Tests** (`tests/`, outside `src/`) — jest + jsdom + Testing Library. The API is mocked via `tests/mocks/store.js`; shared helpers and fixture data live in `tests/mocks/`. Coverage (of `src/`) and an HTML report are generated on `pnpm test`.

## Tooling

- **pnpm workspace** — the root package is the frontend; `pnpm-workspace.yaml` lists `Backend`. One root `pnpm-lock.yaml`; dev tooling lives in the root `package.json`, backend-only tools (sequelize-cli, sequelize-fixtures, supertest) in `Backend/`. pnpm 11 reviews install scripts through `allowBuilds`.
- **Quality** — one root ESLint flat config for `src/` and `Backend/` (import-x, security, sonarjs, unicorn plugins; `import-x/order` is an error), Stylelint for `src/css/`, Prettier for all formatting; `pnpm lint` runs all three.
- **Demo switch** — `src/store/config.js` sets `USE_DEMO` at runtime: on for any host other than localhost/127.0.0.1, or locally with `?demo` (kept in sessionStorage). Releases ship the source files as-is; there is no build step.
- **CI** — `.github/workflows/ci.yml` (Node 24): frozen install, `pnpm lint`, `pnpm test`, non-blocking `pnpm audit --prod`. `.github/workflows/deploy.yml` publishes `index.html` + `src/` to GitHub Pages on push to `main`.
- **Coolify** — the `Dockerfile` copies `index.html` + `src/` (`.dockerignore` whitelist) into nginx (inline config, gzip, security headers, healthcheck); it is Coolify-only and not built in CI.
