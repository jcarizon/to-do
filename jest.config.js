/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  collectCoverageFrom: [
    "src/features/auth/**/*.{ts,tsx}",
    "src/store/**/*.{ts,tsx}",
    "src/middleware.ts",
    "!**/*.d.ts",
  ],
};

module.exports = config;