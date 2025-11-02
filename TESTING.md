# Testing Guide

This project uses **Vitest** and **React Testing Library** for unit and component testing.

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test:coverage
```

## Test Files

Tests are located alongside the source files with the `.test.ts` or `.test.tsx` extension:

- `src/lib/utils.test.ts` - Tests for utility functions
- `src/components/review/stat-card.test.tsx` - Tests for StatCard component

## Writing Tests

### Testing Utility Functions

For pure functions (no side effects), write straightforward unit tests:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  it('should format positive amounts correctly', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('USD');
    expect(result).toContain('1,234.56');
  });

  it('should handle zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0.00');
  });
});
```

### Testing React Components

Use `@testing-library/react` to test components:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('should render label correctly', () => {
    render(<StatCard label="Total Revenue" amount={1000} />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('should render formatted amount', () => {
    render(<StatCard label="Total Revenue" amount={1234.56} />);
    const amountElement = screen.getByText((content) =>
      content.includes('1,234.56')
    );
    expect(amountElement).toBeInTheDocument();
  });
});
```

### Testing with User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should handle button click', async () => {
  const user = userEvent.setup();
  render(<MyButton onClick={handleClick} />);

  await user.click(screen.getByRole('button'));
  // Add assertions
});
```

### Mocking Date/Time

```typescript
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-11-01T12:00:00Z'));
});
```

## Test Coverage

Current test coverage includes **124 tests** across 8 test files:

### Utility Functions (`src/lib/utils.ts`) - 37 tests
- ✓ `cn()` - Class name merging (4 tests)
- ✓ `formatCurrency()` - Currency formatting (5 tests)
- ✓ `formatDate()` - Date formatting (2 tests)
- ✓ `formatShortDate()` - Short date formatting (2 tests)
- ✓ `generateChartData()` - Chart data generation (5 tests)
- ✓ `getTransactionTitle()` - Transaction title logic (5 tests)
- ✓ `getTransactionSubtitle()` - Transaction subtitle logic (5 tests)
- ✓ `getDateRangeDescriptor()` - Date range descriptions (9 tests)

### Components - 81 tests
- ✓ `StatCard` (`src/components/review/stat-card.tsx`) - 7 tests
  - Label and amount rendering
  - Tooltip conditional rendering
  - Edge cases (zero, negative, large amounts)

- ✓ `TransactionItem` (`src/components/review/transaction-item.tsx`) - 12 tests
  - Deposit vs withdrawal rendering
  - Pending vs successful status display
  - Amount formatting with +/- signs
  - Transaction title and subtitle logic
  - Date formatting
  - Edge cases (no metadata, large amounts, zero)

- ✓ `BalanceCard` (`src/components/review/balance-card.tsx`) - 14 tests
  - Loading state display
  - Balance amount formatting
  - Withdraw button rendering
  - Chart component integration
  - All 4 StatCard components (Ledger Balance, Total Payout, Total Revenue, Pending Payout)
  - Edge cases (zero balance, large amounts, empty transactions)

- ✓ `TransactionList` (`src/components/review/transaction-list.tsx`) - 17 tests
  - Loading state handling
  - Transaction count display
  - Date range filtering (from, to, and combined)
  - Transaction type filtering (deposits, withdrawals, multiple types)
  - Transaction status filtering
  - Empty state with clear button
  - Filter badge display
  - Export button rendering
  - Edge cases (undefined data)

- ✓ `BalanceChart` (`src/components/review/balance-chart.tsx`) - 15 tests
  - Empty state handling
  - Chart rendering with data
  - Deposit and withdrawal processing
  - Mixed transaction types
  - Status filtering (successful only)
  - Date handling and sorting
  - Same date transaction aggregation
  - Edge cases (single transaction, large datasets, zero amounts)

- ✓ `Header` (`src/components/layout/header.tsx`) - 16 tests
  - User initials display in avatar
  - Initials generation logic (various edge cases)
  - Navigation items rendering
  - Navigation link hrefs
  - Dropdown menu trigger
  - Icon buttons (notifications, messages)
  - Logo display and link
  - Edge cases (undefined user, loading state)

### API Services (`src/api/services.ts`) - 6 tests
- ✓ `userService.getUser()` - API endpoint calls
- ✓ `walletService.getWallet()` - API endpoint calls
- ✓ `transactionService.getTransactions()` - API endpoint calls
- ✓ Error handling - Network errors and 404s
