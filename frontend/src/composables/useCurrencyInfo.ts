/**
 * Composable for managing currency information with real-time updates
 * Presentation Layer - connects UI to Application Service
 * Reuses existing infrastructure for currency rates
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { CoinGeckoCurrencyRateProvider } from '@/infrastructure/pricing/CoinGeckoCurrencyRateProvider'
import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { Currency } from '@/domain/pricing/entities/Currency'

export function useCurrencyInfo(currencyCode: CurrencyCode = CurrencyCode.USD) {
  const rateProvider = new CoinGeckoCurrencyRateProvider()
  
  const currentRate = ref<number | null>(null)
  const previousRate = ref<number | null>(null)
  const lastSignificantChange = ref<{ current: number; previous: number } | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  let intervalId: number | null = null

  // Display values: use last significant change if current change is zero/minimal
  const displayCurrentValue = computed(() => {
    if (currentRate.value === null) return null
    
    if (previousRate.value !== null) {
      const difference = Math.abs(currentRate.value - previousRate.value)
      const percentageChange = (difference / previousRate.value) * 100
      
      // If change is significant (> 0.01%), use current values
      if (percentageChange > 0.01) {
        return currentRate.value
      }
      
      // If change is minimal and we have a last significant change, use that
      if (lastSignificantChange.value !== null) {
        return lastSignificantChange.value.current
      }
    }
    
    return currentRate.value
  })

  const displayPreviousValue = computed(() => {
    if (previousRate.value === null) return null
    
    if (currentRate.value !== null) {
      const difference = Math.abs(currentRate.value - previousRate.value)
      const percentageChange = (difference / previousRate.value) * 100
      
      // If change is significant (> 0.01%), use current values
      if (percentageChange > 0.01) {
        return previousRate.value
      }
      
      // If change is minimal and we have a last significant change, use that
      if (lastSignificantChange.value !== null) {
        return lastSignificantChange.value.previous
      }
    }
    
    return previousRate.value
  })

  const updateRate = async () => {
    try {
      const currencies = await rateProvider.fetchRates()
      
      // Find the requested currency
      const currency = currencies.find((c: Currency) => c.code === currencyCode)
      
      if (!currency) {
        // Don't throw error on subsequent updates if we already have a rate
        if (currentRate.value === null) {
          throw new Error(`Currency ${currencyCode} not found`)
        }
        // Keep existing rate and just log warning
        console.warn(`Currency ${currencyCode} not found in update, keeping existing rate`)
        return
      }
      
      // Store previous rate before updating
      if (currentRate.value !== null) {
        previousRate.value = currentRate.value
        
        // Check if this is a significant change
        const difference = Math.abs(currency.rateToBRL - currentRate.value)
        const percentageChange = (difference / currentRate.value) * 100
        
        // If change is significant, store it as last significant change
        if (percentageChange > 0.01) {
          lastSignificantChange.value = {
            current: currency.rateToBRL,
            previous: currentRate.value
          }
        }
      }
      
      currentRate.value = currency.rateToBRL
      lastUpdated.value = currency.lastUpdated
      isLoading.value = false
      error.value = null // Clear any previous errors
    } catch (err) {
      console.error('Error updating currency rate:', err)
      // Only show error if we don't have any rate yet
      if (currentRate.value === null) {
        error.value = 'Failed to fetch currency rate'
      }
      isLoading.value = false
    }
  }

  const startAutoUpdate = () => {
    updateRate()
    intervalId = window.setInterval(() => {
      updateRate()
    }, 5000) // Update every 5 seconds
  }

  const stopAutoUpdate = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const formatRate = (rate: number | null): string => {
    if (rate === null) return 'R$ --,--'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate)
  }

  onMounted(() => {
    startAutoUpdate()
  })

  onUnmounted(() => {
    stopAutoUpdate()
  })

  return {
    currentRate,
    previousRate,
    displayCurrentValue,
    displayPreviousValue,
    lastUpdated,
    isLoading,
    error,
    formatRate,
    updateRate,
  }
}
