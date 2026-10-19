// Releases (GitHub Pages, Coolify) have no backend: outside local dev, Store.js serves the in-browser demo store (DemoStore.js).
// Locally, open the app with `?demo` to use the demo store too; the choice lasts for the tab session.
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const DEMO_SESSION_KEY = "billed-use-demo";

if (new URLSearchParams(window.location.search).has("demo")) sessionStorage.setItem(DEMO_SESSION_KEY, "true");

export const USE_DEMO = !LOCAL_HOSTS.has(window.location.hostname) || sessionStorage.getItem(DEMO_SESSION_KEY) === "true";
