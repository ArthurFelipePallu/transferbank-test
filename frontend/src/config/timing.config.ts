/**
 * Timing Configuration
 * Centralized timing constants for the application
 */

export const TIMING_CONFIG = {
  /**
   * Update intervals (in milliseconds)
   */
  CURRENCY_UPDATE_INTERVAL: 10000, // 10 seconds - ~6 req/min, within CoinGecko free tier limits
  PRICING_UPDATE_INTERVAL: 10000, // 10 seconds - synced with currency updates
  
  /**
   * Debounce delays (in milliseconds)
   */
  SEARCH_DEBOUNCE: 300,
  INPUT_DEBOUNCE: 500,
  
  /**
   * Animation durations (in milliseconds)
   */
  TOAST_DURATION: 5000,
  MODAL_TRANSITION: 300,
  FADE_TRANSITION: 200,
} as const

export type TimingConfig = typeof TIMING_CONFIG
