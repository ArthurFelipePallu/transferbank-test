/**
 * Removes all non-numeric characters from a string
 * Used to sanitize formatted inputs before sending to backend
 */
export const sanitizeNumeric = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Sanitizes CNPJ by removing dots, slashes, and dashes
 * Example: "12.345.678/0001-90" -> "12345678000190"
 */
export const sanitizeCnpj = (cnpj: string): string => {
  return sanitizeNumeric(cnpj)
}

/**
 * Sanitizes CPF by removing dots and dashes
 * Example: "123.456.789-01" -> "12345678901"
 */
export const sanitizeCpf = (cpf: string): string => {
  return sanitizeNumeric(cpf)
}

/**
 * Sanitizes phone by removing spaces, parentheses, dashes, and plus signs
 * Example: "+55 (11) 99999-9999" -> "5511999999999"
 */
export const sanitizePhone = (phone: string): string => {
  return sanitizeNumeric(phone)
}

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
 * Formats CNPJ with dots, slash, and dash
 * Example: "12345678000190" -> "12.345.678/0001-90"
 */
export const formatCnpj = (cnpj: string): string => {
  const cleaned = sanitizeCnpj(cnpj)
  if (cleaned.length !== 14) return cnpj
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

/**
 * Formats CPF with dots and dash
 * Example: "12345678901" -> "123.456.789-01"
 */
export const formatCpf = (cpf: string): string => {
  const cleaned = sanitizeCpf(cpf)
  if (cleaned.length !== 11) return cpf
  return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

/**
 * Formats phone with country code, area code, and number
 * Example: "5511999999999" -> "+55 (11) 99999-9999"
 */
export const formatPhone = (phone: string): string => {
  const cleaned = sanitizePhone(phone)
  
  // Brazilian phone format
  if (cleaned.startsWith('55') && cleaned.length === 13) {
    return cleaned.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')
  }
  
  // Generic format for other lengths
  if (cleaned.length >= 10) {
    return cleaned.replace(/^(\d{2})(\d{2})(\d+)$/, '+$1 ($2) $3')
  }
  
  return phone
}

/**
 * Sanitizes CEP by removing dashes
 * Example: "01001-000" -> "01001000"
 */
export const sanitizeCep = (cep: string): string => {
  return sanitizeNumeric(cep)
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

/**
 * Formats CEP with dash
 * Example: "01001000" -> "01001-000"
 */
export const formatCep = (cep: string): string => {
  const cleaned = sanitizeCep(cep)
  if (cleaned.length !== 8) return cep
  return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}
