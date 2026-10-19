const $ = require("jquery");
require("@testing-library/jest-dom");

global.$ = global.jQuery = $;
// The browser loads Lucide from a CDN script (global `lucide`); tests use the local package.
global.lucide = require("lucide");

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(""),
    json: () => Promise.resolve({}),
  }),
);

global.mockWindowLocation = (pathname, hash = "") => {
  const url = hash ? `${pathname}${hash}` : pathname;
  window.history.pushState({}, "", url);
};

global.resetMockLocation = () => {
  window.history.pushState({}, "", "/");
};
