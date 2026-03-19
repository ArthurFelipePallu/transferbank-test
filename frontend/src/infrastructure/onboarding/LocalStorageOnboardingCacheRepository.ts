import type { IOnboardingCacheRepository, PersistedOnboardingState } from '@/domain/onboarding/ports/IOnboardingCacheRepository'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'

/**
 * Infrastructure implementation of IOnboardingCacheRepository.
 * Persists onboarding form state to localStorage under ONBOARDING_FORM_CACHE key.
 */
class LocalStorageOnboardingCacheRepository implements IOnboardingCacheRepository {
  load(): PersistedOnboardingState | null {
    return storageService.get<PersistedOnboardingState>(STORAGE_KEYS.ONBOARDING_FORM_CACHE)
  }

  save(state: PersistedOnboardingState): void {
    storageService.set<PersistedOnboardingState>(STORAGE_KEYS.ONBOARDING_FORM_CACHE, state)
  }

  clear(): void {
    storageService.remove(STORAGE_KEYS.ONBOARDING_FORM_CACHE)
  }
}

export const onboardingCacheRepository: IOnboardingCacheRepository =
  new LocalStorageOnboardingCacheRepository()
