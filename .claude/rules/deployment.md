---
paths:
  - "Dockerfile"
  - ".dockerignore"
  - ".github/**/*"
  - "pnpm-workspace.yaml"
---

# Deployment

- No build step and no backend: releases serve `index.html` + `src/` as-is (Docker via the `.dockerignore` whitelist, Pages via the `deploy.yml` copy step); the demo store turns itself on outside localhost.
- Keep tests, mocks and tooling out of `src/`: everything in it ships.
- GitHub Pages: `.github/workflows/deploy.yml` on push to `main`; served under `/OC-Billed/`, hash routes need no 404 fallback.
- Coolify (app `Billed`): builds the `Dockerfile` (nginx, inline config); Coolify-only, not built in CI.
- CI (`.github/workflows/ci.yml`): frozen install, `pnpm lint`, `pnpm test`, non-blocking `pnpm audit --prod`; actions pinned by SHA.
- pnpm 11 rejects unreviewed install scripts: add new ones to `allowBuilds` in `pnpm-workspace.yaml` (`true` to run, `false` to skip).
