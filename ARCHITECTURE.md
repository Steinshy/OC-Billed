# Architecture

Billed is an expense-report application split into two packages inside a pnpm workspace.

```
┌──────────────────────────┐         ┌───────────────────────────────┐
│  Frontend (port 8080)    │  fetch  │  Backend (port 5678)          │
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

## Frontend (`Frontend/`, ES modules)

A single `index.html` contains every page's markup shell; the app swaps rendered HTML into the DOM.

```
index.html → src/app/App.js → src/app/Router.js → views/* (HTML strings)
                                   │
                                   └─► containers/* (event handlers, API calls)
                                            │
                                            └─► src/app/Store.js → Backend API
```

- **`app/Router.js`** — hash-based routing over `constants/routes.js` (`#employee/bills`, `#admin/dashboard`…). Renders the matching view then instantiates its container.
- **Views** (`src/views/`) — pure functions returning HTML strings (`BillsUI`, `NewBillUI`, `DashboardUI`, `LoginUI`, error/loading pages). All interactive elements carry `data-testid` attributes used by both containers and tests.
- **Containers** (`src/containers/`) — classes wiring DOM events to behavior: `Login`, `Bills` (list + receipt modal), `NewBill` (file validation jpg/jpeg/png + create/update), `Dashboard` (admin), `Logout`.
- **`app/Store.js`** — thin fetch client (`Api`/`ApiEntity`) exposing `bills()`/`users()`/`login()`. Reads the JWT from localStorage and sends it as a Bearer header. Base URL is hardcoded to `http://localhost:5678`.
- **Auth state** — the logged-in user (`user`) and token (`jwt`) live in localStorage; `Logout` clears it.
- **Tests** (`src/__tests__/`) — jest + jsdom + Testing Library. The API is mocked via `src/__mocks__/store.js`; shared helpers/fixtures in `src/__mocks__/` and `src/fixtures/`. Coverage and an HTML report are generated on `pnpm test`.

## Tooling

- **pnpm workspace** — `pnpm-workspace.yaml` lists `Backend` and `Frontend`; one root `pnpm-lock.yaml`. Shared dev tooling (eslint + plugins, jest, @swc/jest, prettier, concurrently) is hoisted to the root `package.json`; package-specific tools stay in each package (sequelize-cli/supertest in Backend, testing-library/live-server/stylelint in Frontend). Native build scripts are allowlisted via `onlyBuiltDependencies`.
- **CI** — GitHub Actions (`.github/workflows/ci.yml`): two jobs (frontend, backend) on Node 22, `pnpm install --frozen-lockfile`, then lint + tests per package. Dependabot watches the npm ecosystem (root, covers the workspace) and GitHub Actions weekly.
- **Quality** — ESLint 9 flat configs per package (import, jsdoc, security, sonarjs, unicorn plugins), Prettier, Stylelint for the frontend CSS.
