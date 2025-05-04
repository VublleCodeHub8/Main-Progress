import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { findUserByEmail, changePassword } from '../models/user';
import * as authModel from '../models/auth';

// Mock the auth model
vi.mock('../models/auth', () => ({
  deleteToken: vi.fn()
}));

// Mock mongoose with proper implementation to avoid overwrite errors
vi.mock('mongoose', async () => {
  const mockModel = vi.fn();
  const mockUserInstance = {
    exists: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    save: vi.fn()
  };
  
  // Return mongoose mock with the model function that returns our mock user
  return {
    Schema: vi.fn(),
    model: mockModel.mockImplementation(() => mockUserInstance),
    // Ensure default export is also provided
    default: {
      Schema: vi.fn(),
      model: mockModel.mockImplementation(() => mockUserInstance)
    }
  };
});

// Mock the User model
vi.mock('../models/user', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // Override the User model with mock methods
    // but keep the actual implementation of exported functions
    User: {
      exists: vi.fn(),
      findById: vi.fn(),
      findOne: vi.fn()
    }
  };
});

describe('User Model', () => {
  let mockUser, mongoose;
  
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Get mongoose instance with our mocks
    mongoose = await import('mongoose');
    
    // Create a mock user
    mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'currentpassword',
      username: 'testuser',
      role: 'user',
      save: vi.fn().mockResolvedValue(true)
    };
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('findUserByEmail', () => {
    it('should return null if user does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mongoose.model().exists.mockResolvedValueOnce(null);
      
      // Act
      const result = await findUserByEmail(email);
      
      // Assert
      expect(mongoose.model().exists).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
    
    it('should return user data if user exists', async () => {
      // Arrange
      const email = 'existing@example.com';
      mongoose.model().exists.mockResolvedValueOnce({ _id: 'user123' });
      mongoose.model().findById.mockResolvedValueOnce(mockUser);
      
      // Act
      const result = await findUserByEmail(email);
      
      // Assert
      expect(mongoose.model().exists).toHaveBeenCalledWith({ email });
      expect(mongoose.model().findById).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockUser);
    });
  });
  
  describe('changePassword', () => {
    it('should throw error if user is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const newPassword = 'newpassword123';
      mongoose.model().findOne.mockResolvedValueOnce(null);
      
      // Act & Assert
      await expect(changePassword(email, newPassword)).rejects.toThrow('User not found');
      expect(mongoose.model().findOne).toHaveBeenCalledWith({ email });
    });
    
    it('should update password and delete token if user exists', async () => {
      // Arrange
      const email = 'test@example.com';
      const newPassword = 'newpassword123';
      mongoose.model().findOne.mockResolvedValueOnce(mockUser);
      
      // Act
      const result = await changePassword(email, newPassword);
      
      // Assert
      expect(mongoose.model().findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.password).toBe(newPassword);
      expect(mockUser.save).toHaveBeenCalled();
      expect(authModel.deleteToken).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });
    
    it('should throw error if saving fails', async () => {
      // Arrange
      const email = 'test@example.com';
      const newPassword = 'newpassword123';
      const saveError = new Error('Save error');
      
      mongoose.model().findOne.mockResolvedValueOnce({
        ...mockUser,
        save: vi.fn().mockRejectedValueOnce(saveError)
      });
      
      // Act & Assert
      await expect(changePassword(email, newPassword)).rejects.toThrow(saveError);
    });
  });
}); 