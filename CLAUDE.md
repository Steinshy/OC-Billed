# Billed — Full-Stack Expense & Bill Management System

**Type:** Full-Stack Application (Frontend SPA + Express API)

---

## 🎯 Project Overview

Billed is an OpenClassrooms learning project demonstrating:
- Full-stack JavaScript development (ES modules in the frontend, CommonJS in the backend)
- Testing patterns (Jest + Testing Library for frontend, Supertest for API)
- Authentication (JWT + bcrypt)
- RESTful API design
- Database integration (SQLite + Sequelize ORM)
- Debugging & troubleshooting real-world code

### Key Objectives
- Understand debugging techniques in large codebases
- Write robust unit and integration tests
- Handle file uploads (Multer) with image-type filtering
- Implement JWT authentication flows

---

## 🏗️ Architecture Overview

```
Billed/
├── Frontend/            # SPA - Vanilla JS, no framework
├── Backend/             # Express API server
├── deliverables/        # Project submissions & documentation
├── pnpm-workspace.yaml  # pnpm workspace: Backend + Frontend
└── .github/workflows/   # CI (lint + test on push/PR to main)
```

### Frontend Architecture
- **Type:** Single Page Application (SPA)
- **Routing:** Custom router in `src/app/Router.js` (no React Router); employee/admin pages use hash routes, login is at `/`
- **State Management:** No global state container; `src/app/Store.js` is a fetch-based API client
- **Testing:** Jest + Testing Library (unit and integration; no e2e tests in the repo)
- **Styling:** Bootstrap 4.0.0 (CDN in `index.html`) + custom CSS

```
Frontend/src/
├── app/
│   ├── App.js           # Bootstrap & SPA initialization
│   ├── Router.js        # Custom client-side router
│   ├── Store.js         # API client (fetch wrapper, Bearer token)
│   ├── datepicker.js    # Datepicker setup
│   └── format.js        # Date formatting (French locale)
├── containers/          # Logic components: Bills, Dashboard, Login, Logout, NewBill
├── views/               # Template functions (dumb components)
├── constants/           # routes.js (ROUTES_PATH, ROUTES), usersTest.js
├── css/                 # Component scoped styles
├── assets/              # SVG icon modules & images
├── fixtures/            # Sample bill data
├── __mocks__/           # Jest mocks (store, localStorage, styleMock)
└── __tests__/           # Test files
```

### Backend Architecture
- **Type:** RESTful API
- **Framework:** Express.js v5 (`^5.2.1`)
- **Authentication:** JWT middleware + bcrypt
- **Database:** SQLite + Sequelize ORM (v6)
- **File Uploads:** Multer (stores to `Backend/public/`, random names without extension)
- **Security:** Helmet, CORS (`cors()` defaults), bill fields whitelisted in the controller; no validation library

```
Backend/
├── server.js            # Entry point: DB check, seedDatabase(), listen on PORT (default 5678)
├── app.js               # Express app: middleware chain and routers
├── routes/              # auth.js, user.js, bill.js
├── controllers/         # auth.js, user.js, bill.js
├── middlewares/         # auth.js (JWT decoding into req.user)
├── models/              # index.js (Sequelize init), user.js, bill.js
├── migrations/          # create-user, create-bill (Users, Bills tables)
├── services/            # jwt.js, password.js (+ *.test.js)
├── config/config.json   # Sequelize config per NODE_ENV (SQLite)
├── seed.js              # Demo users & bills; clearDatabase / seedDatabase
├── setupTests.js       # Jest setup: reset fixtures before each test, close DB after
├── tests/               # app, auth, bill, user tests + fixtures.js
└── public/              # Uploaded files (gitignored)
```

---

## 🚀 Development Setup

### Prerequisites
- Node.js 22 (used by CI and READMEs; root `engines` says `>=20`)
- pnpm 10 (`packageManager`: `pnpm@10.33.0`)
- SQLite via the `sqlite3` npm package (no separate server)

