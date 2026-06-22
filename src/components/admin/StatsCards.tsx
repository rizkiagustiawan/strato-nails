import { BarChart3, Clock, CheckCircle2, Star, CalendarHeart, CalendarRange } from 'lucide-react';
import type { BookingStats } from '../../services/api';

interface StatsCardsProps {
  stats: BookingStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card total">
        <div className="stat-icon"><BarChart3 size={24} /></div>
        <div className="stat-content">
          <span className="stat-value">{stats.total_bookings}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
      </div>
      
      <div className="stat-card pending">
        <div className="stat-icon"><Clock size={24} /></div>
        <div className="stat-content">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>
      
      <div className="stat-card confirmed">
        <div className="stat-icon"><CheckCircle2 size={24} /></div>
        <div className="stat-content">
          <span className="stat-value">{stats.confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
      </div>
      
      <div className="stat-card completed">
        <div className="stat-icon"><Star size={24} /></div>
        <div className="stat-content">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
      
      <div className="stat-card today">
        <div className="stat-icon"><CalendarHeart size={24} /></div>
        <div className="stat-content">
          <span className="stat-value">{stats.today}</span>
          <span className="stat-label">Today</span>
        </div>
      </div>
      
      <div className="stat-card week">
        <div className="stat-icon"><CalendarRange size={24} /></div>
        <div className="stat-content">
          <span className="stat-value">{stats.this_week}</span>
          <span className="stat-label">This Week</span>
        </div>
      </div>
    </div>
  );
}
