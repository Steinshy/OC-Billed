import js from "@eslint/js";
import importX from "eslint-plugin-import-x";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

const testGlobals = {
  describe: "readonly",
  test: "readonly",
  it: "readonly",
  expect: "readonly",
  beforeEach: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  afterAll: "readonly",
  jest: "readonly",
};

export default [
  {
    ignores: ["**/node_modules/", "coverage/", "deliverables/", "Backend/public/", "**/*.min.js"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      "import-x": importX,
      security,
      sonarjs,
      unicorn,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(_|[A-Z])",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "no-debugger": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      "object-shorthand": "warn",
      "prefer-template": "warn",

      complexity: ["warn", 25],
      "max-depth": ["warn", 8],
      "max-lines-per-function": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],

      "no-duplicate-imports": "warn",
      "import-x/no-unresolved": ["warn", { ignore: ["\\.css$"] }],
      "import-x/no-absolute-path": "warn",
      "import-x/no-self-import": "warn",
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "security/detect-eval-with-expression": "warn",
      "security/detect-unsafe-regex": "warn",

      "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
      "sonarjs/cognitive-complexity": ["warn", 25],
      "sonarjs/no-identical-functions": "warn",

      "unicorn/better-regex": "warn",
      "unicorn/prefer-spread": "warn",
    },
  },

  // Frontend: browser ES modules (jQuery/Bootstrap come from the CDN).
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        $: "readonly",
        onNavigate: "readonly",
      },
    },
    rules: {
      "no-alert": "warn",
      "no-param-reassign": ["warn", { props: false }],
    },
  },
  {
    files: ["src/__tests__/**/*.js", "src/__mocks__/**/*.js", "setup-jest.cjs"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...testGlobals },
    },
  },

  // Backend: Node CommonJS (.mjs files are ES modules).
  {
    files: ["Backend/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.node,
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclarator[id.name=/^(err|el|idx)$/]",
          message:
            "Variable names 'err', 'el', and 'idx' are not allowed. Use 'error', 'element', and 'index' instead.",
        },
        {
          selector: "CatchClause[param.name=/^(err|el|idx)$/]",
          message:
            "Catch parameter names 'err', 'el', and 'idx' are not allowed. Use 'error', 'element', and 'index' instead.",
        },
      ],
    },
  },
  {
    files: ["Backend/tests/**/*.js", "Backend/**/*.test.js", "Backend/setupTests.js"],
    languageOptions: {
      globals: { ...globals.node, ...testGlobals },
    },
  },

  // Root tooling configs.
  {
    files: ["*.{js,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
];
