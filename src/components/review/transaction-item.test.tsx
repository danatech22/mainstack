import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionItem } from './transaction-item';
import type { Transaction } from '@/types/revenue';

describe('TransactionItem', () => {
  const baseTransaction: Transaction = {
    amount: 1000,
    metadata: {
      name: 'John Doe',
      type: 'digital_product',
      email: 'john@example.com',
      quantity: 1,
      country: 'US',
      product_name: 'Test Product',
    },
    payment_reference: 'ref123',
    status: 'successful',
    type: 'deposit',
    date: '2024-01-15',
  };

  describe('Deposit transactions', () => {
    it('should show positive amount without minus sign', () => {
      render(<TransactionItem transaction={baseTransaction} />);

      const amountText = screen.getByText((content) => content.includes('1,000.00'));
      expect(amountText).toBeInTheDocument();
      expect(amountText.textContent).not.toContain('-USD');
    });

    it('should display product name as title', () => {
      render(<TransactionItem transaction={baseTransaction} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should display customer name as subtitle', () => {
      render(<TransactionItem transaction={baseTransaction} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Withdrawal transactions', () => {
    const withdrawalTransaction: Transaction = {
      ...baseTransaction,
      type: 'withdrawal',
      status: 'successful',
    };

    it('should show negative amount with minus sign', () => {
      render(<TransactionItem transaction={withdrawalTransaction} />);

      const amountText = screen.getByText((content) => content.includes('1,000.00'));
      expect(amountText.textContent).toContain('-');
    });

    it('should display "Cash withdrawal" as title', () => {
      render(<TransactionItem transaction={withdrawalTransaction} />);

      expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
    });

    it('should display "Successful" as subtitle for successful withdrawal', () => {
      render(<TransactionItem transaction={withdrawalTransaction} />);

      expect(screen.getByText('Successful')).toBeInTheDocument();
    });
  });

  describe('Pending transactions', () => {
    const pendingWithdrawal: Transaction = {
      ...baseTransaction,
      type: 'withdrawal',
      status: 'pending',
    };

    it('should display "Pending" as subtitle for pending withdrawal', () => {
      render(<TransactionItem transaction={pendingWithdrawal} />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Transaction with coffee type', () => {
    const coffeeTransaction: Transaction = {
      ...baseTransaction,
      metadata: {
        name: 'John Doe',
        type: 'coffee',
        email: 'john@example.com',
        quantity: 1,
        country: 'US',
      },
    };

    it('should display "Buy me a coffee" as title', () => {
      render(<TransactionItem transaction={coffeeTransaction} />);

      expect(screen.getByText('Buy me a coffee')).toBeInTheDocument();
    });
  });

  describe('Date formatting', () => {
    it('should format and display transaction date', () => {
      render(<TransactionItem transaction={baseTransaction} />);

      // Date should be formatted - looking for the month
      const dateElement = screen.getByText((content) => content.includes('Jan'));
      expect(dateElement).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle transaction without metadata', () => {
      const noMetadataTransaction: Transaction = {
        ...baseTransaction,
        metadata: undefined,
      };

      render(<TransactionItem transaction={noMetadataTransaction} />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('should handle large amounts', () => {
      const largeAmountTransaction: Transaction = {
        ...baseTransaction,
        amount: 1234567.89,
      };

      render(<TransactionItem transaction={largeAmountTransaction} />);

      const amountText = screen.getByText((content) =>
        content.includes('1,234,567.89')
      );
      expect(amountText).toBeInTheDocument();
    });

    it('should handle zero amount', () => {
      const zeroAmountTransaction: Transaction = {
        ...baseTransaction,
        amount: 0,
      };

      render(<TransactionItem transaction={zeroAmountTransaction} />);

      const amountText = screen.getByText((content) => content.includes('0.00'));
      expect(amountText).toBeInTheDocument();
    });
  });
});
