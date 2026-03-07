import { z } from 'zod'

// CPF validation (simplified - checks format and basic validation)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const zipCodeRegex = /^\d{5}-\d{3}$/

export const partnerPersonalInfoSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must have at least 3 characters')
    .max(100, 'Full name is too long'),
  cpf: z
    .string()
    .regex(cpfRegex, 'CPF must be in format: 000.000.000-00')
    .refine((cpf) => {
      // Remove formatting
      const numbers = cpf.replace(/\D/g, '')
      return numbers.length === 11
    }, 'Invalid CPF'),
  nationality: z.string().min(2, 'Nationality is required'),
  isPep: z.boolean(),
})

export const partnerAddressSchema = z.object({
  street: z.string().min(3, 'Street is required'),
  number: z.string().min(1, 'Number is required'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Neighborhood is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'Use state abbreviation (e.g., SP)'),
  zipCode: z.string().regex(zipCodeRegex, 'ZIP code must be in format: 00000-000'),
  country: z.string().min(2, 'Country is required'),
})

export const partnerShareholdingSchema = z.object({
  shareholding: z
    .number()
    .min(0.01, 'Shareholding must be greater than 0')
    .max(100, 'Shareholding cannot exceed 100%'),
})

export const partnerDocumentsSchema = z.object({
  documents: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.string(),
      }),
    )
    .min(1, 'At least one document is required'),
})

export const partnerSchema = partnerPersonalInfoSchema
  .merge(partnerAddressSchema)
  .merge(partnerShareholdingSchema)
  .merge(partnerDocumentsSchema)

export type PartnerPersonalInfoFormValues = z.infer<typeof partnerPersonalInfoSchema>
export type PartnerAddressFormValues = z.infer<typeof partnerAddressSchema>
export type PartnerShareholdingFormValues = z.infer<typeof partnerShareholdingSchema>
export type PartnerDocumentsFormValues = z.infer<typeof partnerDocumentsSchema>
export type PartnerFormValues = z.infer<typeof partnerSchema>
