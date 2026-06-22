import { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { Sparkles, Download, CalendarPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { FormData } from '../types';

interface SuccessViewProps {
  formData: FormData;
  bookingId: string;
}

export function SuccessView({ formData, bookingId }: SuccessViewProps) {
  const { t } = useLanguage();
  const hasConfettied = useRef(false);

  useEffect(() => {
    if (hasConfettied.current) return;
    hasConfettied.current = true;

    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#d6b4b4', '#c49d9d', '#e8c4c4', '#f0d6d6', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const qrData = JSON.stringify({
    id: bookingId,
    name: formData.name,
    date: formData.date,
    time: formData.time,
    treatment: formData.treatment,
  });

  const handleDownloadQR = () => {
    const svg = document.querySelector('.qr-section svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `strato-nails-${bookingId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="booking-widget success-view" role="status" aria-live="polite">
      <div className="success-icon" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
        <Sparkles size={64} className="text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="success-title">{t('successTitle')}</h2>
      <p className="success-msg">{t('successMsg')}</p>

      <div className="qr-section">
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {t('bookingId')}:{' '}
          <span className="booking-id">{bookingId}</span>
        </p>
        <QRCodeSVG
          value={qrData}
          size={180}
          level="H"
          includeMargin
          style={{ display: 'block', margin: '0 auto' }}
        />
        <p className="qr-hint">{t('scanQR')}</p>
        <button className="btn-download" onClick={handleDownloadQR}>
          <Download size={16} /> {t('downloadQR')}
        </button>
      </div>

      <button
        className="btn"
        onClick={() => window.location.reload()}
        aria-label={t('bookAnother')}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <CalendarPlus size={18} /> {t('bookAnother')}
      </button>
    </div>
  );
}
