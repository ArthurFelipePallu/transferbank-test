/**
 * Composable for reading account setup cost from the shared store.
 * Presentation Layer — delegates all fetching/polling to usePricingStore.
 */

import { computed } from 'vue'
import { usePricingStore } from '@/stores/usePricingStore'

export function useAccountSetupCost() {
  const pricingStore = usePricingStore()

  const currentPrice = computed(() => pricingStore.currentPrice)
  const priceData = computed(() => pricingStore.accountSetupPrice)

  const displayCurrentValue = computed(() => pricingStore.displayValues.currentValue)
  const displayPreviousValue = computed(() => pricingStore.displayValues.previousValue)

  const isLoading = computed(() => pricingStore.isCalculating)
  const error = computed(() => pricingStore.error)

  const formattedCost = () => pricingStore.formatPrice()

  return {
    priceData,
    currentPrice,
    displayCurrentValue,
    displayPreviousValue,
    isLoading,
    error,
    formattedCost,
  }
}