### Installation
```bash
# Install all dependencies (pnpm workspace, uses pnpm-lock.yaml)
pnpm install

# Run both services concurrently
pnpm dev

# Frontend: http://127.0.0.1:8080 (live-server)
# Backend: http://localhost:5678 (Express)
```

### Scripts
```bash
pnpm dev               # Start both frontend + backend (concurrently)
pnpm dev:frontend      # Frontend only (live-server)
pnpm dev:backend       # Backend only: sequelize-cli db:migrate, then node server.js
pnpm test              # Run Frontend + Backend tests (coverage: Frontend only)
pnpm lint              # ESLint in both packages
pnpm lint:fix          # Auto-fix ESLint issues
pnpm seed              # Migrate, then reset and seed demo data (Backend)
```

---

## 🗄️ Database

**ORM:** Sequelize (v6)
**Database:** SQLite; `Backend/database_dev.sqlite` (development), `Backend/database_test.sqlite` (test), `database_prod.sqlite` (production config)

### Models
- **User** – name, email, type (`Admin` / `Employee`), password (bcrypt hash), status (`connected` / `disconnected`), key (public short-uuid id)
- **Bill** – name, type (category, e.g. "Transports"), date, amount, vat, pct, commentary, commentAdmin, status (seed values: `pending`, `accepted`, `refused`), email, fileName, filePath, key

### Migrations
Located in `Backend/migrations/` (create `Users`, create `Bills`); run by `sequelize-cli db:migrate` in the `dev`, `seed` and `test` scripts, not by `server.js`.

### Seeding
```bash
pnpm seed   # root script: runs sequelize-cli db:migrate, then Backend/seed.js
```
`seed.js` clears `Users` and `Bills` before inserting demo data; `server.js` also calls `seedDatabase()` on every start, so local data is reset at each server start.

---

## 🧪 Testing

### Frontend Testing
- **Framework:** Jest (root devDependency) + Testing Library, jsdom environment
- **Coverage:** Unit + integration tests (`--coverage` is set in the Frontend `test` script)
- **Run:** `pnpm test` (from root) or `pnpm --filter billed-frontend test`
- **Path aliases:** `@app/`, `@views/`, etc. (mapped in `Frontend/jest.config.cjs` only; source uses relative imports)

**Key Test Areas:**
- Component rendering
- User interactions (form submission, button clicks)
- Navigation (Router state changes)
- API integration

### Backend Testing
- **Framework:** Jest (root devDependency) + Supertest
- **Coverage:** API routes (`tests/`) and services (`services/*.test.js`); no coverage flag in the Backend `test` script
- **Run:** `pnpm test` (from root) or `pnpm --filter billed-backend test` (migrates the test DB, then runs `jest -i`)

**Key Test Areas:**
- Authentication (401 for unauthenticated requests, JWT validation)
- Authorization (Admin vs. non-admin access)
- CRUD operations
- Error handling

---

## 🔐 Authentication

### Flow
1. User logs in with email/password (`Frontend/src/containers/Login.js` calls `Store.login`)
2. `POST /auth/login` compares the password with `bcrypt.compare` against the stored hash and sets `status` to `connected`
3. Server responds `201` with `{ jwt }`; the token is signed with `services/jwt.js` and expires after 1 hour
4. Frontend stores the token in `localStorage` under `jwt` (the user object is stored under `user`)
5. Subsequent requests include token in `Authorization: Bearer <token>` header (set in `Store.js`)
6. `middlewares/auth.js` verifies signature + expiration; an invalid token returns `401`, a missing header leaves `req.user` unset, and each controller rejects requests without `req.user`
7. `PATCH /auth/logout` sets `status` to `disconnected`, but the frontend `Logout` container only clears `localStorage` and never calls the API

### Key Files
- `Backend/services/jwt.js` – Token creation/verification (secret is hardcoded as `a-secret-word`)
- `Backend/middlewares/auth.js` – JWT decoding; sets `req.user` (does not guard routes by itself)
- `Frontend/src/containers/Login.js` – Login flow

---

## 📤 File Uploads

