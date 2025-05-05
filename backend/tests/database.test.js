import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connectToDB } from '../util/database';

// Mock mongoose
vi.mock('mongoose', async () => {
  return {
    connect: vi.fn(),
    default: {
      connect: vi.fn()
    }
  };
});

// take from env
vi.stubEnv('CONNECTION_STR');

describe('Database Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should successfully connect to the database', async () => {
    // Set up the mock to resolve successfully
    const mongoose = await import('mongoose');
    mongoose.connect.mockResolvedValueOnce();

    // Call the function
    await connectToDB();

    // Assert that mongoose.connect was called with the correct connection string
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb+srv://');
  });

  it('should throw an error if connection fails', async () => {
    // Set up the mock to reject
    const mongoose = await import('mongoose');
    const testError = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(testError);

    // Expect connectToDB to throw the same error
    await expect(connectToDB()).rejects.toThrow(testError);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
}); 