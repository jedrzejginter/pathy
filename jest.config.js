module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "/tests/.*\\.spec\\.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
