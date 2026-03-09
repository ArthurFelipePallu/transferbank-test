import * as yup from 'yup'
import { CryptoCurrencyEnum } from '@/api/backendApi'

export const onboardingSchema = yup.object({
  cnpj: yup.string().required('CNPJ is required'),
  companyName: yup.string().required('Company name is required'),
  fantasyName: yup.string().required('Fantasy name is required'),
  cryptoCurrencies: yup
    .array()
    .of(yup.mixed<CryptoCurrencyEnum>().oneOf(Object.values(CryptoCurrencyEnum)).required())
    .min(1, 'Select at least one currency')
    .required('Select at least one currency')
    .default([]),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  cep: yup.string().required('CEP is required'),
  logradouro: yup.string().required('Street is required'),
  numero: yup.string().required('Number is required'),
  complemento: yup.string().optional(),
  bairro: yup.string().required('Neighborhood is required'),
  cidade: yup.string().required('City is required'),
  uf: yup.string().required('State is required').length(2, 'State must be 2 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Use at least one uppercase letter')
    .matches(/[a-z]/, 'Use at least one lowercase letter')
    .matches(/[0-9]/, 'Include at least one number')
    .matches(/[^A-Za-z0-9]/, 'Include at least one symbol'),
  passwordConfirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

export type OnboardingFormValues = yup.InferType<typeof onboardingSchema>
