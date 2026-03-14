/**
 * Price Tracker - Domain Service
 * Tracks price history and calculates changes
 * Following Single Responsibility Principle
 */

import { PriceChange } from '../entities/PriceChange'

export class PriceTracker {
  private previousPrice: number | null = null
  private lastChange: PriceChange | null = null

  /**
   * Update with new price and calculate change
   */
  update(currentPrice: number): PriceChange | null {
    if (this.previousPrice === null) {
      // First price, no change to calculate
      this.previousPrice = currentPrice
      return null
    }

    // Calculate change from previous price
    const change = PriceChange.calculate(currentPrice, this.previousPrice)
    
    // Store the change (persists until next update)
    this.lastChange = change
    
    // Update previous price for next comparison
    this.previousPrice = currentPrice

    return change
  }

  /**
   * Get the last calculated change
   */
  getLastChange(): PriceChange | null {
    return this.lastChange
  }

  /**
   * Reset the tracker
   */
  reset(): void {
    this.previousPrice = null
    this.lastChange = null
  }

  /**
   * Check if tracker has been initialized
   */
  isInitialized(): boolean {
    return this.previousPrice !== null
  }
}
