# 🧾 OC-Billed

<p align="center"><img src="./Mockup.png" alt="Billed Application Mockup" width="700" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);"></p>


<p align="center">
  <a href="README.md">🇫🇷 Français</a> · 🇬🇧 English
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS-Modules-1572B6?style=flat&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-Testing-C21325?style=flat&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-9.39.2-4B32C3?style=flat&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Prettier-3.7.4-F7B93E?style=flat&logo=prettier&logoColor=white" />
  <img src="https://img.shields.io/badge/Stylelint-16.26.1-263238?style=flat&logo=stylelint&logoColor=white" />
  <img src="https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=flat&logo=jquery&logoColor=white" />
  <img src="https://img.shields.io/badge/Live--Server-Dev-green?style=flat&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenClassrooms-Project-blue" />
</p>

**OC-Billed** is a web application for managing employee expense reports,
developed as part of the **OpenClassrooms Frontend Developer program**.

It allows employees to submit their expense reports and administrators
to review and manage them through a dedicated interface.

---

## Quick overview

- Employee / administrator authentication
- Expense report creation and tracking
- Receipt upload (images)
- Administrator dashboard
- API error handling (404 / 500)
- Framework-free SPA architecture

---

## GitHub repository

- [Development branch](https://github.com/Steinshy/Oc-Billed/tree/dev)

---

## Project structure

```text
OC-Billed/                  # pnpm workspace
├── package.json            # Root scripts (dev, test, lint…)
├── pnpm-workspace.yaml
├── Backend/                # Express + Sequelize (SQLite) API
│   ├── server.js           # Entry point (port 5678)
│   ├── app.js              # Express application
│   ├── controllers/        # auth, bill, user
│   ├── routes/             # /auth, /bills, /users
│   ├── middlewares/        # JWT authentication
│   ├── models/             # Sequelize models (User, Bill)
│   ├── migrations/         # Database migrations
│   ├── services/           # jwt, password (bcrypt)
│   └── tests/              # Integration tests (supertest)
└── Frontend/               # Framework-free JavaScript SPA
    ├── index.html
    └── src/
        ├── app/            # Router, Store (API client), format
        ├── containers/     # Logic: Bills, NewBill, Login, Dashboard…
        ├── views/          # Page HTML rendering
        ├── constants/      # Routes, test users
        └── __tests__/      # Jest + Testing Library tests
```

---

## Technologies

### Frontend
- **JavaScript ES6+** — Framework‑free SPA
- **Semantic HTML5**
- **Modular CSS**

### Tooling & Quality
- **Jest** + **Testing Library** — unit & integration tests
- **ESLint** — JavaScript linting
- **Prettier** — code formatting
- **Stylelint** — CSS linting
- **Live Server** — development server

### Environment
- **Node.js** ≥ 22
- **pnpm** ≥ 10

---

## Main features

### Employee
- Secure authentication
- View expense reports
- Create a new expense report
- Upload receipts (jpg, jpeg, png)
- Receipt preview (modal)

### Administrator
- Access to the global dashboard
- View all expense reports

---

## Accessibility

- Full keyboard navigation
- Semantic HTML structure
- Clear error messages
- Accessible modals
- WCAG best practices respected

---

## Tests

- Unit and integration tests with **Jest**
- Mocked API store and `localStorage`
- Router and component tests

```bash
pnpm test
```

---

## Getting started

### Installation

```bash
git clone https://github.com/Steinshy/Oc-Billed.git
cd Oc-Billed
pnpm install
```

### Development

```bash
pnpm seed   # first run: migrations + demo data
pnpm dev    # start backend (5678) + frontend (live-server)
```

---

## Available scripts (root)

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `pnpm dev`          | Backend + frontend in parallel |
| `pnpm dev:backend`  | Backend only (port 5678)       |
| `pnpm dev:frontend` | Frontend only (live-server)    |
| `pnpm seed`         | Migrations + demo data         |
| `pnpm test`         | Test both packages             |
| `pnpm lint`         | Lint both packages             |
| `pnpm format`       | Format with Prettier           |

---

## Configuration

- JWT stored in `localStorage`
- Role-based protected routes
- Centralized API calls via `store.js`

---

## Compatibility

- Modern browsers (Chrome, Firefox, Edge)
- Node.js >= 18

---

## License

Project completed as part of the
**OpenClassrooms Frontend Developer program**.

© 2025 — OC-Billed
