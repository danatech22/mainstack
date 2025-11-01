import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceCard } from './balance-card';

// Mock the API hooks
vi.mock('@/api/hooks', () => ({
  useWallet: vi.fn(),
  useTransactions: vi.fn(),
}));

// Mock the child components
vi.mock('./stat-card', () => ({
  StatCard: ({ label, amount, tooltip }: any) => (
    <div data-testid="stat-card">
      <span>{label}</span>
      <span>{amount}</span>
      {tooltip && <span>{tooltip}</span>}
    </div>
  ),
}));

vi.mock('./balance-chart', () => ({
  BalanceChart: ({ transactions }: any) => (
    <div data-testid="balance-chart">Chart with {transactions?.length || 0} transactions</div>
  ),
}));

import { useWallet, useTransactions } from '@/api/hooks';

describe('BalanceCard', () => {
  const mockWallet = {
    balance: 5000.0,
    total_payout: 10000.0,
    total_revenue: 15000.0,
    pending_payout: 500.0,
    currency: 'USD',
    ledger_balance: 5500.0,
  };

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading message when wallet data is loading', () => {
      vi.mocked(useWallet).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);
      vi.mocked(useTransactions).mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any);

      render(<BalanceCard />);

      expect(screen.getByText('Loading Wallet...')).toBeInTheDocument();
    });
  });

  describe('Loaded state', () => {
    beforeEach(() => {
      vi.mocked(useWallet).mockReturnValue({
        data: mockWallet,
        isLoading: false,
      } as any);
      vi.mocked(useTransactions).mockReturnValue({
        data: mockTransactions,
        isLoading: false,
      } as any);
    });

    it('should display "Available Balance" label', () => {
      render(<BalanceCard />);

      expect(screen.getByText('Available Balance')).toBeInTheDocument();
    });

    it('should display formatted balance amount', () => {
      render(<BalanceCard />);

      const balanceElement = screen.getByText((content) =>
        content.includes('5,000.00')
      );
      expect(balanceElement).toBeInTheDocument();
    });

    it('should render Withdraw button', () => {
      render(<BalanceCard />);

      const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
      expect(withdrawButton).toBeInTheDocument();
    });

    it('should render BalanceChart component', () => {
      render(<BalanceCard />);

      expect(screen.getByTestId('balance-chart')).toBeInTheDocument();
    });

    it('should pass transactions to BalanceChart', () => {
      render(<BalanceCard />);

      expect(screen.getByText(/Chart with 1 transactions/)).toBeInTheDocument();
    });

    describe('StatCard rendering', () => {
      it('should render Ledger Balance StatCard', () => {
        render(<BalanceCard />);

        expect(screen.getByText('Ledger Balance')).toBeInTheDocument();
        expect(screen.getByText('5500')).toBeInTheDocument();
      });

      it('should render Total Payout StatCard', () => {
        render(<BalanceCard />);

        expect(screen.getByText('Total Payout')).toBeInTheDocument();
        expect(screen.getByText('10000')).toBeInTheDocument();
      });

      it('should render Total Revenue StatCard', () => {
        render(<BalanceCard />);

        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText('15000')).toBeInTheDocument();
      });

      it('should render Pending Payout StatCard', () => {
        render(<BalanceCard />);

        expect(screen.getByText('Pending Payout')).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
      });

      it('should render all 4 StatCards', () => {
        render(<BalanceCard />);

        const statCards = screen.getAllByTestId('stat-card');
        expect(statCards).toHaveLength(4);
      });
    });

    describe('Edge cases', () => {
      it('should handle zero balance', () => {
        vi.mocked(useWallet).mockReturnValue({
          data: { ...mockWallet, balance: 0 },
          isLoading: false,
        } as any);

        render(<BalanceCard />);

        const balanceElement = screen.getByText((content) =>
          content.includes('0.00')
        );
        expect(balanceElement).toBeInTheDocument();
      });

      it('should handle large balance amounts', () => {
        vi.mocked(useWallet).mockReturnValue({
          data: { ...mockWallet, balance: 1234567.89 },
          isLoading: false,
        } as any);

        render(<BalanceCard />);

        const balanceElement = screen.getByText((content) =>
          content.includes('1,234,567.89')
        );
        expect(balanceElement).toBeInTheDocument();
      });

      it('should handle empty transactions array', () => {
        vi.mocked(useTransactions).mockReturnValue({
          data: [],
          isLoading: false,
        } as any);

        render(<BalanceCard />);

        expect(screen.getByText(/Chart with 0 transactions/)).toBeInTheDocument();
      });
    });
  });
});
