import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepEssentials } from './StepEssentials';
import { StepStyle } from './StepStyle';
import { StepTreatment } from './StepTreatment';
import { StepSummary } from './StepSummary';
import { SuccessView } from './SuccessView';
import { BookingHistory } from './BookingHistory';
import { useLanguage } from '../context/LanguageContext';
import { saveBooking } from '../utils/booking';
import { api } from '../services/api';
import { toast } from 'sonner';
import type { FormData } from '../types';

const initialData: FormData = {
  name: '',
  contact: '',
  date: '',
  time: '',
  budget: '',
  photoUrl: null,
  treatment: '',
  paymentMethod: 'Transfer',
};

export function BookingWidget() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateData = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        // Try to save to API first
        const response = await api.createBooking({
          name: formData.name,
          contact: formData.contact,
          date: formData.date,
          time: formData.time,
          treatment: formData.treatment,
          budget: formData.budget,
          payment_method: formData.paymentMethod,
          photo_url: formData.photoUrl,
        });

        if (response.success && response.data) {
          setBookingId(response.data.booking_id);
          setIsSuccess(true);
        } else {
          // Fallback to local storage
          const booking = saveBooking(formData);
          setBookingId(booking.id);
          setIsSuccess(true);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('Time slot is already booked')) {
          toast.error(error.message);
          setIsSubmitting(false);
          setCurrentStep(1); // Go back to step 1 to pick a new date/time
          return;
        }
        
        // Fallback to local storage if API fails for other reasons
        const booking = saveBooking(formData);
        setBookingId(booking.id);
        setIsSuccess(true);
      }
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleRebook = (data: FormData) => {
    setFormData(data);
    setCurrentStep(1);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <SuccessView formData={formData} bookingId={bookingId} />
      </motion.div>
    );
  }

  const stepLabels = [t('step1'), t('step2'), t('step3'), t('step4')];

  return (
    <div className="booking-widget" role="form" aria-label="Nail Appointment Booking">
      <nav className="step-indicator" aria-label="Booking Steps">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`step-dot ${
              step === currentStep ? 'active' : step < currentStep ? 'completed' : ''
            }`}
            aria-current={step === currentStep ? 'step' : undefined}
            aria-label={`Step ${step}: ${stepLabels[step - 1]}`}
          >
            {step < currentStep ? '✓' : step}
          </div>
        ))}
      </nav>

      <section aria-live="polite" style={{ overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentStep === 1 && (
              <StepEssentials
                formData={formData}
                updateData={updateData}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <StepStyle
                formData={formData}
                updateData={updateData}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 3 && (
              <StepTreatment
                formData={formData}
                updateData={updateData}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 4 && (
              <StepSummary
                formData={formData}
                updateData={updateData}
                onNext={handleNext}
                onPrev={handlePrev}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <BookingHistory onRebook={handleRebook} />
    </div>
  );
}
