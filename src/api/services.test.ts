import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService, walletService, transactionService } from './services';
import api from './api-client';

// Mock the api-client module
vi.mock('./api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.get with correct endpoint for getUser', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    };

    vi.mocked(api.get).mockResolvedValue(mockUser);

    const result = await userService.getUser();

    expect(api.get).toHaveBeenCalledWith('/user');
    expect(result).toEqual(mockUser);
  });
});

describe('walletService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.get with correct endpoint for getWallet', async () => {
    const mockWallet = {
      balance: 5000,
      total_payout: 10000,
      total_revenue: 15000,
      pending_payout: 500,
      currency: 'USD',
      ledger_balance: 5500,
    };

    vi.mocked(api.get).mockResolvedValue(mockWallet);

    const result = await walletService.getWallet();

    expect(api.get).toHaveBeenCalledWith('/wallet');
    expect(result).toEqual(mockWallet);
  });
});

describe('transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.get with correct endpoint for getTransactions', async () => {
    const mockTransactions = [
      {
        amount: 100,
        metadata: {
          name: 'John Doe',
          type: 'deposit',
          email: 'john@example.com',
          quantity: 1,
          country: 'US',
          product_name: 'Product A',
        },
        payment_reference: 'ref123',
        status: 'successful',
        type: 'deposit',
        date: '2024-01-15',
      },
    ];

    vi.mocked(api.get).mockResolvedValue(mockTransactions);

    const result = await transactionService.getTransactions();

    expect(api.get).toHaveBeenCalledWith('/transactions');
    expect(result).toEqual(mockTransactions);
  });

  it('should handle empty transaction list', async () => {
    vi.mocked(api.get).mockResolvedValue([]);

    const result = await transactionService.getTransactions();

    expect(api.get).toHaveBeenCalledWith('/transactions');
    expect(result).toEqual([]);
  });
});

describe('API error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should propagate errors from api client', async () => {
    const mockError = new Error('Network error');
    vi.mocked(api.get).mockRejectedValue(mockError);

    await expect(userService.getUser()).rejects.toThrow('Network error');
  });

  it('should handle 404 errors', async () => {
    const notFoundError = new Error('Not found');
    vi.mocked(api.get).mockRejectedValue(notFoundError);

    await expect(walletService.getWallet()).rejects.toThrow('Not found');
  });
});
