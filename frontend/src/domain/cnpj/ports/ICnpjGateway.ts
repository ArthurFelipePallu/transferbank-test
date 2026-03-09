/**
 * CNPJ Gateway Interface - Domain Layer
 * Defines the contract for CNPJ lookup operations
 * Following Dependency Inversion Principle
 */

import type { CompanyInfo } from '../entities/CompanyInfo'

export interface ICnpjGateway {
  /**
   * Lookup company information by CNPJ
   * @param cnpj - CNPJ number (14 digits, can be formatted or not)
   * @returns Company information or null if not found
   * @throws Error if lookup fails
   */
  lookupByCnpj(cnpj: string): Promise<CompanyInfo | null>
}
