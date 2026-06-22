import { z } from 'zod';

export const createStep1Schema = (messages: { name: string; contact: string; date: string; time: string }) =>
  z.object({
    name: z.string().min(1, messages.name),
    contact: z.string().min(1, messages.contact),
    date: z.string().min(1, messages.date),
    time: z.string().min(1, messages.time),
  });

export const createStep2Schema = (messages: { budget: string }) =>
  z.object({
    photoUrl: z.string().nullable().optional(),
    budget: z.string().min(1, messages.budget),
  });

export const createStep3Schema = (messages: { treatment: string }) =>
  z.object({
    treatment: z.string().min(1, messages.treatment),
  });

export const createStep4Schema = (messages: { payment: string }) =>
  z.object({
    paymentMethod: z.enum(['Transfer', 'Cash'], {
      message: messages.payment,
    }),
  });

export type Step1Data = z.infer<ReturnType<typeof createStep1Schema>>;
export type Step2Data = z.infer<ReturnType<typeof createStep2Schema>>;
export type Step3Data = z.infer<ReturnType<typeof createStep3Schema>>;
export type Step4Data = z.infer<ReturnType<typeof createStep4Schema>>;
