/**
 * Company Information Entity - Domain Layer
 * Represents company data retrieved from CNPJ lookup
 */

export interface CompanyInfo {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  situacaoCadastral: string
  situacaoCadastralDescricao?: string
  telefone?: string
  email?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
}

export interface CnpjApiResponse {
  estabelecimento: {
    cnpj: string
    nome_fantasia?: string
    situacao_cadastral: string
    tipo_logradouro?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cep?: string
    ddd1?: string
    telefone1?: string
    email?: string
  }
  razao_social: string
  municipio?: {
    nome?: string
  }
  uf?: string
}

/**
 * Company Status Enum
 * Based on CNPJ.ws API situacao_cadastral codes
 */
export enum CompanyStatus {
  ACTIVE = '02', // Ativa
  SUSPENDED = '03', // Suspensa
  INACTIVE = '04', // Inapta
  CANCELLED = '08', // Baixada
  NULL_STATUS = '01', // Nula
}

/**
 * Check if company is active and can be registered
 * Handles both status codes and status descriptions
 */
export function isCompanyActive(status: string): boolean {
  // Check if it's the code
  if (status === CompanyStatus.ACTIVE) {
    return true
  }
  
  // Check if it's the description (case-insensitive)
  const normalizedStatus = status.toLowerCase().trim()
  return normalizedStatus === 'ativa' || normalizedStatus === 'active'
}

/**
 * Get human-readable status description in Portuguese
 */
export function getStatusDescription(status: string): string {
  // If already a description, return it
  if (status.toLowerCase() === 'ativa') return 'Ativa (Active)'
  if (status.toLowerCase() === 'suspensa') return 'Suspensa (Suspended)'
  if (status.toLowerCase() === 'inapta') return 'Inapta (Inactive)'
  if (status.toLowerCase() === 'baixada') return 'Baixada (Cancelled)'
  if (status.toLowerCase() === 'nula') return 'Nula (Null)'
  
  // Otherwise map from code
  const descriptions: Record<string, string> = {
    '01': 'Nula (Null)',
    '02': 'Ativa (Active)',
    '03': 'Suspensa (Suspended)',
    '04': 'Inapta (Inactive)',
    '08': 'Baixada (Cancelled)',
  }
  return descriptions[status] || `Unknown (Code: ${status})`
}

/**
 * Get detailed explanation for inactive status
 */
export function getStatusExplanation(status: string): string {
  const normalizedStatus = status.toLowerCase().trim()
  
  const explanations: Record<string, string> = {
    '01': 'This company registration is null and cannot be used for business operations.',
    'nula': 'This company registration is null and cannot be used for business operations.',
    '03': 'This company has been suspended by the tax authorities and cannot operate until the suspension is lifted.',
    'suspensa': 'This company has been suspended by the tax authorities and cannot operate until the suspension is lifted.',
    '04': 'This company is inactive due to pending tax or registration issues. It must be regularized before operating.',
    'inapta': 'This company is inactive due to pending tax or registration issues. It must be regularized before operating.',
    '08': 'This company has been officially closed/cancelled and can no longer operate.',
    'baixada': 'This company has been officially closed/cancelled and can no longer operate.',
  }
  return explanations[normalizedStatus] || 'This company status does not allow registration at this time.'
}
