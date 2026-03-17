/**
 * Validation Constants - Domain Layer
 * Single source of truth for all validation rules.
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 3,
  UF_LENGTH: 2,
  SHAREHOLDING_MIN: 0.01,
  SHAREHOLDING_MAX: 100,
  PHONE_MIN_DIGITS: 10,
  PHONE_MAX_DIGITS: 11,
} as const

/**
 * Price tracking threshold — minimum % change considered significant.
 * Shared between PriceChange entity and usePriceChangeTracking composable.
 */
export const PRICE_SIGNIFICANCE_THRESHOLD = 0.01
