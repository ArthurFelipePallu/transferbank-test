import * as yup from 'yup'

// CPF validation (simplified - checks format and basic validation)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/

export const partnerPersonalInfoSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(3, 'Full name must have at least 3 characters')
    .max(100, 'Full name is too long'),
  cpf: yup
    .string()
    .required('CPF is required')
    .matches(cpfRegex, 'CPF must be in format: 000.000.000-00')
    .test('cpf-length', 'Invalid CPF', (value) => {
      if (!value) return false
      const numbers = value.replace(/\D/g, '')
      return numbers.length === 11
    }),
  nationality: yup.string().required('Nationality is required').min(2, 'Nationality is required'),
  isPep: yup.boolean().default(false),
})

export const partnerShareholdingSchema = yup.object({
  shareholding: yup
    .number()
    .required('Shareholding is required')
    .min(0.01, 'Shareholding must be greater than 0')
    .max(100, 'Shareholding cannot exceed 100%'),
})

export const partnerDocumentsSchema = yup.object({
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
    .min(1, 'At least one document is required')
    .required('At least one document is required'),
})

export const partnerSchema = partnerPersonalInfoSchema
  .concat(partnerShareholdingSchema)
  .concat(partnerDocumentsSchema)

export type PartnerPersonalInfoFormValues = yup.InferType<typeof partnerPersonalInfoSchema>
export type PartnerShareholdingFormValues = yup.InferType<typeof partnerShareholdingSchema>
export type PartnerDocumentsFormValues = yup.InferType<typeof partnerDocumentsSchema>
export type PartnerFormValues = yup.InferType<typeof partnerSchema>
