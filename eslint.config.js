const [OFF, , ERROR] = [0, 1, 2];

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "tsconfig.eslint.json",
  },
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["jest", "@typescript-eslint"],
  env: {
    browser: true,
    node: true,
    "jest/globals": true,
  },
  rules: {
    "@typescript-eslint/camelcase": OFF,
    "consistent-return": OFF,
    "default-case": OFF,
    "import/order": [
      ERROR,
      {
        groups: [["external", "builtin"], "internal", "parent", ["index", "sibling"], "object"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/prefer-default-export": OFF,
    "no-nested-ternary": OFF,
    "no-param-reassign": OFF,
    "no-plusplus": OFF,
    "no-restricted-globals": OFF,
    "no-restricted-syntax": OFF,
    "no-underscore-dangle": OFF,
    "prettier/prettier": [
      ERROR,
      {
        printWidth: 100,
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "all",
      },
      { usePrettierrc: false },
    ],
    "spaced-comment": [ERROR, "always", { markers: ["/"] }],
    "sort-imports": [
      ERROR,
      {
        ignoreCase: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
    "symbol-description": OFF,
  },
};
