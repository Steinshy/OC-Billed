module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["<rootDir>/tests/*.js"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.cjs"],
  transform: {
    "^.+\\.js$": ["@swc/jest", { jsc: { target: "es2022" }, module: { type: "es6" } }],
  },
  moduleNameMapper: {
    "\\.css$": "<rootDir>/tests/mocks/styleMock.js",
  },
  collectCoverageFrom: ["src/**/*.js", "!src/app/App.js", "!src/app/datepicker.js"],
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
