/**
 * CEP Lookup Composable - Presentation Layer
 * Vue composable for CEP lookup functionality
 * Uses generic useAsyncLookup to avoid duplication
 */

import { computed } from 'vue'
import type { ICepGateway } from '@/domain/address/ports/ICepGateway'
import type { Address } from '@/domain/address/entities/Address'
import { httpCepGateway } from '@/infrastructure/address/HttpCepGateway'
import { lookupAddressByCep } from '@/application/address/lookupCepUseCase'
import { useAsyncLookup } from './useAsyncLookup'

export function useCepLookup(gateway: ICepGateway = httpCepGateway) {
  const asyncLookup = useAsyncLookup<Address>({
    logPrefix: 'useCepLookup',
  })

  const address = computed(() => asyncLookup.result.value)

  const lookup = (cep: string): Promise<Address | null> =>
    asyncLookup.lookup(() => lookupAddressByCep(gateway, cep))

  return {
    isLoading: asyncLookup.isLoading,
    error: asyncLookup.error,
    address,
    lookup,
    reset: asyncLookup.reset,
  }
}
