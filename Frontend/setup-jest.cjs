const $ = require("jquery");
require("@testing-library/jest-dom");

global.$ = global.jQuery = $;

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(""),
    json: () => Promise.resolve({}),
  }),
);

