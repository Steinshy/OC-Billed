# 🧾 OC-Billed

<p align="center"><img src="./Mockup.png" alt="Billed Application Mockup" width="700" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);"></p>

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

**OC-Billed** is a web expense management application,
developed as part of the **OpenClassrooms Frontend Developer** curriculum.

It allows employees to submit their expense reports
and administrators to view and manage them via a dedicated interface.

---

## Quick overview

- Employee / administrator authentication
- Creation and tracking of expense reports
- Upload of receipts (images)
- Administrator dashboard
- API error handling (404 / 500)
- Framework-free SPA application

---

## GitHub repository

- [Main branch](https://github.com/Steinshy/Oc-Billed)

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
- Secure login
- Viewing expense reports
- Creating an expense report
- Uploading receipt (jpg, jpeg, png)
- Viewing receipt (modal)

### Administrator
- Access to global dashboard
- Viewing all expense reports

---

## Accessibility

- Full keyboard navigation
- Semantic HTML structure
- Clear error messages
- Accessible modals
- WCAG best practices compliance

---

## Tests

- Unit and integration tests with **Jest**
- Mock store and localStorage
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

| Command           | Description             |
| ----------------- | ----------------------- |
| `npm run dev`     | Runs the frontend       |
| `npm run dev:all` | Runs frontend + backend |
| `npm run build`   | Production build        |
| `npm run preview` | Preview                 |
| `npm test`        | Runs tests              |
| `npm run lint`    | Lints the project       |

---

## Configuration

- JWT storage via `localStorage`
- Role-based protected routes
- Centralized API calls via `store.js`

---

## Compatibility

- Modern browsers (Chrome, Firefox, Edge)
- Node.js ≥ 18

---

## License

Project developed as part of the
**OpenClassrooms Frontend Developer** curriculum.

© 2025 — OC-Billed
