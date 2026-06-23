import { useState, useCallback, useEffect } from 'react';
import { api, type Booking, type BookingStats } from '../services/api';

interface UseBookingsOptions {
  status?: string;
  limit?: number;
  autoFetch?: boolean;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { status, limit = 50, autoFetch = true } = options;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, limit, offset: 0 });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getBookings({ status, limit });
      if (response.success && response.data) {
        setBookings(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        localStorage.removeItem('admin_token');
        window.location.reload();
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [status, limit]);

  const updateStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      const response = await api.updateBooking(id, { status: newStatus });
      if (response.success) {
        setBookings((prev) =>
          prev.map((b) => (b.booking_id === id ? { ...b, status: newStatus as Booking['status'] } : b))
        );
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update booking';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    try {
      const response = await api.deleteBooking(id);
      if (response.success) {
        setBookings((prev) => prev.filter((b) => b.booking_id !== id));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        localStorage.removeItem('admin_token');
        window.location.reload();
      }
      const errMsg = err instanceof Error ? err.message : 'Failed to delete booking';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      const loadData = async () => {
        await fetchBookings();
      };
      loadData();
    }
  }, [autoFetch, fetchBookings]);

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    updateStatus,
    deleteBooking,
  };
}

export function useBookingStats() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [popularTreatments, setPopularTreatments] = useState<{ treatment: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getStats();
      if (response.success && response.data) {
        setStats(response.data.stats);
        setRecentBookings(response.data.recentBookings);
        setPopularTreatments(response.data.popularTreatments);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        localStorage.removeItem('admin_token');
        window.location.reload();
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      await fetchStats();
    };
    loadStats();
  }, [fetchStats]);

  return {
    stats,
    recentBookings,
    popularTreatments,
    loading,
    error,
    fetchStats,
  };
}
