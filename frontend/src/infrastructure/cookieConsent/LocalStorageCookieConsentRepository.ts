import type { CookieConsentRepository } from '@/domain/cookieConsent/ports/CookieConsentRepository'
import type { CookieConsent } from '@/domain/cookieConsent/interfaces/cookieConsentInterface'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'

class LocalStorageCookieConsentRepository implements CookieConsentRepository {
  save(consent: CookieConsent): void {
    storageService.set(STORAGE_KEYS.COOKIE_CONSENT, consent)
  }

  load(): CookieConsent | null {
    return storageService.get<CookieConsent>(STORAGE_KEYS.COOKIE_CONSENT)
  }

  clear(): void {
    storageService.remove(STORAGE_KEYS.COOKIE_CONSENT)
  }
}

export const localStorageCookieConsentRepository: CookieConsentRepository =
  new LocalStorageCookieConsentRepository()
