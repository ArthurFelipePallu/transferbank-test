import { useAuthStore } from '@/stores/useAuthStore'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { usePartnerStore } from '@/stores/usePartnerStore'
import { useUiStore } from '@/stores/useUiStore'

/**
 * Composable that provides access to all application stores
 * Following the Facade pattern for easier store access
 */
export function useStores() {
  return {
    auth: useAuthStore(),
    onboarding: useOnboardingStore(),
    partner: usePartnerStore(),
    ui: useUiStore(),
  }
}
