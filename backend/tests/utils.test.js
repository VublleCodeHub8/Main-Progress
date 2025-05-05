import { describe, it, expect } from 'vitest';

// Utility functions to test
const formatDateTime = (date) => {
  if (date === null) {
    throw new Error('Invalid date');
  }
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const calculateUptime = (startTime) => {
  if (startTime === null) {
    throw new Error('Invalid start time');
  }
  
  const start = new Date(startTime);
  const now = new Date();
  
  if (isNaN(start.getTime())) {
    throw new Error('Invalid start time');
  }
  
  const elapsedMs = now.getTime() - start.getTime();
  
  // Calculate hours, minutes, seconds
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    hours,
    minutes,
    seconds,
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  };
};

const calculateCost = (startTime, hourlyRate) => {
  const start = new Date(startTime);
  const now = new Date();
  
  if (isNaN(start.getTime())) {
    throw new Error('Invalid start time');
  }
  
  if (typeof hourlyRate !== 'number' || hourlyRate < 0) {
    throw new Error('Invalid hourly rate');
  }
  
  const elapsedMs = now.getTime() - start.getTime();
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  
  // Calculate cost based on hourly rate
  const cost = elapsedHours * hourlyRate;
  
  return parseFloat(cost.toFixed(2));
};

const getPaginatedItems = (items, page = 1, itemsPerPage = 10) => {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  
  if (page < 1) {
    throw new Error('Page must be greater than 0');
  }
  
  if (itemsPerPage < 1) {
    throw new Error('Items per page must be greater than 0');
  }
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      itemsPerPage,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / itemsPerPage),
      hasNextPage: endIndex < items.length,
      hasPrevPage: page > 1
    }
  };
};

const filterSensitiveData = (user) => {
  if (!user || typeof user !== 'object') {
    return null;
  }
  
  // Create a shallow copy to avoid modifying the original
  const filteredUser = { ...user };
  
  // Remove sensitive fields
  delete filteredUser.password;
  delete filteredUser.tokens;
  delete filteredUser.resetPasswordToken;
  
  return filteredUser;
};

describe('Utility Functions', () => {
  describe('formatDateTime', () => {
    it('should format Date objects correctly', () => {
      const date = new Date(2023, 5, 15, 10, 30, 45); // June 15, 2023 10:30:45
      expect(formatDateTime(date)).toBe('2023-06-15 10:30:45');
    });
    
    it('should format date strings correctly', () => {
      expect(formatDateTime('2023-07-20T14:25:30Z')).toMatch(/^2023-07-20 \d{2}:\d{2}:\d{2}$/);
    });
    
    it('should throw an error for invalid dates', () => {
      expect(() => formatDateTime('invalid-date')).toThrow('Invalid date');
      expect(() => formatDateTime(null)).toThrow('Invalid date');
    });
  });
  
  describe('calculateUptime', () => {
    it('should calculate uptime correctly', () => {
      // Create a date 1 hour, 30 minutes and 15 seconds ago
      const now = new Date();
      const startTime = new Date(now);
      startTime.setHours(now.getHours() - 1);
      startTime.setMinutes(now.getMinutes() - 30);
      startTime.setSeconds(now.getSeconds() - 15);
      
      const result = calculateUptime(startTime);
      
      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBeGreaterThanOrEqual(15);
      expect(result.seconds).toBeLessThanOrEqual(16); // Allow for slight test execution time
      expect(result.formatted).toMatch(/^01:30:\d{2}$/);
    });
    
    it('should throw an error for invalid start times', () => {
      expect(() => calculateUptime('invalid-date')).toThrow('Invalid start time');
      expect(() => calculateUptime(null)).toThrow('Invalid start time');
    });
  });
  
  describe('calculateCost', () => {
    it('should calculate cost correctly based on time and rate', () => {
      // Create a date 2.5 hours ago
      const now = new Date();
      const startTime = new Date(now);
      startTime.setHours(now.getHours() - 2);
      startTime.setMinutes(now.getMinutes() - 30);
      
      // Calculate cost with hourly rate of $10
      const result = calculateCost(startTime, 10);
      
      // Cost should be approximately $25.00 (2.5 hours * $10)
      expect(result).toBeCloseTo(25, 0);
    });
    
    it('should throw errors for invalid inputs', () => {
      const validDate = new Date();
      
      expect(() => calculateCost('invalid-date', 10)).toThrow('Invalid start time');
      expect(() => calculateCost(validDate, -5)).toThrow('Invalid hourly rate');
      expect(() => calculateCost(validDate, 'not-a-number')).toThrow('Invalid hourly rate');
    });
  });
  
  describe('getPaginatedItems', () => {
    it('should paginate an array correctly', () => {
      // Create test array with 25 items
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      
      // Get page 2 with 10 items per page
      const result = getPaginatedItems(items, 2, 10);
      
      expect(result.items).toHaveLength(10);
      expect(result.items[0].id).toBe(11); // First item on page 2
      expect(result.items[9].id).toBe(20); // Last item on page 2
      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
    });
    
    it('should handle the last page correctly', () => {
      // Create test array with 25 items
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      
      // Get page 3 with 10 items per page (last page with 5 items)
      const result = getPaginatedItems(items, 3, 10);
      
      expect(result.items).toHaveLength(5);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(true);
    });
    
    it('should throw errors for invalid inputs', () => {
      const validArray = [1, 2, 3];
      
      expect(() => getPaginatedItems('not-an-array')).toThrow('Items must be an array');
      expect(() => getPaginatedItems(validArray, 0)).toThrow('Page must be greater than 0');
      expect(() => getPaginatedItems(validArray, 1, 0)).toThrow('Items per page must be greater than 0');
    });
  });
  
  describe('filterSensitiveData', () => {
    it('should remove sensitive fields from user object', () => {
      const user = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        tokens: ['token1', 'token2'],
        resetPasswordToken: 'reset_token',
        role: 'user'
      };
      
      const filtered = filterSensitiveData(user);
      
      expect(filtered._id).toBe('123');
      expect(filtered.username).toBe('testuser');
      expect(filtered.email).toBe('test@example.com');
      expect(filtered.role).toBe('user');
      expect(filtered.password).toBeUndefined();
      expect(filtered.tokens).toBeUndefined();
      expect(filtered.resetPasswordToken).toBeUndefined();
    });
    
    it('should handle null or non-object inputs', () => {
      expect(filterSensitiveData(null)).toBeNull();
      expect(filterSensitiveData('string')).toBeNull();
      expect(filterSensitiveData(123)).toBeNull();
    });
  });
}); 