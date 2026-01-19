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

**OC-Billed** est une application web de gestion de notes de frais,  
développée dans le cadre du parcours **Développeur Frontend OpenClassrooms**.

Elle permet aux employés de soumettre leurs notes de frais  
et aux administrateurs de les consulter et de les gérer via une interface dédiée.

---

## Aperçu rapide

- Authentification employé / administrateur
- Création et suivi des notes de frais
- Upload de justificatifs (images)
- Tableau de bord administrateur
- Gestion des erreurs API (404 / 500)
- Application SPA sans framework

---

## Dépôt GitHub

- [Branche principale](https://github.com/Steinshy/Oc-Billed)

---

## Structure du projet

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
- **JavaScript ES6+** — SPA sans framework
- **HTML5 sémantique**
- **CSS modulaire**

### Outils & Qualité
- **Jest** + **Testing Library** — tests unitaires et d’intégration
- **ESLint** — lint JavaScript
- **Prettier** — formatage du code
- **Stylelint** — lint CSS
- **Live Server** — serveur de développement

### Environnement
- **Node.js** ≥ 18
- **npm**

---

## Fonctionnalités principales

### Employé
- Connexion sécurisée
- Consultation des notes de frais
- Création d’une note de frais
- Upload de justificatif (jpg, jpeg, png)
- Visualisation d’un justificatif (modale)

### Administrateur
- Accès au tableau de bord global
- Consultation de toutes les notes de frais

---

## Accessibilité

- Navigation clavier complète
- Structure HTML sémantique
- Messages d’erreur clairs
- Modales accessibles
- Respect des bonnes pratiques WCAG

---

## Tests

- Tests unitaires et intégration avec **Jest**
- Mock du store et du localStorage
- Tests du router et des composants

```bash
npm test
```

---

## Démarrage

### Installation

```bash
git clone https://github.com/Steinshy/Oc-Billed.git
cd Oc-Billed
npm install
```

### Développement

```bash
npm run dev
```

---

## Scripts disponibles

| Commande          | Description        |
| ----------------- | ------------------ |
| `npm run dev`     | Lance le frontend  |
| `npm run dev:all` | Frontend + backend |
| `npm run build`   | Build production   |
| `npm run preview` | Prévisualisation   |
| `npm test`        | Lance les tests    |
| `npm run lint`    | Lint du projet     |

---

## Configuration

- Stockage JWT via `localStorage`
- Routes protégées selon le rôle
- Appels API centralisés via `store.js`

---

## Compatibilité

- Navigateurs modernes (Chrome, Firefox, Edge)
- Node.js ≥ 18

---

## Licence

Projet réalisé dans le cadre du parcours  
**Développeur Frontend OpenClassrooms**.

© 2025 — OC-Billed
