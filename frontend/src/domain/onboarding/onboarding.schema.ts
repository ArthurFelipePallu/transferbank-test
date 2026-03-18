import * as yup from 'yup'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { VALIDATION } from '@/domain/validation/ValidationConstants'
import { VM } from '@/domain/validation/ValidationMessages'

// ─── Full schema ─────────────────────────────────────────────────────────────

export const onboardingSchema = yup.object({
  cnpj: yup.string().required(VM.required('CNPJ')),
  companyName: yup.string().required(VM.required('Company name')),
  fantasyName: yup.string().required(VM.required('Fantasy name')),
  cryptoCurrencies: yup
    .array()
    .of(yup.mixed<CryptoCurrencyEnum>().oneOf(Object.values(CryptoCurrencyEnum)).required())
    .min(1, VM.required('Cryptocurrencies'))
    .required(VM.required('Cryptocurrencies'))
    .default([]),
  phone: yup.string().required(VM.required('Phone')).matches(/^\d{10,11}$/, VM.phoneFormat),
  email: yup.string().email(VM.email).required(VM.required('Email')),
  cep: yup.string().required(VM.required('CEP')),
  logradouro: yup.string().required(VM.required('Street')),
  numero: yup.string().required(VM.required('Number')),
  complemento: yup.string().optional(),
  bairro: yup.string().required(VM.required('Neighborhood')),
  cidade: yup.string().required(VM.required('City')),
  uf: yup.string().required(VM.required('State')).length(VALIDATION.UF_LENGTH, VM.ufLength),
  password: yup
    .string()
    .required(VM.required('Password'))
    .min(VALIDATION.PASSWORD_MIN_LENGTH, VM.minLength('Password', VALIDATION.PASSWORD_MIN_LENGTH))
    .matches(/[A-Z]/, VM.passwordUppercase)
    .matches(/[a-z]/, VM.passwordLowercase)
    .matches(/[0-9]/, VM.passwordNumber)
    .matches(/[^A-Za-z0-9]/, VM.passwordSymbol),
  passwordConfirmation: yup
    .string()
    .required(VM.required('Password confirmation'))
    .oneOf([yup.ref('password')], VM.passwordMatch),
})

export type OnboardingFormValues = yup.InferType<typeof onboardingSchema>

// ─── Per-step schemas ─────────────────────────────────────────────────────────

export const onboardingCnpjSchema = yup.object({
  cnpj: yup.string().required(VM.required('CNPJ')),
})

export const onboardingCompanySchema = yup.object({
  companyName: yup.string().required(VM.required('Company name')),
  fantasyName: yup.string().required(VM.required('Fantasy name')),
  phone: yup.string().required(VM.required('Phone')).matches(/^\d{10,11}$/, VM.phoneFormat),
  email: yup.string().email(VM.email).required(VM.required('Email')),
})

export const onboardingCryptoSchema = yup.object({
  cryptoCurrencies: yup
    .array()
    .of(yup.mixed<CryptoCurrencyEnum>().oneOf(Object.values(CryptoCurrencyEnum)).required())
    .min(1, VM.required('Cryptocurrencies'))
    .required(VM.required('Cryptocurrencies'))
    .default([]),
})

export const onboardingAddressSchema = yup.object({
  cep: yup.string().required(VM.required('CEP')),
  logradouro: yup.string().required(VM.required('Street')),
  numero: yup.string().required(VM.required('Number')),
  complemento: yup.string().optional(),
  bairro: yup.string().required(VM.required('Neighborhood')),
  cidade: yup.string().required(VM.required('City')),
  uf: yup.string().required(VM.required('State')).length(VALIDATION.UF_LENGTH, VM.ufLength),
})

export const onboardingPasswordSchema = yup.object({
  password: yup
    .string()
    .required(VM.required('Password'))
    .min(VALIDATION.PASSWORD_MIN_LENGTH, VM.minLength('Password', VALIDATION.PASSWORD_MIN_LENGTH))
    .matches(/[A-Z]/, VM.passwordUppercase)
    .matches(/[a-z]/, VM.passwordLowercase)
    .matches(/[0-9]/, VM.passwordNumber)
    .matches(/[^A-Za-z0-9]/, VM.passwordSymbol),
  passwordConfirmation: yup
    .string()
    .required(VM.required('Password confirmation'))
    .oneOf([yup.ref('password')], VM.passwordMatch),
})

export type OnboardingCnpjValues = yup.InferType<typeof onboardingCnpjSchema>
export type OnboardingCompanyValues = yup.InferType<typeof onboardingCompanySchema>
export type OnboardingCryptoValues = yup.InferType<typeof onboardingCryptoSchema>
export type OnboardingAddressValues = yup.InferType<typeof onboardingAddressSchema>
export type OnboardingPasswordValues = yup.InferType<typeof onboardingPasswordSchema>

// ─── Partner schema ───────────────────────────────────────────────────────────

export const onboardingPartnerSchema = yup.object({
  fullName: yup
    .string()
    .required(VM.required('Full name'))
    .min(VALIDATION.NAME_MIN_LENGTH, VM.minLength('Full name', VALIDATION.NAME_MIN_LENGTH)),
  cpf: yup.string().required(VM.required('CPF')).matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, VM.cpfFormat),
  nationality: yup.string().required(VM.required('Nationality')),
  shareholding: yup
    .number()
    .typeError(VM.typeError('Shareholding'))
    .required(VM.required('Shareholding'))
    .min(VALIDATION.SHAREHOLDING_MIN, VM.shareholdingMin)
    .max(VALIDATION.SHAREHOLDING_MAX, VM.shareholdingMax(VALIDATION.SHAREHOLDING_MAX)),
  isPep: yup.boolean().default(false),
  documents: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required(),
        size: yup.number().required(),
        type: yup.string().required(),
      }),
    )
    .min(1, VM.documentsRequired)
    .required(VM.documentsRequired),
})

/**
 * Factory: produces a partner schema with a dynamic shareholding cap.
 * Domain rule — a partner cannot hold more than the remaining unallocated %.
 */
export const createOnboardingPartnerSchema = (maxShareholding: number) =>
  onboardingPartnerSchema.shape({
    shareholding: yup
      .number()
      .typeError(VM.typeError('Shareholding'))
      .required(VM.required('Shareholding'))
      .min(VALIDATION.SHAREHOLDING_MIN, VM.shareholdingMin)
      .max(maxShareholding, VM.shareholdingMax(maxShareholding)),
  })

export type OnboardingPartnerValues = yup.InferType<typeof onboardingPartnerSchema>
