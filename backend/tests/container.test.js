import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createContainer, runContainer } from '../controllers/container';

// Mock dependencies directly to avoid mongoose model overwrite issues
vi.mock('../models/containers', () => ({
  getContainerById: vi.fn(),
  getContainerByPort: vi.fn(),
  getContainersByEmail: vi.fn(),
  createNewContainer: vi.fn(),
  deleteOneContainer: vi.fn(),
  setStartedAt: vi.fn()
}));

vi.mock('../models/user', () => ({
  findUserByEmail: vi.fn(),
  billIncrement: vi.fn(),
  containerUsageIncrement: vi.fn()
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

vi.mock('dockerode', () => {
  return function() {
    return {
      createContainer: vi.fn().mockResolvedValue({
        id: 'container123'
      }),
      getContainer: vi.fn(() => ({
        inspect: vi.fn().mockResolvedValue({
          Name: '/test_container',
          State: { Running: false }
        }),
        start: vi.fn().mockResolvedValue(true)
      }))
    };
  };
});

// Mock net module for port availability check
vi.mock('net', () => ({
  createServer: vi.fn().mockReturnValue({
    listen: vi.fn().mockImplementation((port, host, callback) => {
      callback();
      return {
        close: vi.fn().mockImplementation((cb) => cb())
      };
    }),
    on: vi.fn().mockImplementation((event, callback) => {
      if (event === 'error') {
        // Don't call error callback to simulate available port
      }
      return {
        close: vi.fn()
      };
    })
  })
}));

describe('Container Controller', () => {
  let req, res, containerModel, userModel;
  
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import modules to get mock functions
    containerModel = await import('../models/containers');
    userModel = await import('../models/user');
    
    // Mock request and response objects
    req = {
      headers: {
        title: 'test-container',
        template: 'test-image'
      },
      userData: {
        email: 'test@example.com',
        userId: 'user123'
      },
      params: {
        containerId: 'container123'
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
  
  describe('createContainer', () => {
    it('should create a new container successfully', async () => {
      // Arrange
      containerModel.createNewContainer.mockResolvedValueOnce(true);
      userModel.containerUsageIncrement.mockResolvedValueOnce(true);
      
      // Act
      await createContainer(req, res);
      
      // Assert
      expect(containerModel.createNewContainer).toHaveBeenCalled();
      expect(userModel.containerUsageIncrement).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        containerId: 'container123',
        containerTemplate: 'test-image'
      }));
    });
    
    it('should return 500 if container creation fails', async () => {
      // Arrange
      containerModel.createNewContainer.mockResolvedValueOnce(false);
      
      // Act
      await createContainer(req, res);
      
      // Assert
      expect(containerModel.createNewContainer).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });
  
  describe('runContainer', () => {
    it('should start a container that is not running', async () => {
      // Arrange
      containerModel.getContainerById.mockResolvedValue({
        port: 8080,
        createdAt: new Date()
      });
      containerModel.setStartedAt.mockResolvedValueOnce(true);
      
      // Act
      await runContainer(req, res);
      
      // Assert
      expect(containerModel.getContainerById).toHaveBeenCalledWith('container123');
      expect(containerModel.setStartedAt).toHaveBeenCalledWith('container123');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        port: 8080
      }));
    });
    
    it('should return container info if it is already running', async () => {
      // Arrange
      const mockContainer = {
        id: 'container123',
        port: 8080,
        createdAt: new Date()
      };
      
      // Mock the container to be already running
      vi.mocked(require('dockerode')().getContainer).mockImplementationOnce(() => ({
        inspect: vi.fn().mockResolvedValue({
          Name: '/test_container',
          State: { Running: true }
        })
      }));
      
      containerModel.getContainerById.mockResolvedValue(mockContainer);
      
      // Act
      await runContainer(req, res);
      
      // Assert
      expect(containerModel.getContainerById).toHaveBeenCalledWith('container123');
      expect(containerModel.setStartedAt).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        port: 8080
      }));
    });
    
    it('should return 500 if an error occurs', async () => {
      // Arrange
      vi.mocked(require('dockerode')().getContainer).mockImplementationOnce(() => ({
        inspect: vi.fn().mockRejectedValue(new Error('Docker error')),
        start: vi.fn()
      }));
      
      // Act
      await runContainer(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });
}); 