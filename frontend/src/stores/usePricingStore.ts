/**
 * Pricing Store - Domain State Management
 * Manages pricing calculations with shared state
 * Depends on Currency Store for rates (Dependency Inversion)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AccountSetupPriceService } from '@/application/pricing/AccountSetupPriceService'
import { CoinGeckoCurrencyRateProvider } from '@/infrastructure/pricing/CoinGeckoCurrencyRateProvider'
import { usePriceChangeTracking } from '@/composables/usePriceChangeTracking'
import type { AccountSetupPriceResult } from '@/application/pricing/AccountSetupPriceService'
import { TIMING_CONFIG } from '@/config/timing.config'
import { formatBRL } from '@/utils/PriceFormatter'

export const usePricingStore = defineStore('pricing', () => {
  // Dependency Injection
  const rateProvider = new CoinGeckoCurrencyRateProvider()
  const priceService = new AccountSetupPriceService(rateProvider)
  
  // State
  const accountSetupPrice = ref<AccountSetupPriceResult | null>(null)
  const isCalculating = ref(false)
  const isInitialCalculation = ref(true)
  const error = ref<string | null>(null)
  
  // Price change tracking
  const priceTracker = usePriceChangeTracking()
  
  let updateInterval: number | null = null
  
  // Getters
  const currentPrice = computed(() => accountSetupPrice.value?.priceBRL ?? null)
  
  const priceBreakdown = computed(() => accountSetupPrice.value?.breakdown ?? null)
  
  const selectedCurrency = computed(() => accountSetupPrice.value?.selectedCurrency ?? null)
  
  const lastUpdated = computed(() => accountSetupPrice.value?.lastUpdated ?? null)
  
  const displayValues = computed(() => ({
    currentValue: priceTracker.displayCurrentValue.value,
    previousValue: priceTracker.displayPreviousValue.value,
  }))
  
  const hasPrice = computed(() => accountSetupPrice.value !== null)
  
  // Actions
  const calculatePrice = async () => {
    try {
      // Only show loading on initial calculation
      if (isInitialCalculation.value) {
        isCalculating.value = true
      }
      error.value = null
      
      const result = await priceService.getCurrentPrice()
      
      // Update price tracker
      if (accountSetupPrice.value?.priceBRL) {
        priceTracker.updateValue(result.priceBRL)
      } else {
        // First time, just set the value
        priceTracker.updateValue(result.priceBRL)
      }
      
      accountSetupPrice.value = result
      
      // Mark initial calculation as complete
      if (isInitialCalculation.value) {
        isInitialCalculation.value = false
      }
    } catch (err) {
      console.error('Error calculating price:', err)
      error.value = err instanceof Error ? err.message : 'Failed to calculate price'
    } finally {
      isCalculating.value = false
    }
  }
  
  const startAutoUpdate = (intervalMs = TIMING_CONFIG.PRICING_UPDATE_INTERVAL) => {
    // Initial calculation
    calculatePrice()
    
    // Set up interval
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    updateInterval = window.setInterval(calculatePrice, intervalMs)
  }
  
  const stopAutoUpdate = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
  
  const formatPrice = (): string => {
    return formatBRL(currentPrice.value)
  }
  
  const reset = () => {
    stopAutoUpdate()
    accountSetupPrice.value = null
    priceTracker.reset()
    error.value = null
    isCalculating.value = false
    isInitialCalculation.value = true
  }
  
  return {
    // State
    accountSetupPrice,
    isCalculating,
    error,
    
    // Getters
    currentPrice,
    priceBreakdown,
    selectedCurrency,
    lastUpdated,
    displayValues,
    hasPrice,
    
    // Actions
    calculatePrice,
    startAutoUpdate,
    stopAutoUpdate,
    formatPrice,
    reset,
  }
})
