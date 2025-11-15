

// Increase timeout for all tests
jest.setTimeout(30000);

// Only mock mongoose if we're doing unit tests without database
// For integration tests, we'll use the real mongoose with in-memory database

// Global test setup
beforeAll(async () => {
  // Setup that runs before all tests
});

// Global test teardown  
afterAll(async () => {
  // Cleanup that runs after all tests
});

// Suppress console logs during tests to reduce noise
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});