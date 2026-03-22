/**
 * CNPJ Lookup Composable — Presentation Layer
 *
 * Wraps the lookupCompanyByCnpj use case with reactive Vue state.
 * Exposes typed error signals (statusError, invalidCnpj) so the
 * presentation layer never needs to inspect raw error messages.
 */

import { computed, ref } from 'vue'
import type { ICnpjGateway } from '@/domain/cnpj/ports/ICnpjGateway'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
import { httpCnpjGateway } from '@/infrastructure/cnpj/HttpCnpjGateway'
import { lookupCompanyByCnpj } from '@/application/cnpj/lookupCnpjUseCase'
import { CompanyStatusError } from '@/domain/cnpj/errors/CompanyStatusError'
import { InvalidCnpjError } from '@/domain/cnpj/errors/InvalidCnpjError'
import { useAsyncLookup } from './useAsyncLookup'

export function useCnpjLookup(gateway: ICnpjGateway = httpCnpjGateway) {
  // Captures the raw thrown error so we can do instanceof checks.
  // useAsyncLookup only stores error.message (string), not the Error object itself.
  const rawError = ref<unknown>(null)

  const asyncLookup = useAsyncLookup<CompanyInfo, CompanyStatusError>({
    logPrefix: 'useCnpjLookup',
    onError: (err) => { rawError.value = err },
  })

  const statusError = computed(() => asyncLookup.specificError.value)
  const companyInfo = computed(() => asyncLookup.result.value)
  const invalidCnpj = computed(() => rawError.value instanceof InvalidCnpjError)

  const lookup = (cnpj: string): Promise<CompanyInfo | null> => {
    rawError.value = null
    return asyncLookup.lookup(
      () => lookupCompanyByCnpj(gateway, cnpj),
      CompanyStatusError,
    )
  }

  const reset = () => {
    rawError.value = null
    asyncLookup.reset()
  }

  return {
    isLoading: asyncLookup.isLoading,
    error: asyncLookup.error,
    statusError,
    invalidCnpj,
    companyInfo,
    lookup,
    reset,
  }
}
