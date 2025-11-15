// Mock mongoose at the very top - before any imports
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Schema: actualMongoose.Schema,
    model: jest.fn(),
  };
});

// Now import the modules
const authMiddleware = require('../../src/middleware/auth');
const { verifyToken } = require('../../src/utils/auth');

// Mock User model
jest.mock('../../src/models/User', () => ({
  findById: jest.fn()
}));

const User = require('../../src/models/User');

describe('Auth Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() for valid token', async () => {
    req.header.mockReturnValue('Bearer valid-token');
    verifyToken.mockReturnValue({ userId: '123' });
    User.findById.mockResolvedValue({ _id: '123', username: 'testuser' });

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ _id: '123', username: 'testuser' });
  });

  it('should return 401 for missing token', async () => {
    req.header.mockReturnValue(null);

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 401 for invalid token', async () => {
    req.header.mockReturnValue('Bearer invalid-token');
    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should return 401 if user not found', async () => {
    req.header.mockReturnValue('Bearer valid-token');
    verifyToken.mockReturnValue({ userId: '123' });
    User.findById.mockResolvedValue(null);

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
});