/**
 * Formatters - Presentation Layer Utilities
 * Functions to format data for display purposes
 * Organized by responsibility following SRP
 */

// Re-export sanitizers for backward compatibility
export {
  sanitizeNumeric,
  sanitizeCnpj,
  sanitizeCpf,
  sanitizePhone,
  sanitizeCep,
} from './sanitizers'

// Re-export masks for backward compatibility
export {
  applyCnpjMask,
  applyCpfMask,
  applyPhoneMask,
  applyCepMask,
} from './masks'

import { applyCpfMask } from './masks'

/**
 * Formats CNPJ with dots, slash, and dash
 * Example: "12345678000190" -> "12.345.678/0001-90"
 */
export const formatCnpj = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return cnpj
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

/**
 * Formats CPF with dots and dash
 * Example: "12345678901" -> "123.456.789-01"
 */
export const formatCpf = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return cpf
  return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

/**
 * Formats a CPF for display — handles both raw digits and pre-masked values.
 * The CNPJ.ws public API returns CPFs already masked as "***.***.***-**".
 * In that case we pass the value through unchanged rather than mangling it.
 *
 * Examples:
 *   "12345678901"   -> "123.456.789-01"
 *   "***.***.***-**" -> "***.***.***-**"  (API-masked, returned as-is)
 *   ""              -> "—"
 */
export const formatCpfDisplay = (cpf: string | undefined): string => {
  if (!cpf) return '—'
  // Already fully formatted — pass through
  if (/^\*{3}\.\d{3}\.\d{3}-\*{2}$/.test(cpf)) return cpf
  if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) return cpf
  // Partial CPF from BrasilAPI: "***NNNNNN**" (e.g. "***354400**")
  if (/^\*{3}\d{6}\*{2}$/.test(cpf)) return "***." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-**"
  // Raw 11-digit CPF — apply standard mask
  return applyCpfMask(cpf) || '—'
}

/**
 * Formats phone with country code, area code, and number
 * Example: "5511999999999" -> "+55 (11) 99999-9999"
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
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
 * Formats CEP with dash
 * Example: "01001000" -> "01001-000"
 */
export const formatCep = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) return cep
  return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

/**
 * Domain rule: a CNPJ where all 14 digits are the same is a test CNPJ.
 * Used to skip the external CNPJ registry lookup for test/dev scenarios.
 * Example: "00000000000000", "11111111111111"
 */
export const isTestCnpj = (cnpj: string): boolean => {
  const s = cnpj.replace(/\D/g, '')
  return s.length === 14 && s.split('').every((d) => d === s[0])
}
