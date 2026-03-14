/**
 * Composable for managing account setup cost with real-time updates
 * Presentation Layer - connects UI to Application Service
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { AccountSetupPriceService } from '@/application/pricing/AccountSetupPriceService'
import { CoinGeckoCurrencyRateProvider } from '@/infrastructure/pricing/CoinGeckoCurrencyRateProvider'
import type { AccountSetupPriceResult } from '@/application/pricing/AccountSetupPriceService'

export function useAccountSetupCost() {
  // Dependency Injection - create services
  const rateProvider = new CoinGeckoCurrencyRateProvider()
  const priceService = new AccountSetupPriceService(rateProvider)

  const priceData = ref<AccountSetupPriceResult | null>(null)
  const previousPrice = ref<number | null>(null)
  const lastSignificantChange = ref<{ current: number; previous: number } | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  let intervalId: number | null = null

  const currentPrice = computed(() => priceData.value?.priceBRL ?? null)

  // Display values: use last significant change if current change is zero/minimal
  const displayCurrentValue = computed(() => {
    if (currentPrice.value === null) return null
    
    // If we have a previous price, check if change is significant
    if (previousPrice.value !== null) {
      const difference = Math.abs(currentPrice.value - previousPrice.value)
      const percentageChange = (difference / previousPrice.value) * 100
      
      // If change is significant (> 0.01%), use current values
      if (percentageChange > 0.01) {
        return currentPrice.value
      }
      
      // If change is minimal and we have a last significant change, use that
      if (lastSignificantChange.value !== null) {
        return lastSignificantChange.value.current
      }
    }
    
    return currentPrice.value
  })

  const displayPreviousValue = computed(() => {
    if (previousPrice.value === null) return null
    
    // If we have a previous price, check if change is significant
    if (currentPrice.value !== null) {
      const difference = Math.abs(currentPrice.value - previousPrice.value)
      const percentageChange = (difference / previousPrice.value) * 100
      
      // If change is significant (> 0.01%), use current values
      if (percentageChange > 0.01) {
        return previousPrice.value
      }
      
      // If change is minimal and we have a last significant change, use that
      if (lastSignificantChange.value !== null) {
        return lastSignificantChange.value.previous
      }
    }
    
    return previousPrice.value
  })

  const updateCost = async () => {
    try {
      error.value = null
      const newPriceData = await priceService.getCurrentPrice()
      
      // Store previous price before updating
      if (priceData.value !== null) {
        previousPrice.value = priceData.value.priceBRL
        
        // Check if this is a significant change
        const difference = Math.abs(newPriceData.priceBRL - priceData.value.priceBRL)
        const percentageChange = (difference / priceData.value.priceBRL) * 100
        
        // If change is significant, store it as last significant change
        if (percentageChange > 0.01) {
          lastSignificantChange.value = {
            current: newPriceData.priceBRL,
            previous: priceData.value.priceBRL
          }
        }
      }
      
      priceData.value = newPriceData
      isLoading.value = false
    } catch (err) {
      console.error('Error updating account setup cost:', err)
      error.value = 'Failed to fetch current prices'
      isLoading.value = false
    }
  }

  const startAutoUpdate = () => {
    // Initial fetch
    updateCost()

    // Update every 5 seconds
    intervalId = window.setInterval(() => {
      updateCost()
    }, 5000)
  }

  const stopAutoUpdate = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onMounted(() => {
    startAutoUpdate()
  })

  onUnmounted(() => {
    stopAutoUpdate()
  })

  const formattedCost = () => {
    if (!priceData.value) return 'R$ --,--'
    return priceService.formatPrice(priceData.value.priceBRL)
  }

  return {
    priceData,
    currentPrice,
    previousPrice,
    displayCurrentValue,
    displayPreviousValue,
    isLoading,
    error,
    formattedCost,
    updateCost,
  }
}
