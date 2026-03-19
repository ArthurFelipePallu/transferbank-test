import type { OnboardingFormCache } from '@/domain/onboarding/onboarding.types'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
import type { CurrencyGateway } from '@/domain/onboarding/ports/CurrencyGateway'
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface'
import { applyCepMask } from '@/utils/formatters'

export interface CnpjResult {
  cnpj: string
  companyInfo: CompanyInfo | null
  isTestCnpj: boolean
}

/**
 * Derives the form data patch to apply when a CNPJ step is confirmed.
 * Returns null for fields that should not be overwritten (same CNPJ, data already present).
 *
 * Pure function — no side effects, fully testable.
 */
export function buildCnpjPatch(
  result: CnpjResult,
  existing: OnboardingFormCache,
): { patch: Partial<OnboardingFormCache>; shouldClearPrevious: boolean; shouldPrefillSocios: boolean } {
  const isSameCnpj = existing.cnpj === result.cnpj
  const shouldClearPrevious = !isSameCnpj

  // New CNPJ with company info — full prefill
  const shouldPrefill =
    result.companyInfo !== null &&
    (!isSameCnpj || !existing.companyName)

  const patch: Partial<OnboardingFormCache> = { cnpj: result.cnpj }

  if (shouldPrefill && result.companyInfo) {
    const info = result.companyInfo
    patch.companyName = info.razaoSocial || ''
    patch.fantasyName = info.nomeFantasia || info.razaoSocial || ''
    patch.phone       = info.telefone || ''
    patch.email       = info.email || ''
    patch.cep         = info.cep ? applyCepMask(info.cep) : ''
  }

  return {
    patch,
    shouldClearPrevious,
    shouldPrefillSocios: shouldPrefill && !!(result.companyInfo?.socios?.length),
  }
}

/**
 * Fetches all crypto currencies and returns them sorted alphabetically by alias.
 * Pure orchestration — no UI concerns.
 */
export async function loadAllCryptoCurrenciesOrdered(
  gateway: CurrencyGateway,
): Promise<CryptoCurrencyOption[]> {
  const currencies = await gateway.getAllCrypto()
  return [...currencies].sort((a, b) => a.alias.localeCompare(b.alias))
}
