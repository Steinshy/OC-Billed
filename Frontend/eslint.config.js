import js from "@eslint/js";
import htmlPlugin from "eslint-plugin-html";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      import: importPlugin,
      jsdoc,
      security,
      sonarjs,
      unicorn,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        $: "readonly",
        onNavigate: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
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
      "no-alert": "warn",
      "no-var": "warn",
      "no-underscore-dangle": "off",
      "no-param-reassign": ["warn", { props: false }],
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": "warn",
      "object-shorthand": "warn",
      "prefer-template": "warn",

      "comma-dangle": ["warn", "always-multiline"],
      quotes: ["warn", "double", { avoidEscape: true }],
      semi: ["warn", "always"],
      "no-trailing-spaces": "warn",

      "max-len": [
        "warn",
        {
          code: 200,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      complexity: ["warn", 25],
      "max-depth": ["warn", 8],
      "max-lines-per-function": [
        "warn",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],

      "no-duplicate-imports": "warn",
      "import/no-unresolved": [
        "warn",
        {
          ignore: [
            "^\\./",
            "^\\.\\./",
            "^node:",
            "^@tailwindcss/",
            "^tailwindcss",
            "^@testing-library/",
            "^@components/",
            "^@containers/",
            "^@render/",
            "^@dashboard/",
            "^@utils/",
            "^@data/",
            "^@styles/",
            "^@api/",
            "^@middleware/",
            "^@public/",
            "^@svg/",
            "^@images/",
            "^@test/",
            "^@test/fixtures/",
            "^@test/mocks/",
            "^@test/components/",
            "^@/",
            "\\.css$",
            "\\.scss$",
            "\\.sass$",
            "\\.less$",
          ],
        },
      ],
      "import/no-absolute-path": "warn",
      "import/no-self-import": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "ignore",
          pathGroups: [
            {
              pattern: "@middleware/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@api/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@components/**",
              group: "internal",
            },
            {
              pattern: "@utils/**",
              group: "internal",
            },
            {
              pattern: "@data/**",
              group: "internal",
            },
            {
              pattern: "@styles/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",

      "security/detect-eval-with-expression": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-object-injection": "off",

      "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
      "sonarjs/cognitive-complexity": ["warn", 25],
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-nested-template-literals": "off",
      "sonarjs/no-small-switch": "off",

      "unicorn/better-regex": "warn",
      "unicorn/no-array-for-each": "off",
      "unicorn/prefer-query-selector": "off",
      "unicorn/prefer-modern-dom-apis": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "unicorn/prefer-spread": "warn",
    },
  },
  {
    files: [
      "test/**/*.{js,mjs,cjs}",
      "**/*.test.{js,mjs,cjs}",
      "**/__tests__/**/*.{js,mjs,cjs}",
      "setup-jest.js",
    ],
    plugins: {
      import: importPlugin,
      jsdoc,
      security,
      sonarjs,
      unicorn,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  {
    ignores: [
      "node_modules/**",
      "node_modules/",
      "dist/",
      "public/",
      "coverage/**",
      "**/lcov-report/**",
      "benchmark-results/",
      "temp/",
      ".stryker-tmp/",
      "coverage/",
      "*.min.js",
      "*.min.css",
      "*.log",
      ".cursor/",
      ".vscode/",
      ".idea/",
      ".oc/",
      ".DS_Store",
    ],
  },
];
