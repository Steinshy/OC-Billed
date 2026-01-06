module.exports = {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".js"],
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                node: "current",
              },
              modules: "auto",
            },
          ],
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$|@testing-library))",
  ],
  setupFiles: ["./setup-jest.js"],
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js",
  ],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/app/**",
    "!**/assets/**",
    "!**/external/**",
    "!**/fixtures/**",
    "!**/lcov-report/**",
    "!**/node_modules/**",
    "!**/*.config.{js,cjs,mjs}",
    "!**/coverage/**",
  ],
  verbose: false,
  globals: {
    "babel-jest": {
      useESM: true,
    },
  },
};

