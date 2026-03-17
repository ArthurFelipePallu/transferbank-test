/**
 * Price Change Entity - Domain Model
 * Represents the change between two prices
 */

import { PRICE_SIGNIFICANCE_THRESHOLD } from '@/domain/validation/ValidationConstants'

export enum PriceDirection {
  UP = 'up',
  DOWN = 'down',
  NEUTRAL = 'neutral',
}

export class PriceChange {
  private static readonly MINIMUM_CHANGE_THRESHOLD = PRICE_SIGNIFICANCE_THRESHOLD

  constructor(
    public readonly direction: PriceDirection,
    public readonly percentageChange: number,
    public readonly absoluteChange: number
  ) {}

  /**
   * Calculate price change between two values
   */
  static calculate(currentPrice: number, previousPrice: number): PriceChange {
    if (currentPrice < 0 || previousPrice < 0) {
      throw new Error('Prices must be non-negative')
    }

    if (previousPrice === 0) {
      throw new Error('Previous price cannot be zero')
    }

    const absoluteChange = Math.abs(currentPrice - previousPrice)
    const percentageChange = (absoluteChange / previousPrice) * 100

    let direction = PriceDirection.NEUTRAL
    if (currentPrice - previousPrice > this.MINIMUM_CHANGE_THRESHOLD) {
      direction = PriceDirection.UP
    } else if (currentPrice - previousPrice < -this.MINIMUM_CHANGE_THRESHOLD) {
      direction = PriceDirection.DOWN
    }

    return new PriceChange(direction, percentageChange, absoluteChange)
  }

  /**
   * Check if there is a significant change
   */
  hasSignificantChange(): boolean {
    return this.direction !== PriceDirection.NEUTRAL
  }

  /**
   * Format percentage change for display
   */
  formatPercentage(decimals: number = 2): string {
    return this.percentageChange.toFixed(decimals)
  }
}
