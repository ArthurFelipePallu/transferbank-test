/**
 * Currency Rate Provider Interface
 * Defines contract for fetching currency exchange rates
 * Following Dependency Inversion Principle (SOLID)
 */

import { Currency } from '../entities/Currency'

export interface ICurrencyRateProvider {
  /**
   * Fetch current exchange rates for specified currencies
   * @returns Promise with array of Currency entities
   */
  fetchRates(): Promise<Currency[]>
}
