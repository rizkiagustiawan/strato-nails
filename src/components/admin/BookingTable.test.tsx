import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookingTable } from './BookingTable';
import type { Booking } from '../../services/api';

const mockBookings: Booking[] = [
  {
    id: 1,
    booking_id: 'SN-ABC123',
    name: 'Jane Doe',
    contact: '083129009539',
    date: '2026-06-25',
    time: '14:00',
    treatment: 'Manicure Only',
    budget: '100k - 200k IDR',
    payment_method: 'Transfer',
    status: 'pending',
    notes: null,
    whatsapp_sent: false,
    created_at: '2026-06-20T10:00:00Z',
    updated_at: '2026-06-20T10:00:00Z',
  },
  {
    id: 2,
    booking_id: 'SN-DEF456',
    name: 'John Smith',
    contact: '081234567890',
    date: '2026-06-26',
    time: '15:30',
    treatment: 'Nail Art Extensions',
    budget: '300k+ IDR',
    payment_method: 'Cash',
    status: 'confirmed',
    notes: null,
    whatsapp_sent: true,
    created_at: '2026-06-20T11:00:00Z',
    updated_at: '2026-06-20T11:00:00Z',
  },
];

describe('BookingTable', () => {
  it('renders loading state', () => {
    const { getByText } = render(
      <BookingTable
        bookings={[]}
        loading={true}
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(getByText('Loading bookings...')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    const { getByText } = render(
      <BookingTable
        bookings={[]}
        loading={false}
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(getByText('No bookings found')).toBeInTheDocument();
  });

  it('renders bookings correctly', () => {
    const { getByText } = render(
      <BookingTable
        bookings={mockBookings}
        loading={false}
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    
    expect(getByText('SN-ABC123')).toBeInTheDocument();
    expect(getByText('Jane Doe')).toBeInTheDocument();
    expect(getByText('SN-DEF456')).toBeInTheDocument();
    expect(getByText('John Smith')).toBeInTheDocument();
  });

  it('calls onStatusChange when status is changed', () => {
    const onStatusChange = vi.fn();
    const { getAllByRole } = render(
      <BookingTable
        bookings={mockBookings}
        loading={false}
        onStatusChange={onStatusChange}
        onDelete={vi.fn()}
      />
    );
    
    const selects = getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'confirmed' } });
    expect(onStatusChange).toHaveBeenCalledWith('SN-ABC123', 'confirmed');
  });
});
