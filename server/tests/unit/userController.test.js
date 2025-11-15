const userController = require('../../src/controllers/userController');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

// Mock dependencies
jest.mock('../../src/models/User');
jest.mock('../../src/utils/auth');

describe('User Controller - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      User.create.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mock-token');

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token: 'mock-token',
        user: expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com'
        })
      });
    });

    it('should handle registration errors', async () => {
      User.create.mockRejectedValue(new Error('Email already exists'));

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email already exists'
      });
    });
  });
});