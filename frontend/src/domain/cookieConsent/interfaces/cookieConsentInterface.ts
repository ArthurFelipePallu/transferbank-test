export type CookieChoice = 'all' | 'necessary' | 'declined'

export interface CookieConsent {
  choice: CookieChoice
  decidedAt: string // ISO timestamp
}
