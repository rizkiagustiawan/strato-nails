import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsCards } from './StatsCards';
import type { BookingStats } from '../../services/api';

const mockStats: BookingStats = {
  total_bookings: 42,
  pending: 5,
  confirmed: 10,
  completed: 25,
  cancelled: 2,
  today: 3,
  this_week: 8,
};

describe('StatsCards', () => {
  it('renders all stat cards', () => {
    const { getByText } = render(<StatsCards stats={mockStats} />);
    
    expect(getByText('42')).toBeInTheDocument();
    expect(getByText('Total Bookings')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('Pending')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('Confirmed')).toBeInTheDocument();
    expect(getByText('25')).toBeInTheDocument();
    expect(getByText('Completed')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('Today')).toBeInTheDocument();
    expect(getByText('8')).toBeInTheDocument();
    expect(getByText('This Week')).toBeInTheDocument();
  });

  it('renders zero values correctly', () => {
    const zeroStats: BookingStats = {
      total_bookings: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      today: 0,
      this_week: 0,
    };
    
    const { getAllByText } = render(<StatsCards stats={zeroStats} />);
    const zeroElements = getAllByText('0');
    expect(zeroElements.length).toBe(6);
  });
});
