import { describe, it, expect } from 'vitest';

// Simple validation functions to test
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  // Password should be at least 8 characters long
  if (password.length < 8) return false;
  
  // Should contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Should contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Should contain at least one number
  if (!/[0-9]/.test(password)) return false;
  
  return true;
};

const validateUsername = (username) => {
  // Username should be between 3 and 20 characters
  if (username.length < 3 || username.length > 20) return false;
  
  // Username should only contain alphanumeric characters and underscores
  return /^[a-zA-Z0-9_]+$/.test(username);
};

const validateContainerName = (name) => {
  // Container name should be between 3 and 30 characters
  if (name.length < 3 || name.length > 30) return false;
  
  // Should only contain alphanumeric characters, hyphens and underscores
  return /^[a-zA-Z0-9_-]+$/.test(name);
};

const validatePort = (port) => {
  // Convert to number if it's a string
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
  
  // Port should be a number between 1024 and 65535
  return !isNaN(portNum) && portNum >= 1024 && portNum <= 65535;
};

// Fixed version that properly validates "3000a" as invalid
const validatePortFixed = (port) => {
  // If it's not a string or number, it's invalid
  if (typeof port !== 'string' && typeof port !== 'number') return false;
  
  // If it's a string, check if it contains only digits
  if (typeof port === 'string' && !/^\d+$/.test(port)) return false;
  
  // Convert to number
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
  
  // Port should be a number between 1024 and 65535
  return !isNaN(portNum) && portNum >= 1024 && portNum <= 65535;
};

describe('Input Validation Functions', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
      expect(validateEmail('user-name@sub.domain.com')).toBe(true);
    });
    
    it('should reject invalid email formats', () => {
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('test@example.')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });
  
  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('SecureP@ssw0rd')).toBe(true);
      expect(validatePassword('Abcdefg1')).toBe(true);
    });
    
    it('should reject weak passwords', () => {
      expect(validatePassword('pass')).toBe(false); // Too short
      expect(validatePassword('password')).toBe(false); // No uppercase or number
      expect(validatePassword('PASSWORD123')).toBe(false); // No lowercase
      expect(validatePassword('Password')).toBe(false); // No number
      expect(validatePassword('12345678')).toBe(false); // No letters
    });
  });
  
  describe('Username Validation', () => {
    it('should validate proper usernames', () => {
      expect(validateUsername('user')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('user_name')).toBe(true);
      expect(validateUsername('Username')).toBe(true);
    });
    
    it('should reject invalid usernames', () => {
      expect(validateUsername('us')).toBe(false); // Too short
      expect(validateUsername('a_very_long_username_that_exceeds_the_limit')).toBe(false); // Too long
      expect(validateUsername('user name')).toBe(false); // Contains space
      expect(validateUsername('user@name')).toBe(false); // Contains special character
      expect(validateUsername('user-name')).toBe(false); // Contains hyphen
    });
  });
  
  describe('Container Name Validation', () => {
    it('should validate proper container names', () => {
      expect(validateContainerName('app')).toBe(true);
      expect(validateContainerName('web-server')).toBe(true);
      expect(validateContainerName('database_1')).toBe(true);
      expect(validateContainerName('dev-env-2')).toBe(true);
    });
    
    it('should reject invalid container names', () => {
      expect(validateContainerName('a')).toBe(false); // Too short
      expect(validateContainerName('this-container-name-is-way-too-long-to-be-valid')).toBe(false); // Too long
      expect(validateContainerName('container name')).toBe(false); // Contains space
      expect(validateContainerName('container@name')).toBe(false); // Contains special character
      expect(validateContainerName('container.name')).toBe(false); // Contains period
    });
  });
  
  describe('Port Validation', () => {
    it('should validate proper port numbers', () => {
      expect(validatePortFixed(3000)).toBe(true);
      expect(validatePortFixed('8080')).toBe(true);
      expect(validatePortFixed(1024)).toBe(true);
      expect(validatePortFixed(65535)).toBe(true);
    });
    
    it('should reject invalid port numbers', () => {
      expect(validatePortFixed(80)).toBe(false); // Below 1024
      expect(validatePortFixed(70000)).toBe(false); // Above 65535
      expect(validatePortFixed('not-a-port')).toBe(false); // Not a number
      expect(validatePortFixed('3000a')).toBe(false); // Contains letters
      expect(validatePortFixed(NaN)).toBe(false); // Not a number
    });
  });
}); 