/**
 * Currency Store - Domain State Management
 * Manages currency rates with shared state across the application
 * Follows DDD principles: Store acts as Repository pattern
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CoinGeckoCurrencyRateProvider } from '@/infrastructure/pricing/CoinGeckoCurrencyRateProvider'
import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { Currency } from '@/domain/pricing/entities/Currency'
import { usePriceChangeTracking } from '@/composables/domain/usePriceChangeTracking'
import { TIMING_CONFIG } from '@/config/timing.config'
import { formatBRL } from '@/utils/PriceFormatter'

export const useCurrencyStore = defineStore('currency', () => {
  // Single rate provider instance (Dependency Injection)
  const rateProvider = new CoinGeckoCurrencyRateProvider()
  
  // State
  const rates = ref<Map<CurrencyCode, Currency>>(new Map())
  const lastUpdated = ref<Date | null>(null)
  const isLoading = ref(false)
  const isInitialLoad = ref(true)
  const error = ref<string | null>(null)
  
  // Price change tracking per currency
  const priceTrackers = new Map<CurrencyCode, ReturnType<typeof usePriceChangeTracking>>()
  
  let updateInterval: number | null = null
  
  // Getters
  const getRate = computed(() => {
    return (code: CurrencyCode) => rates.value.get(code)
  })
  
  const getRateValue = computed(() => {
    return (code: CurrencyCode) => rates.value.get(code)?.rateToBRL ?? null
  })
  
  const getAllRates = computed(() => {
    return Array.from(rates.value.values())
  })
  
  const hasRates = computed(() => {
    return rates.value.size > 0
  })
  
  // Get or create price tracker for a currency
  const getPriceTracker = (code: CurrencyCode) => {
    if (!priceTrackers.has(code)) {
      priceTrackers.set(code, usePriceChangeTracking())
    }
    return priceTrackers.get(code)!
  }
  
  // Get display values for price change indicator
  const getDisplayValues = (code: CurrencyCode) => {
    const tracker = getPriceTracker(code)
    return {
      currentValue: tracker.displayCurrentValue.value,
      previousValue: tracker.displayPreviousValue.value,
    }
  }
  
  // Actions
  const fetchRates = async () => {
    try {
      // Only show loading on initial load
      if (isInitialLoad.value) {
        isLoading.value = true
      }
      error.value = null
      
      const currencies = await rateProvider.fetchRates()
      
      // Update rates map and price trackers
      currencies.forEach(currency => {
        rates.value.set(currency.code, currency)
        
        // Update price tracker
        const tracker = getPriceTracker(currency.code)
        tracker.updateValue(currency.rateToBRL)
      })
      
      lastUpdated.value = new Date()
      
      // Mark initial load as complete
      if (isInitialLoad.value) {
        isInitialLoad.value = false
      }
    } catch (err) {
      console.error('Error fetching currency rates:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch currency rates'
      
      // If rate limited (429), stop auto-updates temporarily
      if (err instanceof Error && err.message.includes('429')) {
        console.warn('Rate limited by API. Stopping auto-updates for 5 minutes.')
        stopAutoUpdate()
        // Resume after 5 minutes
        setTimeout(() => {
          console.log('Resuming currency updates...')
          startAutoUpdate()
        }, 300000) // 5 minutes
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const startAutoUpdate = (intervalMs = TIMING_CONFIG.CURRENCY_UPDATE_INTERVAL) => {
    // Initial fetch
    fetchRates()
    
    // Set up interval
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    updateInterval = window.setInterval(fetchRates, intervalMs)
  }
  
  const stopAutoUpdate = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
  
  const formatRate = (code: CurrencyCode): string => {
    const rate = getRateValue.value(code)
    return formatBRL(rate)
  }
  
  const reset = () => {
    stopAutoUpdate()
    rates.value.clear()
    priceTrackers.clear()
    lastUpdated.value = null
    error.value = null
    isLoading.value = false
    isInitialLoad.value = true
  }
  
  return {
    // State
    rates,
    lastUpdated,
    isLoading,
    error,
    
    // Getters
    getRate,
    getRateValue,
    getAllRates,
    hasRates,
    getDisplayValues,
    
    // Actions
    fetchRates,
    startAutoUpdate,
    stopAutoUpdate,
    formatRate,
    reset,
  }
})
