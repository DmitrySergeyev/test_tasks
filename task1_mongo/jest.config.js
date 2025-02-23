module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
  ],
  roots: ["<rootDir>/src/", "<rootDir>/specs/"],
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  reporters: [
    "default",
  ],
  coverageReporters: [
    "text",
    "cobertura",
  ],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "<rootDir>/specs/e2e",
  ],
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
  },
  clearMocks: true,
  collectCoverageFrom: [
    "**/*.{js,ts}",
    "!**/node_modules/**",
    "!**/specs/**",
    "!**/src/main.ts",
    "!**/src/database/migration/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/node_modules/jest-extended/all"],
}
