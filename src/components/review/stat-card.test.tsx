import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('should render label correctly', () => {
    render(<StatCard label="Total Revenue" amount={1000} />);

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('should render formatted currency amount', () => {
    render(<StatCard label="Total Revenue" amount={1234.56} />);

    const amountElement = screen.getByText((content) => content.includes('1,234.56'));
    expect(amountElement).toBeInTheDocument();
  });

  it('should render tooltip icon when tooltip prop is provided', () => {
    render(
      <StatCard
        label="Total Revenue"
        amount={1000}
        tooltip="This is total revenue for the period"
      />
    );

    const tooltipButton = screen.getByRole('button');
    expect(tooltipButton).toBeInTheDocument();
  });

  it('should not render tooltip icon when tooltip prop is not provided', () => {
    render(<StatCard label="Total Revenue" amount={1000} />);

    const tooltipButton = screen.queryByRole('button');
    expect(tooltipButton).not.toBeInTheDocument();
  });

  it('should handle zero amount', () => {
    render(<StatCard label="Balance" amount={0} />);

    const amountElement = screen.getByText((content) => content.includes('0.00'));
    expect(amountElement).toBeInTheDocument();
  });

  it('should handle negative amounts', () => {
    render(<StatCard label="Deficit" amount={-500} />);

    const amountElement = screen.getByText((content) => content.includes('500'));
    expect(amountElement).toBeInTheDocument();
  });

  it('should handle large amounts with proper formatting', () => {
    render(<StatCard label="Total" amount={1234567.89} />);

    const amountElement = screen.getByText((content) => content.includes('1,234,567.89'));
    expect(amountElement).toBeInTheDocument();
  });
});
