# Billed — Backend

API Express + Sequelize (SQLite) de l'application Billed.

## Prérequis

- Node.js ≥ 22
- pnpm ≥ 10 (`corepack enable` ou `npm i -g pnpm`)

## Installation

Depuis la racine du dépôt (workspace pnpm) :

```bash
pnpm install
```

## Lancer l'API

```bash
pnpm seed          # première fois : migrations + données de démo
pnpm dev:backend   # ou, depuis Backend/ : pnpm dev
```

L'API est accessible sur `http://localhost:5678` (port configurable via `PORT`).

## Tests

```bash
pnpm --filter billed-backend test         # suite complète (jest + supertest)
pnpm --filter billed-backend test:watch   # mode watch
```

## Utilisateurs par défaut

| Rôle           | Email               | Mot de passe |
| -------------- | ------------------- | ------------ |
| Administrateur | `admin@test.tld`    | `admin`      |
| Employé        | `employee@test.tld` | `employee`   |

## Endpoints

- `POST /auth/login`, `PATCH /auth/logout`
- `GET|POST /bills`, `GET|PATCH|DELETE /bills/:id`
- `GET|POST /users`, `GET|PATCH|DELETE /users/:id`

Toutes les routes (hors login/création d'utilisateur) exigent un header
`Authorization: Bearer <jwt>`.
