/**
 * Lookup CEP Use Case - Application Layer
 * Business logic for CEP lookup operations
 */

import type { ICepGateway } from '@/domain/address/ports/ICepGateway'
import type { Address } from '@/domain/address/entities/Address'

/**
 * Lookup address by CEP
 * @param gateway - CEP gateway implementation
 * @param cep - CEP number to lookup
 * @returns Address information or null if not found
 */
export async function lookupAddressByCep(
  gateway: ICepGateway,
  cep: string
): Promise<Address | null> {
  if (!cep || cep.trim().length === 0) {
    throw new Error('CEP is required')
  }

  return await gateway.lookupByCep(cep)
}
