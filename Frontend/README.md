# Billed — Frontend

SPA JavaScript sans framework (jQuery/Bootstrap via CDN, live-server en développement).

## Prérequis

- Node.js ≥ 22
- pnpm ≥ 10 (`corepack enable` ou `npm i -g pnpm`)
- Le backend doit tourner sur `http://localhost:5678` (voir `Backend/README.md`)

## Installation

Depuis la racine du dépôt (workspace pnpm) :

```bash
pnpm install
```

## Lancer l'application

```bash
pnpm dev            # depuis la racine : backend + frontend
pnpm dev:frontend   # frontend seul
```

Puis ouvrez `http://127.0.0.1:8080/`.

## Tests

```bash
pnpm --filter billed-frontend test         # suite complète + couverture
pnpm --filter billed-frontend test:watch   # mode watch
pnpm --filter billed-frontend exec jest src/__tests__/Bills.js   # un seul fichier
```

La couverture est générée dans `coverage/` et un rapport HTML dans `test-report.html`.

## Comptes de test

| Rôle           | Email               | Mot de passe |
| -------------- | ------------------- | ------------ |
| Administrateur | `admin@test.tld`    | `admin`      |
| Employé        | `employee@test.tld` | `employee`   |
