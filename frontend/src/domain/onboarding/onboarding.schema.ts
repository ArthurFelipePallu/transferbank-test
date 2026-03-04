import { z } from 'zod'
import { CryptoCurrencyEnum } from '@/api/backendApi'

export const onboardingSchema = z
  .object({
    cnpj: z.string().min(1, 'CNPJ is required'),
    companyName: z.string().min(1, 'Company name is required'),
    fullName: z.string().min(1, 'Name is required'),
    cryptoCurrencies: z.array(z.enum(CryptoCurrencyEnum)).min(1, 'Select at least one currency'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Use at least one uppercase letter')
      .regex(/[a-z]/, 'Use at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Include at least one symbol'),
    passwordConfirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match',
  })

export type OnboardingFormValues = z.infer<typeof onboardingSchema>

