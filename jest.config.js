module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "/tests/.*\\.specv2\\.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
