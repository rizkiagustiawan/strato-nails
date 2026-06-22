import { useLanguage } from '../context/LanguageContext';
import { getBookings, type BookingRecord } from '../utils/booking';
import { RotateCcw } from 'lucide-react';
import type { FormData } from '../types';

interface BookingHistoryProps {
  onRebook: (data: FormData) => void;
}

export function BookingHistory({ onRebook }: BookingHistoryProps) {
  const { t, language } = useLanguage();
  const bookings = getBookings();

  if (bookings.length === 0) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(
      language === 'id' ? 'id-ID' : 'en-US',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  return (
    <div className="booking-history">
      <h3 className="history-title">{t('recentBookings')}</h3>
      {bookings.slice(0, 3).map((booking: BookingRecord) => (
        <div key={booking.id} className="history-item">
          <div className="history-info">
            <span className="history-id">{booking.id}</span>
            <span className="history-date">{formatDate(booking.timestamp)}</span>
          </div>
          <button
            className="btn-rebook"
            onClick={() => onRebook(booking.data)}
            aria-label={`${t('rebook')} ${booking.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={14} /> {t('rebook')}
          </button>
        </div>
      ))}
    </div>
  );
}
