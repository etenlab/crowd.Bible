import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,

  setupFiles: ['src/setupTests.ts'],
};

export default config;
