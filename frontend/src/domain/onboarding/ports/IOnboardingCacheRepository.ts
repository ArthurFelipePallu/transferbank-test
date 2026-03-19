import type { OnboardingFormCache, OnboardingPartner } from '@/domain/onboarding/onboarding.types'
import type { OnboardingStep } from '@/domain/onboarding/onboarding.types'

/** Snapshot of the in-progress onboarding form persisted between page reloads */
export interface PersistedOnboardingState {
  companyData: OnboardingFormCache
  partners: OnboardingPartner[]
  currentStep: OnboardingStep
  /** IDs of steps that were completed before the page was reloaded */
  completedSteps: OnboardingStep[]
}

/**
 * Port — defines how the onboarding form state is persisted.
 * The domain layer depends on this interface; infrastructure provides the implementation.
 */
export interface IOnboardingCacheRepository {
  load(): PersistedOnboardingState | null
  save(state: PersistedOnboardingState): void
  clear(): void
}
