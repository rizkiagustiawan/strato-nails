import { useState } from 'react';
import { useBookings, useBookingStats } from '../../hooks/useApi';
import { StatsCards } from './StatsCards';
import { BookingTable } from './BookingTable';
import { LayoutDashboard, CalendarDays, RefreshCw, Flame, ClipboardList, Sparkles, LogOut } from 'lucide-react';
import type { Booking } from '../../services/api';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { stats, recentBookings, popularTreatments, fetchStats } = useBookingStats();
  const { bookings, loading: bookingsLoading, updateStatus, deleteBooking, fetchBookings } = useBookings({ status: statusFilter });

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateStatus(id, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
      fetchStats();
    } else {
      toast.error(`Failed to update status: ${result.error || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const result = await deleteBooking(id);
      if (result.success) {
        toast.success('Booking deleted successfully');
        fetchStats();
      } else {
        toast.error(`Failed to delete: ${result.error || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={24} /> Strato Nails Admin
        </h1>
        <nav className="admin-nav">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CalendarDays size={16} /> Bookings
          </button>
          <button className="btn-refresh" onClick={() => { fetchStats(); fetchBookings(); }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn-logout" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer', padding: '0.6rem', marginLeft: '0.5rem' }}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="admin-content">
        {activeTab === 'dashboard' ? (
          <div className="dashboard-grid">
            {stats && <StatsCards stats={stats} />}
            
            <div className="admin-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={18} /> Recent Bookings
              </h3>
              {recentBookings.length > 0 ? (
                <div className="recent-list">
                  {recentBookings.map((booking: Booking) => (
                    <div key={booking.booking_id} className="recent-item">
                      <div>
                        <span className="booking-id">{booking.booking_id}</span>
                        <span className="booking-name">{booking.name}</span>
                      </div>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No recent bookings</p>
              )}
            </div>

            <div className="admin-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={18} className="text-warning" /> Popular Treatments
              </h3>
              {popularTreatments.length > 0 ? (
                <div className="treatment-stats">
                  {popularTreatments.map((item) => (
                    <div key={item.treatment} className="treatment-stat-item">
                      <span className="treatment-name">{item.treatment}</span>
                      <div className="stat-bar">
                        <div 
                          className="stat-fill" 
                          style={{ width: `${(item.count / (popularTreatments[0]?.count || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="stat-count">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No data yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bookings-section">
            <div className="bookings-header">
              <h2>All Bookings</h2>
              <div className="filter-group">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <BookingTable
              bookings={bookings}
              loading={bookingsLoading}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}
