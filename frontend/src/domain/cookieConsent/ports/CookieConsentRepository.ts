import type { CookieConsent } from '../interfaces/cookieConsentInterface'

export interface CookieConsentRepository {
  save(consent: CookieConsent): void
  load(): CookieConsent | null
  clear(): void
}
