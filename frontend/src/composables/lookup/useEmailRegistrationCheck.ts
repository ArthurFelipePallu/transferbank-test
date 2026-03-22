/**
 * useEmailRegistrationCheck � Presentation Layer
 *
 * Single Responsibility: owns ALL async state for the email registration check,
 * including the debounce wait, the in-flight request, and the result.
 *
 * isPending: true from the moment the email changes until the check resolves.
 * This keeps the form blocked during both the debounce window and the network call.
 */
import { ref } from 'vue'
import { companyGateway } from '@/infrastructure/gateways'
import { checkEmailRegistered } from '@/application/company/companyUseCases'
import { EMAIL_CHECK_DEBOUNCE_MS } from '@/domain/validation/ValidationConstants'

export function useEmailRegistrationCheck() {
  const isPending    = ref(false)
  const isChecking   = ref(false)
  const isRegistered = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Schedule a check after the debounce delay.
   * Calling this again before the timer fires resets the countdown.
   */
  const scheduleCheck = (email: string): void => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer      = null
    isPending.value    = false
    isChecking.value   = false
    isRegistered.value = false

    if (!email) return

    isPending.value = true

    debounceTimer = setTimeout(async () => {
      isChecking.value = true
      try {
        isRegistered.value = await checkEmailRegistered(companyGateway, email)
      } catch {
        // Non-critical — network failure should not block the user
        isRegistered.value = false
      } finally {
        isChecking.value = false
        isPending.value  = false
      }
    }, EMAIL_CHECK_DEBOUNCE_MS)
  }

  const reset = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer      = null
    isPending.value    = false
    isChecking.value   = false
    isRegistered.value = false
  }

  return { isPending, isChecking, isRegistered, scheduleCheck, reset }
}
