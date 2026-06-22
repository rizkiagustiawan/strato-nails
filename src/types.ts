export interface FormData {
  name: string;
  contact: string;
  date: string;
  time: string;
  budget: string;
  photoUrl: string | null;
  treatment: string;
  paymentMethod: string;
}

export interface StepProps {
  formData: FormData;
  updateData: (fields: Partial<FormData>) => void;
  onNext: () => void;
  onPrev?: () => void;
  isSubmitting?: boolean;
}