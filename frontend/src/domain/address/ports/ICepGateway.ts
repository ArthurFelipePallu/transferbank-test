/**
 * CEP Gateway Interface - Domain Layer
 * Port for CEP lookup operations
 */

import type { Address } from '../entities/Address'

export interface ICepGateway {
  /**
   * Lookup address by CEP
   * @param cep - CEP number (with or without formatting)
   * @returns Address information or null if not found
   */
  lookupByCep(cep: string): Promise<Address | null>
}
