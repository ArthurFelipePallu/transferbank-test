/**
 * CNPJ Lookup Composable - Presentation Layer
 * Vue composable for CNPJ lookup functionality
 * Uses generic useAsyncLookup to avoid duplication
 */

import { computed } from 'vue'
import type { ICnpjGateway } from '@/domain/cnpj/ports/ICnpjGateway'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
import { httpCnpjGateway } from '@/infrastructure/cnpj/HttpCnpjGateway'
import { lookupCompanyByCnpj } from '@/application/cnpj/lookupCnpjUseCase'
import { CompanyStatusError } from '@/domain/cnpj/errors/CompanyStatusError'
import { useAsyncLookup } from './useAsyncLookup'

export function useCnpjLookup(gateway: ICnpjGateway = httpCnpjGateway) {
  const asyncLookup = useAsyncLookup<CompanyInfo, CompanyStatusError>({
    logPrefix: 'useCnpjLookup',
  })

  const statusError = computed(() => asyncLookup.specificError.value)
  const companyInfo = computed(() => asyncLookup.result.value)

  const lookup = async (cnpj: string): Promise<CompanyInfo | null> => {
    console.log('[useCnpjLookup] Starting lookup for:', cnpj)
    return asyncLookup.lookup(
      () => lookupCompanyByCnpj(gateway, cnpj),
      CompanyStatusError
    )
  }

  return {
    isLoading: asyncLookup.isLoading,
    error: asyncLookup.error,
    statusError,
    companyInfo,
    lookup,
    reset: asyncLookup.reset,
  }
}
