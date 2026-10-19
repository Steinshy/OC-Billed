<h1 align="center">Billed</h1>

<p align="center"><strong>Langues :</strong> <a href="README.md">English</a> | <a href="README.fr.md">Français</a></p>

<p align="center">
  <a href="https://steinshy.github.io/OC-Billed/"><strong>Démo en ligne →</strong></a>
</p>

<p align="center">
  <img src=".github/assets/mockup.png" alt="Maquette Billed" width="700" />
</p>

SPA de gestion de notes de frais réalisée dans le cadre du parcours front-end OpenClassrooms : les employés soumettent leurs notes de frais avec un justificatif, les administrateurs les valident ou les refusent. Le projet porte sur le débogage d'une base de code existante et sa couverture par des tests.

## Démo en ligne

La démo fonctionne sans backend : un store de démo dans le navigateur (`src/app/DemoStore.js`) répond aux mêmes routes que l'API Express.

| Rôle           | Email               | Mot de passe |
| -------------- | ------------------- | ------------ |
| Employé        | `employee@test.tld` | `employee`   |
| Administrateur | `admin@test.tld`    | `admin`      |

Les notes créées et les décisions de l'administrateur sont conservées dans le `sessionStorage` de l'onglet ; fermer l'onglet réinitialise la démo.

## Fonctionnalités

- Connexion et déconnexion employé et administrateur
- Employé : liste de ses notes de frais, aperçu du justificatif, nouvelle note avec envoi d'image (jpg, jpeg, png)
- Administrateur : tableau de bord par statut, validation ou refus avec commentaire

## Stack technique

| Domaine  | Stack                                                    |
| -------- | -------------------------------------------------------- |
| Frontend | JavaScript natif (modules ES), Bootstrap 4, jQuery       |
| Backend  | Express 5, Sequelize, SQLite, JWT, Multer                |
| Tests    | Jest, Testing Library (jsdom), Supertest                 |
| Outils   | Workspace pnpm, ESLint, Stylelint, Prettier, live-server |

## Démarrage

Nécessite Node.js 24 et pnpm (`corepack enable` utilise la version fixée dans `package.json`).

```bash
git clone https://github.com/Steinshy/OC-Billed.git
cd OC-Billed
pnpm install
pnpm dev   # API sur :5678 (migrée et réinitialisée au démarrage) + frontend sur :8080
```

Pour tester le frontend sans backend, lancez `pnpm dev:frontend` puis ouvrez `http://127.0.0.1:8080/?demo`.

Référence de l'API : [Backend/README.md](./Backend/README.md).

## Scripts

| Commande            | Rôle                                                 |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Backend + frontend                                   |
| `pnpm dev:frontend` | Frontend seul (live-server)                          |
| `pnpm dev:backend`  | Backend seul (migrations, puis API sur :5678)        |
| `pnpm seed`         | Migrations + données de démo                         |
| `pnpm test`         | Tests frontend avec couverture, puis tests backend   |
| `pnpm lint`         | ESLint + Stylelint + vérification Prettier           |
| `pnpm fix`          | Correction automatique ESLint, Stylelint et Prettier |

## Déploiement

Les deux cibles servent les fichiers sources tels quels (pas de bundler) et aucun backend : le store de démo s'active hors de localhost.

- **GitHub Pages :** `.github/workflows/deploy.yml` publie à chaque push sur `main`.
- **Coolify :** le `Dockerfile` sert les mêmes fichiers avec nginx.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) : structure et choix techniques
- [Backend/README.md](./Backend/README.md) : API, base de données et comptes de démo
- [`deliverables/`](./deliverables) : rapports de tests et plan de test E2E employé
