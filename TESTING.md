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

## Areas to Test Next

All core components and utilities are now tested! If you want to expand coverage further:

### Optional Additional Tests

1. **FilterSheet Component** (`src/components/review/filter-sheet.tsx`)
   - Very complex component with forms and multiple dependencies
   - Would require mocking react-hook-form, date-fns, and form interactions
   - Recommend integration testing over unit testing for this component

2. **API Client** (`src/api/api-client.ts`)
   - Test HTTP methods with mocked axios
   - Test request/response interceptors
   - Test error transformation and handling

3. **Query Hooks** (`src/api/hooks.ts`)
   - Test React Query hooks with QueryClientProvider
   - Test loading states, error states, and data refetching
   - Test staleTime and cache behavior

4. **Custom Hooks**
   - `useTransactionFilters` - Complex due to nuqs dependency
   - Other custom hooks as they're created

5. **Integration Tests**
   - Full page flows (e.g., user lands on page → filters transactions → exports)
   - Component interactions
   - End-to-end filter application
   - Data fetching and display flows

6. **E2E Tests** (using Playwright or Cypress)
   - Real browser testing
   - Full user journeys
   - Visual regression testing

## Best Practices

1. **Test behavior, not implementation** - Focus on what the user sees/experiences
2. **Use descriptive test names** - Clearly state what is being tested
3. **Arrange-Act-Assert pattern** - Organize tests clearly
4. **Keep tests independent** - Each test should run in isolation
5. **Use `toContain` for formatted strings** - Avoids issues with special characters
6. **Mock external dependencies** - Keep tests fast and reliable

## Common Testing Patterns

### Testing conditional rendering
```typescript
it('should show tooltip when provided', () => {
  render(<Component tooltip="Help text" />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

it('should hide tooltip when not provided', () => {
  render(<Component />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
```

### Testing with different prop values
```typescript
it.each([
  [0, '0.00'],
  [100, '100.00'],
  [1234.56, '1,234.56'],
])('should format %d as %s', (amount, expected) => {
  render(<Component amount={amount} />);
  expect(screen.getByText(new RegExp(expected))).toBeInTheDocument();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
