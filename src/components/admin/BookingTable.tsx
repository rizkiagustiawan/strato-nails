import { MessageCircle, Trash2, ClipboardList } from 'lucide-react';
import type { Booking } from '../../services/api';

interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export function BookingTable({ bookings, loading, onStatusChange, onDelete }: BookingTableProps) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><ClipboardList size={48} strokeWidth={1.5} /></span>
        <h3>No bookings found</h3>
        <p>Bookings will appear here when customers make appointments.</p>
      </div>
    );
  }

  const generateAdminMessage = (booking: Booking) => {
    const dateStr = new Date(booking.date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let msg = `Halo Kak ${booking.name},\nIni pesan dari Strato Nails.\n\n`;

    if (booking.status === 'confirmed') {
      msg += `Jadwal booking Kakak telah kami *KONFIRMASI*.\n\n*Detail Jadwal:*\n- Tanggal: ${dateStr}\n- Jam: ${booking.time}\n- Treatment: ${booking.treatment}\n\nMohon berkenan untuk hadir tepat waktu sesuai jadwal yang telah ditentukan. Jika ada kendala atau membutuhkan perubahan jadwal, silakan membalas pesan ini.\n\nTerima kasih dan sampai jumpa.`;
    } else if (booking.status === 'completed') {
      msg += `Terima kasih banyak telah mempercayakan perawatan kuku Kakak di Strato Nails.\n\nKami berharap Kakak puas dengan hasil treatment kami (${booking.treatment}). Kami menantikan kedatangan Kakak kembali.`;
    } else if (booking.status === 'cancelled') {
      msg += `Mohon maaf, jadwal booking Kakak untuk hari ${dateStr} pukul ${booking.time} terpaksa kami *BATALKAN*.\n\nSilakan membalas pesan ini apabila Kakak ingin melakukan penjadwalan ulang ke hari lain. Terima kasih atas pengertiannya.`;
    } else {
      msg += `Kami telah menerima pesanan booking Kakak untuk:\nTanggal: ${dateStr}\nJam: ${booking.time}\nTreatment: ${booking.treatment}\n\nSaat ini status pesanan Kakak masih *Pending*. Kami akan segera mengabari Kakak lebih lanjut untuk konfirmasi ketersediaan jadwal. Terima kasih.`;
    }

    return encodeURIComponent(msg);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="table-container">
      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Time</th>
            <th>Treatment</th>
            <th>Reference</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td className="booking-id">{booking.booking_id}</td>
              <td>{booking.name}</td>
              <td>{booking.contact}</td>
              <td>{formatDate(booking.date)}</td>
              <td>{booking.time}</td>
              <td>{booking.treatment}</td>
              <td>
                {booking.photo_url ? (
                  <a href={booking.photo_url} target="_blank" rel="noopener noreferrer" className="reference-link" title="View Reference Photo">
                    <img src={booking.photo_url} alt="Ref" className="reference-thumb" />
                  </a>
                ) : (
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>No photo</span>
                )}
              </td>
              <td>
                <select
                  value={booking.status}
                  onChange={(e) => onStatusChange(booking.booking_id, e.target.value)}
                  className={`status-select ${booking.status}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action btn-whatsapp"
                    onClick={() => {
                      const msg = generateAdminMessage(booking);
                      window.open(`https://wa.me/${booking.contact.replace(/^0/, '62')}?text=${msg}`, '_blank');
                    }}
                    title="Send WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(booking.booking_id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
