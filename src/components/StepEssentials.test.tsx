import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StepEssentials } from './StepEssentials';
import { ThemeProvider } from '../context/ThemeProvider';
import { LanguageProvider } from '../context/LanguageProvider';
import type { FormData } from '../types';

const mockFormData: FormData = {
  name: '',
  contact: '',
  date: '',
  time: '',
  budget: '',
  photoUrl: null,
  treatment: '',
  paymentMethod: 'Transfer',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>{children}</LanguageProvider>
  </ThemeProvider>
);

describe('StepEssentials', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <StepEssentials formData={mockFormData} updateData={vi.fn()} onNext={vi.fn()} />,
      { wrapper }
    );
    expect(getByText('The Essentials')).toBeInTheDocument();
  });
});
