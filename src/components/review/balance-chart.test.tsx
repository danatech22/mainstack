import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceChart } from './balance-chart';

// Mock the chart components
vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children, className }: any) => (
    <div data-testid="chart-container" className={className}>
      {children}
    </div>
  ),
  ChartTooltip: ({ children }: any) => <div>{children}</div>,
  ChartTooltipContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock recharts components
vi.mock('recharts', () => ({
  Line: () => null,
  LineChart: ({ children, data }: any) => (
    <div data-testid="line-chart" data-points={data?.length}>
      {children}
    </div>
  ),
  XAxis: () => null,
}));

describe('BalanceChart', () => {
  describe('Empty state', () => {
    it('should display no data message when transactions array is empty', () => {
      render(<BalanceChart transactions={[]} />);

      expect(screen.getByText('No transaction data available')).toBeInTheDocument();
    });

    it('should display no data message when transactions is undefined', () => {
      render(<BalanceChart />);

      expect(screen.getByText('No transaction data available')).toBeInTheDocument();
    });
  });

  describe('With transactions data', () => {
    const mockTransactions = [
      {
        amount: 1000,
        type: 'deposit' as const,
        status: 'successful',
        date: '2024-01-01',
      },
      {
        amount: 500,
        type: 'deposit' as const,
        status: 'successful',
        date: '2024-01-15',
      },
      {
        amount: 200,
        type: 'withdrawal' as const,
        status: 'successful',
        date: '2024-01-20',
      },
    ];

    it('should render chart container when data is available', () => {
      render(<BalanceChart transactions={mockTransactions} />);

      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });

    it('should render line chart when data is available', () => {
      render(<BalanceChart transactions={mockTransactions} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should process multiple transactions', () => {
      render(<BalanceChart transactions={mockTransactions} />);

      const chart = screen.getByTestId('line-chart');
      expect(chart).toBeInTheDocument();
      // Should have 3 data points for 3 different dates
      expect(chart.getAttribute('data-points')).toBe('3');
    });
  });

  describe('Transaction types', () => {
    it('should handle deposit transactions', () => {
      const deposits = [
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
      ];

      render(<BalanceChart transactions={deposits} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle withdrawal transactions', () => {
      const withdrawals = [
        {
          amount: 500,
          type: 'withdrawal' as const,
          status: 'successful',
          date: '2024-01-01',
        },
      ];

      render(<BalanceChart transactions={withdrawals} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle mix of deposits and withdrawals', () => {
      const mixed = [
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
        {
          amount: 300,
          type: 'withdrawal' as const,
          status: 'successful',
          date: '2024-01-02',
        },
      ];

      render(<BalanceChart transactions={mixed} />);

      const chart = screen.getByTestId('line-chart');
      expect(chart.getAttribute('data-points')).toBe('2');
    });
  });

  describe('Transaction status filtering', () => {
    it('should only process successful transactions', () => {
      const transactions = [
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
        {
          amount: 500,
          type: 'deposit' as const,
          status: 'pending',
          date: '2024-01-02',
        },
        {
          amount: 300,
          type: 'deposit' as const,
          status: 'failed',
          date: '2024-01-03',
        },
      ];

      render(<BalanceChart transactions={transactions} />);

      const chart = screen.getByTestId('line-chart');
      // Should only have 1 data point for the successful transaction
      expect(chart.getAttribute('data-points')).toBe('1');
    });

    it('should show no data message when all transactions are pending/failed', () => {
      const transactions = [
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'pending',
          date: '2024-01-01',
        },
        {
          amount: 500,
          type: 'deposit' as const,
          status: 'failed',
          date: '2024-01-02',
        },
      ];

      render(<BalanceChart transactions={transactions} />);

      expect(screen.getByText('No transaction data available')).toBeInTheDocument();
    });
  });

  describe('Date handling', () => {
    it('should handle transactions on the same date', () => {
      const transactions = [
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
        {
          amount: 500,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
      ];

      render(<BalanceChart transactions={transactions} />);

      const chart = screen.getByTestId('line-chart');
      // Should have 1 data point for the same date (combines transactions)
      expect(chart.getAttribute('data-points')).toBe('1');
    });

    it('should sort transactions by date', () => {
      const unsortedTransactions = [
        {
          amount: 500,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-15',
        },
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
        {
          amount: 200,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-10',
        },
      ];

      render(<BalanceChart transactions={unsortedTransactions} />);

      const chart = screen.getByTestId('line-chart');
      expect(chart.getAttribute('data-points')).toBe('3');
    });
  });

  describe('Edge cases', () => {
    it('should handle single transaction', () => {
      const singleTransaction = [
        {
          amount: 1000,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
      ];

      render(<BalanceChart transactions={singleTransaction} />);

      const chart = screen.getByTestId('line-chart');
      expect(chart.getAttribute('data-points')).toBe('1');
    });

    it('should handle large number of transactions', () => {
      const manyTransactions = Array.from({ length: 50 }, (_, i) => {
        const month = Math.floor(i / 30) + 1;
        const day = (i % 30) + 1;
        return {
          amount: 100,
          type: 'deposit' as const,
          status: 'successful',
          date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        };
      });

      render(<BalanceChart transactions={manyTransactions} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle zero amount transactions', () => {
      const zeroAmount = [
        {
          amount: 0,
          type: 'deposit' as const,
          status: 'successful',
          date: '2024-01-01',
        },
      ];

      render(<BalanceChart transactions={zeroAmount} />);

      const chart = screen.getByTestId('line-chart');
      expect(chart.getAttribute('data-points')).toBe('1');
    });
  });
});
