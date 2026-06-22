import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Camera, X, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fileToBase64, compressImage, validateImage } from '../utils/image';
import { api } from '../services/api';
import type { StepProps } from '../types';

export function StepStyle({ formData, updateData, onNext, onPrev }: StepProps) {
  const { t } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(formData.photoUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const step2Schema = z.object({
    photoUrl: z.string().nullable().optional(),
    budget: z.string().min(1, t('validationBudgetRequired')),
  });

  type Step2Data = z.infer<typeof step2Schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      photoUrl: formData.photoUrl,
      budget: formData.budget,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validation = validateImage(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      setIsProcessing(true);
      try {
        const base64 = await fileToBase64(file);
        const compressed = await compressImage(base64);
        setImagePreview(compressed);
        setValue('photoUrl', compressed);
        updateData({ photoUrl: compressed });
        toast.success('Image uploaded successfully');
      } catch {
        toast.error('Failed to process image');
      }
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('photoUrl', null);
    updateData({ photoUrl: null });
  };

  const handleAIAnalysis = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    try {
      const response = await api.analyzeImage(imagePreview);
      if (response.success && response.data) {
        const detectedTreatment = response.data.category;
        updateData({ treatment: detectedTreatment });
        toast.success(t('aiDetected', { treatment: detectedTreatment }), {
          icon: '✨',
        });
        onNext(); // Auto-advance to next step
      } else {
        toast.error(`Error AI: ${response.error || t('aiFailed')}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Error AI: ${error.message || t('aiFailed')}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = (data: Step2Data) => {
    updateData(data);
    onNext();
  };

  const budgetOptions = [
    { value: 'Under 100k IDR', label: t('budgetUnder100') },
    { value: '100k - 200k IDR', label: t('budget100to200') },
    { value: '200k - 300k IDR', label: t('budget200to300') },
    { value: '300k+ IDR', label: t('budget300plus') },
    { value: 'Not sure yet', label: t('budgetNotSure') },
  ];

  return (
    <div>
      <div className="widget-header">
        <h2 className="widget-title">{t('styleTitle')}</h2>
        <p className="widget-desc">{t('styleDesc')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="photo" className="form-label">
            {t('photoLabel')}
          </label>

          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <div className="image-actions">
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={handleRemoveImage}
                  disabled={isAnalyzing}
                >
                  <X size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> Remove
                </button>
                <label htmlFor="photo" className="btn-change-image" style={{ cursor: isAnalyzing ? 'not-allowed' : 'pointer', opacity: isAnalyzing ? 0.7 : 1 }}>
                  <RefreshCw size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> Change
                </label>
              </div>
              
              <button
                type="button"
                className="btn-ai-analyze"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="loading-spinner-small" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                    {t('aiAnalyzing')}
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Sparkles size={18} /> {t('aiDetectBtn')}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <label className="upload-area" htmlFor="photo">
              <input
                id="photo"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={isProcessing}
                aria-describedby="photo-hint"
              />
              {isProcessing ? (
                <span className="upload-loading">
                  <span className="loading-spinner-small" />
                  Processing image...
                </span>
              ) : (
                <span id="photo-hint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Camera size={20} /> {t('photoHint')}
                </span>
              )}
            </label>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="budget" className="form-label">
            {t('budgetLabel')}
          </label>
          <select
            id="budget"
            className={`form-select ${errors.budget ? 'input-error' : ''}`}
            aria-invalid={errors.budget ? 'true' : 'false'}
            aria-describedby={errors.budget ? 'budget-error' : undefined}
            {...register('budget')}
          >
            <option value="">{t('budgetPlaceholder')}</option>
            {budgetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.budget && (
            <p id="budget-error" className="error-text" role="alert">
              {errors.budget.message}
            </p>
          )}
        </div>

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
