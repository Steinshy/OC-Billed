---
paths:
  - "src/**/*"
  - "tests/**/*"
  - "index.html"
  - "jest.config.cjs"
---

# Frontend

- No bundler: native ES modules loaded from `index.html`; relative imports with the `.js` extension.
- Bootstrap 4, jQuery 3.2.1 (slim) and Popper come from CDNs in `index.html`; the `jquery` devDependency only serves Jest (`tests/setup.cjs`).
- Routing: `src/app/Router.js` over `ROUTES_PATH` in `src/constants/routes.js` (Login `/`, hash routes for employee and admin pages); URLs resolve against the served directory, so keep the app working under a sub-path.
- Views (`src/views/`) return HTML strings; containers (`src/containers/`) wire events and call the store. Keep the `data-testid` attributes: tests and containers query them.
- Store: `src/app/Store.js` exports `DemoStore` when `USE_DEMO` (`src/app/config.js`) is true: any non-localhost host, or `?demo` locally. Keep `DemoStore.js` routes, response shapes and error messages in sync with `Backend/controllers`.
- `Logout` clears localStorage, so the demo store keeps its data in sessionStorage.
- `src/` holds runtime code only (releases ship it whole); tests live in `tests/`, Jest helpers and fixture data in `tests/mocks/` (`tests/mocks/store.js` is unrelated to `DemoStore.js`).
- Imports: `import-x/order` (builtin, external, then relative, alphabetized, blank line between groups); run `pnpm fix` instead of ordering by hand.
