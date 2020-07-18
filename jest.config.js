module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*"],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
