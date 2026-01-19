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
Oc-Billed/
├── index.html
├── src/
│   ├── App.js
│   ├── api/
│   │   ├── api.js
│   │   ├── entity.js
│   │   └── store.js
│   ├── components/
│   │   ├── bills/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── error/
│   ├── middleware/
│   │   ├── router.js
│   │   ├── routes.js
│   │   └── path.js
│   ├── utils/
│   └── data/
├── styles/
├── public/
├── test/
└── dist/
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
- **Node.js** ≥ 18
- **npm**

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
npm test
```

---

## Getting started

### Installation

```bash
git clone https://github.com/Steinshy/Oc-Billed.git
cd Oc-Billed
npm install
```

### Development

```bash
npm run dev
```

---

## Available scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start the frontend       |
| `npm run dev:all` | Start frontend + backend |
| `npm run build`   | Production build         |
| `npm run preview` | Preview build            |
| `npm test`        | Run tests                |
| `npm run lint`    | Run linter               |

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
