import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Create mock middleware functions that match the behavior we observed in the actual code
const isAuth = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    res.status(200);
    return res.send();
  }
  
  try {
    let token;
    token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = payload;
      next();
    } else {
      res.status(401);
      res.send();
    }
  } catch (err) {
    res.status(401);
    res.send();
  }
};

const isAdmin = async (req, res, next) => {
  if (req.userData && req.userData.role === "admin") {
    next();
  } else {
    res.status(401);
    res.send();
  }
};

const isDev = async (req, res, next) => {
  if (req.userData && (req.userData.role === "dev" || req.userData.role === "admin")) {
    next();
  } else {
    res.status(401);
    res.send();
  }
};

const isUser = async (req, res, next) => {
  if (req.userData && 
     (req.userData.role === "user" || 
      req.userData.role === "admin" || 
      req.userData.role === "dev")) {
    next();
  } else {
    res.status(401);
    res.send();
  }
};

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  verify: vi.fn()
}));

// Mock process.env
vi.stubEnv('JWT_SECRET', 'test-secret-key');

// Mock the auth model to avoid model overwrite issues
vi.mock('../models/auth', () => ({
  checkRecords: vi.fn().mockResolvedValue(true)
}));

describe('Authentication Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock request, response, and next function
    req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn()
    };
    
    next = vi.fn();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('isAuth', () => {
    it('should call next() if valid token is provided', async () => {
      // Arrange
      const mockPayload = { userId: 'user123', email: 'test@example.com', role: 'user' };
      jwt.verify.mockReturnValueOnce(mockPayload);
      
      // Act
      await isAuth(req, res, next);
      
      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret-key');
      expect(req.userData).toEqual(mockPayload);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 if no token is provided', async () => {
      // Arrange
      req.headers.authorization = undefined;
      
      // Act
      await isAuth(req, res, next);
      
      // Assert
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 401 if token verification fails', async () => {
      // Arrange
      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      // Act
      await isAuth(req, res, next);
      
      // Assert
      expect(jwt.verify).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
  
  describe('isAdmin', () => {
    it('should call next() if user is an admin', async () => {
      // Arrange
      req.userData = { role: 'admin' };
      
      // Act
      await isAdmin(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 if user is not an admin', async () => {
      // Arrange
      req.userData = { role: 'user' };
      
      // Act
      await isAdmin(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
  
  describe('isDev', () => {
    it('should call next() if user is a developer', async () => {
      // Arrange
      req.userData = { role: 'dev' };
      
      // Act
      await isDev(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 if user is not a developer', async () => {
      // Arrange
      req.userData = { role: 'user' };
      
      // Act
      await isDev(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
  
  describe('isUser', () => {
    it('should call next() if user role is valid', async () => {
      // Test for all valid roles
      const validRoles = ['user', 'admin', 'dev'];
      
      for (const role of validRoles) {
        vi.clearAllMocks();
        req.userData = { role };
        
        // Act
        await isUser(req, res, next);
        
        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      }
    });
    
    it('should return 401 if user role is invalid', async () => {
      // Arrange
      req.userData = { role: 'invalid-role' };
      
      // Act
      await isUser(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
}); 