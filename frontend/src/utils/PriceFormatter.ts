/**
 * Price Formatter Utility
 * Centralized price formatting logic
 */

/**
 * Format a number as BRL currency
 */
export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'R$ --,--'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a number as currency with custom currency code
 */
export function formatCurrency(
  value: number | null | undefined,
  currencyCode: string
): string {
  if (value === null || value === undefined) {
    return '--,--'
  }
  
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    // Fallback for unsupported currency codes (like BTC, ETH)
    return `${value.toFixed(2)} ${currencyCode}`
  }
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '--'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

/**
 * Round up to 2 decimal places
 */
export function roundUp(value: number): number {
  return Math.ceil(value * 100) / 100
}

/**
 * Round to 2 decimal places
 */
export function round(value: number): number {
  return Math.round(value * 100) / 100
}
