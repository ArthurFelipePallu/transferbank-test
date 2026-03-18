/**
 * useCnpjRegistrationCheck — Presentation Layer
 *
 * Single Responsibility: owns the async state for checking whether a CNPJ
 * is already registered in our system.
 *
 * Depends on:
 *  - checkCnpjRegistered use case (application layer)
 *  - companyGateway from the registry (infrastructure, injected via registry)
 *
 * The component never touches the gateway or use case directly.
 */
import { ref } from 'vue'
import { companyGateway } from '@/infrastructure/gateways'
import { checkCnpjRegistered } from '@/application/company/companyUseCases'

export function useCnpjRegistrationCheck() {
  const isChecking  = ref(false)
  const isRegistered = ref(false)

  const check = async (cnpj: string): Promise<void> => {
    isChecking.value  = true
    isRegistered.value = false
    try {
      isRegistered.value = await checkCnpjRegistered(companyGateway, cnpj)
    } catch {
      // Non-critical — network failure should not block the user
      isRegistered.value = false
    } finally {
      isChecking.value = false
    }
  }

  const reset = () => {
    isChecking.value   = false
    isRegistered.value = false
  }

  return { isChecking, isRegistered, check, reset }
}
