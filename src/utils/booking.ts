import type { FormData } from '../types';

export interface BookingRecord {
  id: string;
  data: FormData;
  timestamp: number;
  status: 'pending' | 'confirmed';
}

const STORAGE_KEY = 'strato-nails-bookings';

function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SN-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function saveBooking(data: FormData): BookingRecord {
  const bookings = getBookings();
  const newBooking: BookingRecord = {
    id: generateBookingId(),
    data,
    timestamp: Date.now(),
    status: 'pending',
  };
  bookings.unshift(newBooking);
  if (bookings.length > 10) bookings.pop();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // localStorage not available
  }
  return newBooking;
}

export function getBookings(): BookingRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function clearBookings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}