- **Handler:** Multer, applied globally in `Backend/app.js` (`upload.single("file")`)
- **Storage:** Local filesystem (`Backend/public/`)
- **Endpoint:** `POST /bills` (includes file as multipart/form-data)
- **Security:** Only `image/jpeg`, `image/jpg`, `image/png` and `image/gif` are recorded on the bill (`fileName`/`filePath`); other uploads stay on disk unreferenced; no size limit is configured

---

## 🔍 Notable Patterns

### Custom Router
Frontend implements custom routing without React Router. `Router.js` exports a default async function (no Router class); `ROUTES_PATH` in `constants/routes.js` maps Login `/`, Bills `#employee/bills`, NewBill `#employee/bill/new` and Dashboard `#admin/dashboard`:
```javascript
// Frontend/src/app/Router.js (excerpt)
window.onNavigate = pathname => {
  window.history.pushState({}, pathname, window.location.origin + pathname);
```

### Store Pattern
`Store.js` exports one `Store` instance wrapping a fetch-based `Api` (base URL `http://localhost:5678`); there is no global user or bills state:
```javascript
// Frontend/src/app/Store.js (excerpt)
login = (data) =>
  this.api.post({ url: "/auth/login", data, headers: getHeaders({ noAuthorization: true }) });
```

### Middleware Chain (Backend)
Order in `Backend/app.js`:
```
cors() → helmet() → express.json() → static /public → GET /
→ authMiddleware (every request, sets req.user) → multer upload.single("file") (every request)
→ /auth, /users, /bills routers (each controller checks req.user)
```

---

## 📚 Dependencies

### Frontend
- `bootstrap` – Not an npm dependency; Bootstrap 4.0.0 is loaded from CDN in `index.html`
- `jquery` – devDependency for tests; the browser loads jQuery 3.2.1 (slim) from CDN for modals and click handlers
- `jest` (root devDependency), `jest-environment-jsdom`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event` – Testing
- `live-server` – Dev server; `stylelint` – CSS linting

### Backend
- `express` – Web framework
- `sequelize` – ORM
- `sqlite3` – Database driver
- `bcrypt` – Password hashing
- `jsonwebtoken` – JWT tokens
- `multer` – File uploads
- `helmet` – Security headers
- `cors` – Cross-origin requests
- `short-uuid` – Public `key` ids on models
- Dev: `sequelize-cli`, `sequelize-fixtures`, `supertest`

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5678 already in use | Set the `PORT` env var (read in `Backend/server.js`); `Frontend/src/app/Store.js` hardcodes `http://localhost:5678`, so update it too |
| SQLite locked error | Stop other processes, delete `Backend/database_dev.sqlite` (migrations recreate it on next `pnpm dev`) |
| JWT token expired | Tokens last 1 hour; log in again (login replaces the stored `jwt`) |
| CORS errors | `app.use(cors())` with defaults in `Backend/app.js` allows any origin; confirm the API is up on port 5678 |

---

## 📖 Key Files to Understand

- `Frontend/src/app/App.js` – SPA bootstrap
- `Frontend/src/app/Store.js` – API client
- `Backend/server.js` – Server entry point
- `Backend/app.js` – Express middleware chain
- `Backend/middlewares/auth.js` – JWT decoding into `req.user`
- `Backend/models/` – Database models

---

## 💡 Quick Reference

| What | Where |
|------|-------|
| Add new API endpoint | `Backend/routes/` + `Backend/controllers/` |
| Add new page/route | `Frontend/src/containers/` + `Frontend/src/views/` + `Frontend/src/constants/routes.js` + `Frontend/src/app/Router.js` |
| Run tests | `pnpm test` (from root) |
| Debug backend | Add a `debugger` statement, then run `node --inspect server.js` in `Backend/` (the `dev:backend` script passes no inspector flag) |
| Database schema | `Backend/migrations/` + Sequelize models in `Backend/models/` |
| Styling | Bootstrap 4 classes (CDN) + `Frontend/src/css/` custom styles |
