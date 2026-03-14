/**
 * Reusable Price Change Tracking Composable
 * Tracks price changes and determines which values to display
 * Used by both useAccountSetupCost and useCurrencyInfo
 */

import { ref, computed } from 'vue'

export interface PriceChangeState {
  currentValue: number | null
  previousValue: number | null
  lastSignificantChange: { current: number; previous: number } | null
}

export function usePriceChangeTracking(significanceThreshold = 0.01) {
  const currentValue = ref<number | null>(null)
  const previousValue = ref<number | null>(null)
  const lastSignificantChange = ref<{ current: number; previous: number } | null>(null)

  // Display values: use last significant change if current change is zero/minimal
  const displayCurrentValue = computed(() => {
    if (currentValue.value === null) return null
    
    if (previousValue.value !== null) {
      const difference = Math.abs(currentValue.value - previousValue.value)
      const percentageChange = (difference / previousValue.value) * 100
      
      // If change is significant, use current values
      if (percentageChange > significanceThreshold) {
        return currentValue.value
      }
      
      // If change is minimal and we have a last significant change, use that
      if (lastSignificantChange.value !== null) {
        return lastSignificantChange.value.current
      }
    }
    
    return currentValue.value
  })

  const displayPreviousValue = computed(() => {
    if (previousValue.value === null) return null
    
    if (currentValue.value !== null) {
      const difference = Math.abs(currentValue.value - previousValue.value)
      const percentageChange = (difference / previousValue.value) * 100
      
      // If change is significant, use current values
      if (percentageChange > significanceThreshold) {
        return previousValue.value
      }
      
      // If change is minimal and we have a last significant change, use that
      if (lastSignificantChange.value !== null) {
        return lastSignificantChange.value.previous
      }
    }
    
    return previousValue.value
  })

  /**
   * Update the current value and track changes
   */
  const updateValue = (newValue: number) => {
    // Store previous value before updating
    if (currentValue.value !== null) {
      previousValue.value = currentValue.value
      
      // Check if this is a significant change
      const difference = Math.abs(newValue - currentValue.value)
      const percentageChange = (difference / currentValue.value) * 100
      
      // If change is significant, store it as last significant change
      if (percentageChange > significanceThreshold) {
        lastSignificantChange.value = {
          current: newValue,
          previous: currentValue.value
        }
      }
    }
    
    currentValue.value = newValue
  }

  /**
   * Reset all tracking state
   */
  const reset = () => {
    currentValue.value = null
    previousValue.value = null
    lastSignificantChange.value = null
  }

  return {
    currentValue,
    previousValue,
    displayCurrentValue,
    displayPreviousValue,
    updateValue,
    reset,
  }
}
