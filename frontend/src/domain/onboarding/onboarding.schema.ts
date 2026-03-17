import * as yup from 'yup'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { VALIDATION } from '@/domain/validation/ValidationConstants'

// ─── Full schema (used for final validation) ────────────────────────────────

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
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^\d{10,11}$/, 'Enter a valid phone number (10-11 digits)'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  cep: yup.string().required('CEP is required'),
  logradouro: yup.string().required('Street is required'),
  numero: yup.string().required('Number is required'),
  complemento: yup.string().optional(),
  bairro: yup.string().required('Neighborhood is required'),
  cidade: yup.string().required('City is required'),
  uf: yup.string().required('State is required').length(VALIDATION.UF_LENGTH, 'State must be 2 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, 'At least 8 characters')
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

// ─── Per-step schemas ────────────────────────────────────────────────────────

export const onboardingCnpjSchema = yup.object({
  cnpj: yup.string().required('CNPJ is required'),
})

export const onboardingCompanySchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  fantasyName: yup.string().required('Fantasy name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^\d{10,11}$/, 'Enter a valid phone number (10-11 digits)'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
})

export const onboardingCryptoSchema = yup.object({
  cryptoCurrencies: yup
    .array()
    .of(yup.mixed<CryptoCurrencyEnum>().oneOf(Object.values(CryptoCurrencyEnum)).required())
    .min(1, 'Select at least one currency')
    .required('Select at least one currency')
    .default([]),
})

export const onboardingAddressSchema = yup.object({
  cep: yup.string().required('CEP is required'),
  logradouro: yup.string().required('Street is required'),
  numero: yup.string().required('Number is required'),
  complemento: yup.string().optional(),
  bairro: yup.string().required('Neighborhood is required'),
  cidade: yup.string().required('City is required'),
  uf: yup.string().required('State is required').length(VALIDATION.UF_LENGTH, 'State must be 2 characters'),
})

export const onboardingPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, 'At least 8 characters')
    .matches(/[A-Z]/, 'Use at least one uppercase letter')
    .matches(/[a-z]/, 'Use at least one lowercase letter')
    .matches(/[0-9]/, 'Include at least one number')
    .matches(/[^A-Za-z0-9]/, 'Include at least one symbol'),
  passwordConfirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

export type OnboardingCnpjValues = yup.InferType<typeof onboardingCnpjSchema>
export type OnboardingCompanyValues = yup.InferType<typeof onboardingCompanySchema>
export type OnboardingCryptoValues = yup.InferType<typeof onboardingCryptoSchema>
export type OnboardingAddressValues = yup.InferType<typeof onboardingAddressSchema>
export type OnboardingPasswordValues = yup.InferType<typeof onboardingPasswordSchema>
