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

/** Basic email format check — used to gate async lookups before yup runs. */
export const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Debounce delay (ms) for async field checks that hit the backend. */
export const FIELD_CHECK_DEBOUNCE_MS = 600

/** Debounce delay (ms) for the email registration check — fires after the user pauses typing. */
export const EMAIL_CHECK_DEBOUNCE_MS = 3_000

/** Maximum allowed size for the social contract PDF upload (10 MB). */
export const SOCIAL_CONTRACT_MAX_SIZE_BYTES = 10 * 1024 * 1024

/** Accepted MIME type for the social contract upload. */
export const SOCIAL_CONTRACT_ACCEPTED_TYPE = 'application/pdf'

/**
 * Price tracking threshold — minimum % change considered significant.
 * Shared between PriceChange entity and usePriceChangeTracking composable.
 */
export const PRICE_SIGNIFICANCE_THRESHOLD = 0.01
