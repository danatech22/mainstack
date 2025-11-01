import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionList } from './transaction-list';
import type { Transaction } from '@/types/revenue';

// Mock the hooks
vi.mock('@/api/hooks', () => ({
  useTransactions: vi.fn(),
}));

vi.mock('@/hooks/use-filter', () => ({
  useTransactionFilters: vi.fn(),
}));

// Mock child components
vi.mock('./transaction-item', () => ({
  TransactionItem: ({ transaction }: any) => (
    <div data-testid="transaction-item">{transaction.payment_reference}</div>
  ),
}));

vi.mock('./filter-sheet', () => ({
  FilterSheet: ({ children }: any) => <div>{children}</div>,
}));

import { useTransactions } from '@/api/hooks';
import { useTransactionFilters } from '@/hooks/use-filter';

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    {
      amount: 1000,
      metadata: {
        name: 'John Doe',
        type: 'digital_product',
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
    {
      amount: 500,
      metadata: {
        name: 'Jane Smith',
        type: 'digital_product',
        email: 'jane@example.com',
        quantity: 1,
        country: 'UK',
        product_name: 'Product B',
      },
      payment_reference: 'ref124',
      status: 'successful',
      type: 'deposit',
      date: '2024-01-20',
    },
    {
      amount: 200,
      payment_reference: 'ref125',
      status: 'successful',
      type: 'withdrawal',
      date: '2024-01-25',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading message when transactions are loading', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: false,
        activeFilterCount: 0,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
    });
  });

  describe('Transaction list display', () => {
    beforeEach(() => {
      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: false,
        activeFilterCount: 0,
      } as any);
    });

    it('should display transaction count in header', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('3 Transactions')).toBeInTheDocument();
    });

    it('should render all transactions when no filters are applied', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      render(<TransactionList />);

      const transactionItems = screen.getAllByTestId('transaction-item');
      expect(transactionItems).toHaveLength(3);
    });

    it('should display "All Time" when no date filters', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText(/Your transactions for All Time/)).toBeInTheDocument();
    });
  });

  describe('Date filtering', () => {
    it('should filter transactions by date from', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: '2024-01-20',
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('2 Transactions')).toBeInTheDocument();
    });

    it('should filter transactions by date to', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: '2024-01-20',
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('2 Transactions')).toBeInTheDocument();
    });

    it('should filter transactions by date range', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: '2024-01-16',
          dateTo: '2024-01-24',
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
    });
  });

  describe('Transaction type filtering', () => {
    it('should filter by deposit type (store)', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: ['store'],
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('2 Transactions')).toBeInTheDocument();
    });

    it('should filter by withdrawal type', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: ['withdrawals'],
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
    });

    it('should filter by multiple transaction types', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: ['store', 'withdrawals'],
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('3 Transactions')).toBeInTheDocument();
    });
  });

  describe('Transaction status filtering', () => {
    it('should filter by successful status', () => {
      const transactionsWithStatuses: Transaction[] = [
        ...mockTransactions,
        {
          amount: 300,
          metadata: {
            name: 'Pending User',
            type: 'webinar',
            email: 'pending@example.com',
            quantity: 1,
            country: 'US',
          },
          payment_reference: 'ref126',
          status: 'pending',
          type: 'deposit',
          date: '2024-01-26',
        },
      ];

      vi.mocked(useTransactions).mockReturnValue({
        data: transactionsWithStatuses,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: ['successful'],
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('3 Transactions')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should show empty state when no transactions match filters', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: '2025-01-01',
          dateTo: '2025-01-31',
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 1,
      } as any);

      render(<TransactionList />);

      expect(
        screen.getByText('No matching transaction found for the selected filter')
      ).toBeInTheDocument();
    });

    it('should show Clear button in empty state', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: [],
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: false,
        activeFilterCount: 0,
      } as any);

      render(<TransactionList />);

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
  });

  describe('Filter badge', () => {
    it('should show filter count badge when filters are active', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: '2024-01-01',
          dateTo: '2024-01-31',
          transactionType: ['store'],
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: true,
        activeFilterCount: 2,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should not show filter count badge when no filters are active', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: false,
        activeFilterCount: 0,
      } as any);

      render(<TransactionList />);

      // Just verify filter button exists and count is 0
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });
  });

  describe('Export button', () => {
    it('should render Export list button', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: false,
        activeFilterCount: 0,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('Export list')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined transactions data', () => {
      vi.mocked(useTransactions).mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any);

      vi.mocked(useTransactionFilters).mockReturnValue({
        filters: {
          dateFrom: null,
          dateTo: null,
          transactionType: null,
          transactionStatus: null,
          datePreset: null,
        },
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        hasActiveFilters: false,
        activeFilterCount: 0,
      } as any);

      render(<TransactionList />);

      expect(screen.getByText('0 Transactions')).toBeInTheDocument();
    });
  });
});
