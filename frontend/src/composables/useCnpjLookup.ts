/**
 * CNPJ Lookup Composable - Presentation Layer
 * Vue composable for CNPJ lookup functionality
 */

import { ref } from 'vue'
import type { ICnpjGateway } from '@/domain/cnpj/ports/ICnpjGateway'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
import { httpCnpjGateway } from '@/infrastructure/cnpj/HttpCnpjGateway'
import { lookupCompanyByCnpj } from '@/application/cnpj/lookupCnpjUseCase'
import { CompanyStatusError } from '@/domain/cnpj/errors/CompanyStatusError'

export function useCnpjLookup(gateway: ICnpjGateway = httpCnpjGateway) {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const statusError = ref<CompanyStatusError | null>(null)
  const companyInfo = ref<CompanyInfo | null>(null)

  const lookup = async (cnpj: string): Promise<CompanyInfo | null> => {
    isLoading.value = true
    error.value = null
    statusError.value = null
    companyInfo.value = null

    console.log('[useCnpjLookup] Starting lookup for:', cnpj)

    try {
      const result = await lookupCompanyByCnpj(gateway, cnpj)
      companyInfo.value = result
      console.log('[useCnpjLookup] Lookup successful:', result)
      return result
    } catch (err) {
      console.error('[useCnpjLookup] Lookup error:', err)
      if (err instanceof CompanyStatusError) {
        statusError.value = err
        error.value = err.message
        console.log('[useCnpjLookup] Status error:', err.message)
      } else {
        error.value = err instanceof Error ? err.message : 'Failed to lookup CNPJ'
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    isLoading.value = false
    error.value = null
    statusError.value = null
    companyInfo.value = null
  }

  return {
    isLoading,
    error,
    statusError,
    companyInfo,
    lookup,
    reset,
  }
}
