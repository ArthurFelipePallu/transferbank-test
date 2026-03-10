/**
 * Sanitizers - Domain Layer Utilities
 * Functions to remove formatting from user input
 * Used before sending data to backend
 */

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
 * Sanitizes CEP by removing dashes
 * Example: "01001-000" -> "01001000"
 */
export const sanitizeCep = (cep: string): string => {
  return sanitizeNumeric(cep)
}
