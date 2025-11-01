# Mainstack Revenue Dashboard

A modern, responsive revenue dashboard built with React, TypeScript, and Vite. This application provides real-time insights into transactions, wallet balance, and revenue metrics.

## Features

- 📊 **Interactive Balance Chart** - Visualize revenue trends over time
- 💰 **Wallet Overview** - Track balance, payouts, and revenue
- 📝 **Transaction Management** - View and filter all transactions
- 🔍 **Advanced Filtering** - Filter by date range, transaction type, and status
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ✅ **Comprehensive Testing** - 124 unit tests with full coverage

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v7
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
```

## Project Structure

```
src/
├── api/              # API client and React Query hooks
├── assets/           # Static assets (images, icons)
├── components/       # React components
│   ├── layout/       # Layout components (Header, Navigation)
│   ├── review/       # Revenue-specific components
│   └── ui/           # Reusable UI components (shadcn/ui)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── test/             # Test setup and utilities
```

## Testing

This project has comprehensive unit test coverage with 124 tests.

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm test:ui

# Generate coverage report
npm test:coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests in watch mode
- `npm test:ui` - Run tests with interactive UI
- `npm test:coverage` - Generate test coverage report

## Key Features Explained

### Transaction Filtering

The application supports advanced filtering:
- **Date Range**: Filter transactions by custom date ranges or presets (Today, Last 7 days, This Month, Last 3 months)
- **Transaction Type**: Filter by Store Transactions, Tips, Withdrawals, Chargebacks, etc.
- **Status**: Filter by Successful, Pending, or Failed transactions

### Chart Visualization

The balance chart displays:
- Running balance over time
- Automatic calculation of deposits and withdrawals
- Only includes successful transactions
- Smooth line interpolation for better visualization

### Responsive Design

- Mobile-first approach
- Adaptive layouts for tablets and desktops
- Touch-friendly interactions
- Optimized for all screen sizes

## Code Quality

- ✅ TypeScript for type safety
- ✅ ESLint for code linting
- ✅ Comprehensive unit tests
- ✅ Component-based architecture
- ✅ Custom hooks for reusable logic
- ✅ Proper error handling

## Performance Optimizations

- Code splitting with dynamic imports
- React Query for efficient data caching
- Memoization of expensive calculations
- Optimized bundle size with tree shaking
- Lazy loading of components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a assessment project. For production use, consider:

1. Adding E2E tests with Playwright/Cypress
2. Implementing error boundaries
3. Adding analytics tracking
4. Setting up CI/CD pipeline
5. Adding monitoring and logging
6. Implementing progressive web app (PWA) features

## License

This project is created for assessment purposes.

## Contact

For questions or feedback, please reach out to the project maintainer.
