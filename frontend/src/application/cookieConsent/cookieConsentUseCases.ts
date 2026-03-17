import type { CookieConsentRepository } from '@/domain/cookieConsent/ports/CookieConsentRepository'
import type { CookieChoice, CookieConsent } from '@/domain/cookieConsent/interfaces/cookieConsentInterface'

export const loadConsent = (repository: CookieConsentRepository): CookieConsent | null => {
  return repository.load()
}

export const saveConsent = (
  repository: CookieConsentRepository,
  choice: CookieChoice,
): CookieConsent => {
  const consent: CookieConsent = {
    choice,
    decidedAt: new Date().toISOString(),
  }
  repository.save(consent)
  return consent
}

export const clearConsent = (repository: CookieConsentRepository): void => {
  repository.clear()
}
