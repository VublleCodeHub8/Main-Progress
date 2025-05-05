import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signIn, signUp } from '../controllers/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies to avoid mongoose model overwrite issues
vi.mock('../models/user', () => ({
  findUserByEmail: vi.fn(),
  addUser: vi.fn()
}));

vi.mock('../models/auth', () => ({
  userSignIn: vi.fn(),
  logOut: vi.fn(),
  checkRecords: vi.fn()
}));

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn()
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn()
}));

// Mock mongoose to avoid model overwrite errors
vi.mock('mongoose', async () => {
  return {
    Schema: vi.fn(),
    model: vi.fn().mockImplementation(() => ({})), // Return empty object for any model
    default: {
      Schema: vi.fn(),
      model: vi.fn().mockImplementation(() => ({}))
    }
  };
});

// Mock process.env
vi.stubEnv('JWT_SECRET', 'test-secret-key');

describe('Authentication Controller', () => {
  let req, res, userModel, authModel;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import modules to get mock functions
    userModel = await import('../models/user');
    authModel = await import('../models/auth');
    
    // Mock request and response objects
    req = {
      body: {},
      headers: {
        authorization: 'Bearer fake-token'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn()
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('signUp', () => {
    it('should return 409 if user already exists', async () => {
      // Arrange
      req.body = {
        email: 'existing@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      userModel.findUserByEmail.mockResolvedValueOnce({ email: 'existing@example.com' });
      
      // Act
      await signUp(req, res);
      
      // Assert
      expect(userModel.findUserByEmail).toHaveBeenCalledWith('existing@example.com');
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalled();
      expect(userModel.addUser).not.toHaveBeenCalled();
    });
    
    it('should create a new user successfully', async () => {
      // Arrange
      req.body = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      userModel.findUserByEmail.mockResolvedValueOnce(null);
      bcrypt.hash.mockResolvedValueOnce('hashed_password');
      userModel.addUser.mockResolvedValueOnce();
      
      // Act
      await signUp(req, res);
      
      // Assert
      expect(userModel.findUserByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(userModel.addUser).toHaveBeenCalledWith('new@example.com', 'hashed_password', 'newuser', 'user');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });
    
    it('should return 500 if error occurs during user creation', async () => {
      // Arrange
      req.body = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      userModel.findUserByEmail.mockResolvedValueOnce(null);
      bcrypt.hash.mockResolvedValueOnce('hashed_password');
      userModel.addUser.mockRejectedValueOnce(new Error('Database error'));
      
      // Act
      await signUp(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should return 400 if user does not exist', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      userModel.findUserByEmail.mockResolvedValueOnce(null);
      
      // Act
      await signIn(req, res);
      
      // Assert
      expect(userModel.findUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
    
    it('should return 400 if password is incorrect', async () => {
      // Arrange
      req.body = {
        email: 'user@example.com',
        password: 'wrongpassword'
      };
      
      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        password: 'hashed_password',
        role: 'user'
      };
      
      userModel.findUserByEmail.mockResolvedValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(false);
      
      // Act
      await signIn(req, res);
      
      // Assert
      expect(userModel.findUserByEmail).toHaveBeenCalledWith('user@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
    
    it('should sign in user successfully and return token', async () => {
      // Arrange
      req.body = {
        email: 'user@example.com',
        password: 'correctpassword'
      };
      
      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        password: 'hashed_password',
        role: 'user'
      };
      
      userModel.findUserByEmail.mockResolvedValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true);
      userModel.findUserByEmail.mockResolvedValueOnce(mockUser);
      jwt.sign.mockReturnValueOnce('jwt-token');
      authModel.userSignIn.mockResolvedValueOnce();
      
      // Act
      await signIn(req, res);
      
      // Assert
      expect(userModel.findUserByEmail).toHaveBeenCalledWith('user@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123', email: 'user@example.com', role: 'user' },
        'test-secret-key',
        { expiresIn: '30d' }
      );
      expect(authModel.userSignIn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });
}); 