const path = require('path');

module.exports = {
  projects: [
    // Server configuration
    {
      displayName: 'server',
      rootDir: path.join(__dirname, 'server'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
      coverageDirectory: path.join(__dirname, 'coverage/server'),
      collectCoverageFrom: [
        '<rootDir>/src/**/*.js',
        '!<rootDir>/src/config/**',
        '!**/node_modules/**',
      ],
    },
    // Client configuration
    {
      displayName: 'client',
      rootDir: path.join(__dirname, 'client'),
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
      },
      setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
      },
      testEnvironmentOptions: {
        url: 'http://localhost'
      },
      coverageDirectory: path.join(__dirname, 'coverage/client'),
      collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,jsx}',
        '!<rootDir>/src/index.js',
        '!<rootDir>/src/reportWebVitals.js',
        '!**/node_modules/**',
      ],
    },
  ],
  verbose: true,
  collectCoverage: false,
  testTimeout: 30000,
};