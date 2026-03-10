/**
 * Input Masks - Presentation Layer Utilities
 * Functions to apply progressive formatting as user types
 * Used in form inputs for better UX
 */

/**
 * Applies CNPJ mask with progressive formatting
 * Example: "12345678000190" -> "12.345.678/0001-90"
 * Max length: 14 digits
 */
export const applyCnpjMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 14)
  let formatted = numbers
  if (numbers.length > 2) formatted = `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  if (numbers.length > 5) formatted = `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  if (numbers.length > 8) formatted = `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  if (numbers.length > 12) formatted = `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
  return formatted
}

/**
 * Applies CPF mask with progressive formatting
 * Example: "12345678901" -> "123.456.789-01"
 * Max length: 11 digits
 */
export const applyCpfMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  let formatted = numbers
  if (numbers.length > 3) formatted = `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length > 6) formatted = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  if (numbers.length > 9) formatted = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
  return formatted
}

/**
 * Applies Brazilian phone mask with progressive formatting
 * Example: "5511999999999" -> "+55 (11) 99999-9999"
 * Max length: 13 digits
 */
export const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 13)
  let formatted = numbers
  if (numbers.length > 0) formatted = `+${numbers}`
  if (numbers.length > 2) formatted = `+${numbers.slice(0, 2)} (${numbers.slice(2)}`
  if (numbers.length > 4) formatted = `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`
  if (numbers.length > 9) formatted = `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9)}`
  return formatted
}

/**
 * Applies CEP mask with progressive formatting
 * Example: "01001000" -> "01001-000"
 * Max length: 8 digits
 */
export const applyCepMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 8)
  let formatted = numbers
  if (numbers.length > 5) formatted = `${numbers.slice(0, 5)}-${numbers.slice(5)}`
  return formatted
}
