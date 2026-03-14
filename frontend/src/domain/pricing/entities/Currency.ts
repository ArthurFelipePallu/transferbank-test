/**
 * Currency Entity - Domain Model
 * Represents a currency with its exchange rate to BRL
 */

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  BTC = 'BTC',
  ETH = 'ETH',
}

export class Currency {
  constructor(
    public readonly code: CurrencyCode,
    public readonly rateToBRL: number,
    public readonly lastUpdated: Date = new Date()
  ) {
    if (rateToBRL <= 0) {
      throw new Error('Exchange rate must be positive')
    }
  }

  convertToBRL(amount: number): number {
    if (amount < 0) {
      throw new Error('Amount must be non-negative')
    }
    return amount * this.rateToBRL
  }
}
