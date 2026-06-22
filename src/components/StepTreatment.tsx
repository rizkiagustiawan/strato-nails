import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '../context/LanguageContext';
import type { StepProps } from '../types';

import img1 from '../assets/images/image 1.webp';
import img2 from '../assets/images/image 2.webp';
import img3 from '../assets/images/image 3.webp';
import img4 from '../assets/images/image 4.webp';
import img5 from '../assets/images/image 5.webp';

export function StepTreatment({ formData, updateData, onNext, onPrev }: StepProps) {
  const { t } = useLanguage();

  const step3Schema = z.object({
    treatment: z.string().min(1, t('validationTreatmentRequired')),
  });

  type Step3Data = z.infer<typeof step3Schema>;

  const treatments = [
    {
      id: 'Manicure Only',
      title: t('manicureTitle'),
      desc: t('manicureDesc'),
      img: img1,
    },
    {
      id: 'Nail Art Extensions',
      title: t('artExtTitle'),
      desc: t('artExtDesc'),
      img: img2,
    },
    {
      id: 'Nail Extensions Plain Color',
      title: t('plainExtTitle'),
      desc: t('plainExtDesc'),
      img: img3,
    },
    {
      id: 'Nail Art on Natural Nails',
      title: t('artNaturalTitle'),
      desc: t('artNaturalDesc'),
      img: img4,
    },
    {
      id: 'Natural Nails Plain Color',
      title: t('plainNaturalTitle'),
      desc: t('plainNaturalDesc'),
      img: img5,
    },
  ];

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      treatment: formData.treatment,
    },
  });

  const selectedTreatment = useWatch({ control, name: 'treatment' });

  const onSubmit = (data: Step3Data) => {
    updateData(data);
    onNext();
  };

  return (
    <div>
      <div className="widget-header">
        <h2 className="widget-title">{t('treatmentTitle')}</h2>
        <p className="widget-desc">{t('treatmentDesc')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset
          className="form-group"
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <legend className="form-label">{t('treatmentLabel')}</legend>
          <div className="treatment-grid" role="radiogroup" aria-label="Select a treatment">
            {treatments.map((tr) => (
              <label
                key={tr.id}
                className={`treatment-option ${selectedTreatment === tr.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="treatment"
                  value={tr.id}
                  checked={selectedTreatment === tr.id}
                  onChange={() => {
                    setValue('treatment', tr.id, { shouldValidate: true });
                    updateData({ treatment: tr.id });
                  }}
                  style={{ display: 'none' }}
                  aria-label={tr.title}
                />
                <img src={tr.img} alt={tr.title} className="treatment-img" loading="lazy" />
                <div className="treatment-details">
                  <h4>{tr.title}</h4>
                  <p>{tr.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.treatment && (
            <p className="error-text" role="alert">
              {errors.treatment.message}
            </p>
          )}
        </fieldset>

        <button type="submit" className="btn">
          {t('nextStep')}
        </button>
        <button type="button" onClick={onPrev} className="btn btn-secondary">
          {t('goBack')}
        </button>
      </form>
    </div>
  );
}
