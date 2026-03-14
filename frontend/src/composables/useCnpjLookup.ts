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

/**
 * Check if CNPJ is a test CNPJ (all digits are the same)
 * For testing purposes, we skip API lookup for these CNPJs
 */
function isTestCnpj(cnpj: string): boolean {
  const sanitized = cnpj.replace(/\D/g, '')
  if (sanitized.length !== 14) return false
  
  const firstDigit = sanitized[0]
  return sanitized.split('').every(digit => digit === firstDigit)
}

export function useCnpjLookup(gateway: ICnpjGateway = httpCnpjGateway) {
  const asyncLookup = useAsyncLookup<CompanyInfo, CompanyStatusError>({
    logPrefix: 'useCnpjLookup',
  })

  const statusError = computed(() => asyncLookup.specificError.value)
  const companyInfo = computed(() => asyncLookup.result.value)

  const lookup = async (cnpj: string): Promise<CompanyInfo | null> => {
    console.log('[useCnpjLookup] Starting lookup for:', cnpj)
    
    // Skip API lookup for test CNPJs (all same digits)
    if (isTestCnpj(cnpj)) {
      console.log('[useCnpjLookup] Test CNPJ detected, skipping API lookup')
      asyncLookup.reset()
      return null
    }
    
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
