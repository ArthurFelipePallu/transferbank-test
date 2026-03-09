/**
 * CEP Lookup Composable - Presentation Layer
 * Vue composable for CEP lookup functionality
 */

import { ref } from 'vue'
import type { ICepGateway } from '@/domain/address/ports/ICepGateway'
import type { Address } from '@/domain/address/entities/Address'
import { httpCepGateway } from '@/infrastructure/address/HttpCepGateway'
import { lookupAddressByCep } from '@/application/address/lookupCepUseCase'

export function useCepLookup(gateway: ICepGateway = httpCepGateway) {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const address = ref<Address | null>(null)

  const lookup = async (cep: string): Promise<Address | null> => {
    isLoading.value = true
    error.value = null
    address.value = null

    console.log('[useCepLookup] Starting lookup for:', cep)

    try {
      const result = await lookupAddressByCep(gateway, cep)
      address.value = result
      console.log('[useCepLookup] Lookup successful:', result)
      return result
    } catch (err) {
      console.error('[useCepLookup] Lookup error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to lookup CEP'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    isLoading.value = false
    error.value = null
    address.value = null
  }

  return {
    isLoading,
    error,
    address,
    lookup,
    reset,
  }
}
