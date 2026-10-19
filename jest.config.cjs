module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./setup-jest.cjs"],
  transform: {
    "^.+\\.js$": ["@swc/jest", { jsc: { target: "es2022" }, module: { type: "es6" } }],
  },
  moduleNameMapper: {
    "\\.css$": "<rootDir>/src/__mocks__/styleMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app/App.js",
    "!src/app/datepicker.js",
    "!src/__tests__/**",
    "!src/__mocks__/**",
    "!src/fixtures/**",
    "!src/assets/svg/**",
  ],
  coverageReporters: ["text", "lcov", "html"],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "./test-report.html",
        includeFailureMsg: true,
        includeStackTrace: true,
        sort: "status",
      },
    ],
  ],
};
