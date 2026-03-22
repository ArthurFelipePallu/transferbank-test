/**
 * ValidationMessages — Domain Layer
 *
 * Centralises all yup validation message keys used across schemas.
 * Keys map 1-to-1 with the `validation.*` i18n namespace so the
 * presentation layer can resolve them through the translation service.
 *
 * Schemas import from here — never hardcode strings inline.
 */
export const VM = {
  required: (field: string) => `validation.required|field=${field}`,
  email: 'validation.email',
  minLength: (field: string, min: number) => `validation.minLength|field=${field},min=${min}`,
  min: (min: number) => `validation.min|min=${min}`,
  max: (max: number) => `validation.max|max=${max}`,
  typeError: (field: string) => `validation.typeError|field=${field}`,
  cnpjFormat: 'validation.cnpjFormat',
  cnpjCheckDigits: 'validation.cnpjCheckDigits',
  cpfFormat: 'validation.cpfFormat',
  phoneFormat: 'validation.phoneFormat',
  ufLength: 'validation.ufLength',
  passwordUppercase: 'validation.passwordUppercase',
  passwordLowercase: 'validation.passwordLowercase',
  passwordNumber: 'validation.passwordNumber',
  passwordSymbol: 'validation.passwordSymbol',
  passwordMatch: 'validation.passwordMatch',
  shareholdingMin: 'validation.shareholdingMin',
  shareholdingMax: (max: number) => `validation.shareholdingMax|max=${max.toFixed(2)}`,
  documentsRequired: 'validation.documentsRequired',
} as const
