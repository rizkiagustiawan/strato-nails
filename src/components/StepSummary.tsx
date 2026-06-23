import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Building2, Banknote, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { StepProps } from '../types';

const WHATSAPP_NUMBER = '6283129009539';

export function StepSummary({ formData, updateData, onNext, onPrev, isSubmitting }: StepProps) {
  const { t, language } = useLanguage();

  const step4Schema = z.object({
    paymentMethod: z.enum(['Transfer', 'Cash'], {
      message: t('validationPaymentRequired'),
    }),
  });

  type Step4Data = z.infer<typeof step4Schema>;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      paymentMethod: formData.paymentMethod as 'Transfer' | 'Cash',
    },
  });

  const selectedPayment = useWatch({ control, name: 'paymentMethod' });

  const generateWhatsAppMessage = () => {
    const isId = language === 'id';
    const greeting = isId 
      ? `Halo Kak! 👋\nSaya ingin konfirmasi jadwal booking di Strato Nails, dengan detail berikut:` 
      : `Hi! 👋\nI would like to confirm my booking at Strato Nails with the following details:`;

    const msg = `${greeting}\n\n👤 *${isId ? 'Nama' : 'Name'}:* ${formData.name}\n📱 *${isId ? 'Kontak' : 'Contact'}:* ${formData.contact}\n📅 *${isId ? 'Tanggal' : 'Date'}:* ${formData.date ? new Date(formData.date).toLocaleDateString(isId ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}\n⏰ *${isId ? 'Waktu' : 'Time'}:* ${formData.time}\n💅 *${isId ? 'Perawatan' : 'Treatment'}:* ${formData.treatment}\n💰 *Budget:* ${formData.budget}\n💳 *${isId ? 'Pembayaran' : 'Payment'}:* ${formData.paymentMethod}\n\n${isId ? 'Apakah jadwal ini masih tersedia? Terima kasih! ✨' : 'Is this time slot still available? Thank you! ✨'}`;

    return encodeURIComponent(msg);
  };

  const onSubmit = (data: Step4Data) => {
    updateData(data);
    toast.success(t('toastBookingSuccess'));
    setTimeout(() => {
      toast.info(t('toastWhatsApp'));
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;
      window.open(whatsappUrl, '_blank');
    }, 500);
    onNext();
  };

  return (
    <div>
      <div className="widget-header">
        <h2 className="widget-title">{t('summaryTitle')}</h2>
        <p className="widget-desc">{t('summaryDesc')}</p>
      </div>

      <div className="summary-card" role="region" aria-label="Booking Summary">
        <div className="summary-row">
          <span className="summary-label">{t('summaryName')}</span>
          <span className="summary-value">{formData.name || '-'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{t('summaryContact')}</span>
          <span className="summary-value">{formData.contact || '-'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{t('summaryDateTime')}</span>
          <span className="summary-value">
            {formData.date
              ? new Date(formData.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')
              : '-'}{' '}
            at {formData.time || '-'}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{t('summaryTreatment')}</span>
          <span className="summary-value">{formData.treatment || '-'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{t('summaryBudget')}</span>
          <span className="summary-value">{formData.budget || '-'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="form-group" style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="form-label">{t('paymentLabel')}</legend>
          <div className="payment-options" role="radiogroup" aria-label="Select payment method">
            <label className={`payment-option ${selectedPayment === 'Transfer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="Transfer"
                checked={selectedPayment === 'Transfer'}
                onChange={() => {
                  setValue('paymentMethod', 'Transfer', { shouldValidate: true });
                  updateData({ paymentMethod: 'Transfer' });
                }}
                style={{ display: 'none' }}
                aria-label={t('transferTitle')}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} /> {t('transferTitle')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
                  {t('transferDesc').replace('your contact info', formData.contact || 'your contact info')}
                </div>
              </div>
            </label>
            <label className={`payment-option ${selectedPayment === 'Cash' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="Cash"
                checked={selectedPayment === 'Cash'}
                onChange={() => {
                  setValue('paymentMethod', 'Cash', { shouldValidate: true });
                  updateData({ paymentMethod: 'Cash' });
                }}
                style={{ display: 'none' }}
                aria-label={t('cashTitle')}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Banknote size={18} /> {t('cashTitle')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
                  {t('cashDesc')}
                </div>
              </div>
            </label>
          </div>
          {errors.paymentMethod && (
            <p className="error-text" role="alert">
              {errors.paymentMethod.message}
            </p>
          )}
        </fieldset>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? (
             <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
               ⏳ Submitting...
             </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {t('confirmBtn')} <Send size={18} />
            </span>
          )}
        </button>
        <button type="button" onClick={onPrev} className="btn btn-secondary">
          {t('goBack')}
        </button>
      </form>
    </div>
  );
}
