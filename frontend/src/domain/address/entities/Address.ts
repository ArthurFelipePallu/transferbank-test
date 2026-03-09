/**
 * Address Entity - Domain Layer
 * Represents address information
 */

export interface Address {
  cep: string
  logradouro: string // Street
  numero?: string // Number
  complemento?: string // Complement
  bairro: string // Neighborhood
  localidade: string // City
  uf: string // State
}

/**
 * ViaCEP API Response
 */
export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
