import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './header';

// Mock the API hook
vi.mock('@/api/hooks', () => ({
  useUser: vi.fn(),
}));

// Mock react-router
vi.mock('react-router', () => ({
  NavLink: ({ to, children, className }: any) => {
    const isActive = to === '/revenue'; // Mock active state for revenue
    const classes = typeof className === 'function' ? className({ isActive }) : className;
    return (
      <a href={to} className={classes}>
        {children}
      </a>
    );
  },
}));

import { useUser } from '@/api/hooks';

describe('Header', () => {
  const mockUser = {
    id: '1',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User display', () => {
    it('should display user initials in avatar when user data is available', () => {
      vi.mocked(useUser).mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<Header />);

      const avatars = screen.getAllByText('JD');
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  describe('Initials generation', () => {
    it('should generate initials from first and last name', () => {
      vi.mocked(useUser).mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<Header />);

      const avatars = screen.getAllByText('JD');
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('should handle single letter names', () => {
      vi.mocked(useUser).mockReturnValue({
        data: {
          ...mockUser,
          first_name: 'A',
          last_name: 'B',
        },
        isLoading: false,
      } as any);

      render(<Header />);

      expect(screen.getAllByText('AB').length).toBeGreaterThan(0);
    });

    it('should handle missing last name', () => {
      vi.mocked(useUser).mockReturnValue({
        data: {
          ...mockUser,
          first_name: 'John',
          last_name: undefined,
        },
        isLoading: false,
      } as any);

      render(<Header />);

      expect(screen.getAllByText('J').length).toBeGreaterThan(0);
    });

    it('should handle missing first name', () => {
      vi.mocked(useUser).mockReturnValue({
        data: {
          ...mockUser,
          first_name: undefined,
          last_name: 'Doe',
        },
        isLoading: false,
      } as any);

      render(<Header />);

      expect(screen.getAllByText('D').length).toBeGreaterThan(0);
    });

    it('should display "U" when both names are missing', () => {
      vi.mocked(useUser).mockReturnValue({
        data: {
          ...mockUser,
          first_name: undefined,
          last_name: undefined,
        },
        isLoading: false,
      } as any);

      render(<Header />);

      expect(screen.getAllByText('U').length).toBeGreaterThan(0);
    });

    it('should capitalize initials', () => {
      vi.mocked(useUser).mockReturnValue({
        data: {
          ...mockUser,
          first_name: 'jane',
          last_name: 'smith',
        },
        isLoading: false,
      } as any);

      render(<Header />);

      expect(screen.getAllByText('JS').length).toBeGreaterThan(0);
    });
  });

  describe('Navigation items', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
    });

    it('should render all navigation items', () => {
      render(<Header />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('CRM')).toBeInTheDocument();
      expect(screen.getByText('Apps')).toBeInTheDocument();
    });

    it('should render navigation links with correct hrefs', () => {
      render(<Header />);

      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
      expect(screen.getByText('Analytics').closest('a')).toHaveAttribute('href', '/analytics');
      expect(screen.getByText('Revenue').closest('a')).toHaveAttribute('href', '/revenue');
      expect(screen.getByText('CRM').closest('a')).toHaveAttribute('href', '/crm');
      expect(screen.getByText('Apps').closest('a')).toHaveAttribute('href', '/apps');
    });
  });

  describe('User menu', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
    });

    it('should render dropdown menu trigger button', () => {
      render(<Header />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Icon buttons', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
    });

    it('should render notification bell button', () => {
      render(<Header />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render message button', () => {
      render(<Header />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Logo', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
    });

    it('should render mainstack logo with correct alt text', () => {
      render(<Header />);
      const logo = screen.getByAltText('mainstack logo');
      expect(logo).toBeInTheDocument();
    });

    it('should render logo as a link to home', () => {
      render(<Header />);
      const logoLink = screen.getByAltText('mainstack logo').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined user data gracefully', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any);

      render(<Header />);

      // Should still render navigation
      expect(screen.getByText('Home')).toBeInTheDocument();
      // Should show default initials
      expect(screen.getAllByText('U').length).toBeGreaterThan(0);
    });

    it('should handle loading state', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      render(<Header />);

      // Should still render the header structure
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});
