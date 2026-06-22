import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '../context/LanguageContext';
import type { StepProps } from '../types';

export function StepEssentials({ formData, updateData, onNext }: StepProps) {
  const { t } = useLanguage();

  const step1Schema = z.object({
    name: z.string().min(1, t('validationNameRequired')),
    contact: z.string().min(1, t('validationContactRequired')),
    date: z.string().min(1, t('validationDateRequired')),
    time: z.string().min(1, t('validationTimeRequired')),
  });

  type Step1Data = z.infer<typeof step1Schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name,
      contact: formData.contact,
      date: formData.date,
      time: formData.time,
    },
  });

  const onSubmit = (data: Step1Data) => {
    updateData(data);
    onNext();
  };

  return (
    <div>
      <div className="widget-header">
        <h2 className="widget-title">{t('essentialsTitle')}</h2>
        <p className="widget-desc">{t('essentialsDesc')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder={t('namePlaceholder')}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" className="error-text" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contact" className="form-label">
            {t('contactLabel')}
          </label>
          <input
            id="contact"
            type="text"
            className={`form-input ${errors.contact ? 'input-error' : ''}`}
            placeholder={t('contactPlaceholder')}
            aria-invalid={errors.contact ? 'true' : 'false'}
            aria-describedby={errors.contact ? 'contact-error' : undefined}
            {...register('contact')}
          />
          {errors.contact && (
            <p id="contact-error" className="error-text" role="alert">
              {errors.contact.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            {t('dateLabel')}
          </label>
          <input
            id="date"
            type="date"
            className={`form-input ${errors.date ? 'input-error' : ''}`}
            aria-invalid={errors.date ? 'true' : 'false'}
            aria-describedby={errors.date ? 'date-error' : undefined}
            {...register('date')}
          />
          {errors.date && (
            <p id="date-error" className="error-text" role="alert">
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="time" className="form-label">
            {t('timeLabel')}
          </label>
          <input
            id="time"
            type="time"
            className={`form-input ${errors.time ? 'input-error' : ''}`}
            aria-invalid={errors.time ? 'true' : 'false'}
            aria-describedby={errors.time ? 'time-error' : undefined}
            {...register('time')}
          />
          {errors.time && (
            <p id="time-error" className="error-text" role="alert">
              {errors.time.message}
            </p>
          )}
        </div>

        <button type="submit" className="btn">
          {t('nextStep')}
        </button>
      </form>
    </div>
  );
}
