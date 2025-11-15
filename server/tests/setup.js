// server/tests/setup.js
const mongoose = require('mongoose');

// Increase timeout for all tests
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // This runs once before all tests
});

// Global test teardown  
afterAll(async () => {
  // Close any open connections
  await mongoose.connection.close();
});

// Suppress console logs during tests to reduce noise
global.console = {
  ...console,
  // Uncomment to suppress specific log levels during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};