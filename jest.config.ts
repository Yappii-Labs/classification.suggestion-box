import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  restoreMocks: true,
  verbose: true
};

export default config;
