# Billed — Backend

API Express 5 + Sequelize (SQLite) de l'application Billed. Elle sert au développement local uniquement : les releases (GitHub Pages, Coolify) utilisent le store de démo `src/store/DemoStore.js`.

## Lancer l'API

Depuis la racine du dépôt (Node.js 24, pnpm) :

```bash
pnpm install
pnpm dev:backend   # migrations, puis API sur http://localhost:5678 (port configurable via PORT)
pnpm seed          # migrations + réinitialisation des données de démo
```

`server.js` réinitialise aussi les données de démo à chaque démarrage.

## Tests

```bash
pnpm --filter billed-backend test   # migre la base de test, puis jest + supertest
```

## Utilisateurs de démo

| Rôle           | Email               | Mot de passe |
| -------------- | ------------------- | ------------ |
| Administrateur | `admin@test.tld`    | `admin`      |
| Employé        | `employee@test.tld` | `employee`   |

## Endpoints

- `POST /auth/login`, `PATCH /auth/logout`
- `GET|POST /bills`, `GET|PATCH|DELETE /bills/:id`
- `GET|POST /users`, `GET|PATCH|DELETE /users/:id`

Toutes les routes (hors login et création d'utilisateur) exigent un header `Authorization: Bearer <jwt>`.
