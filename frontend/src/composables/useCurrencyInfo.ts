/**
 * Composable for reading currency information from the shared store.
 * Presentation Layer — delegates all fetching/polling to useCurrencyStore.
 */

import { computed } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore'
import { CurrencyCode } from '@/domain/pricing/entities/Currency'

export function useCurrencyInfo(currencyCode: CurrencyCode = CurrencyCode.USD) {
  const currencyStore = useCurrencyStore()

  const currentRate = computed(() => currencyStore.getRateValue(currencyCode))

  const displayValues = computed(() => currencyStore.getDisplayValues(currencyCode))

  const displayCurrentValue = computed(() => displayValues.value.currentValue)
  const displayPreviousValue = computed(() => displayValues.value.previousValue)

  const lastUpdated = computed(() => currencyStore.lastUpdated)
  const isLoading = computed(() => currencyStore.isLoading)
  const error = computed(() => currencyStore.error)

  const formatRate = (_rate?: number | null): string => currencyStore.formatRate(currencyCode)

  return {
    currentRate,
    displayCurrentValue,
    displayPreviousValue,
    lastUpdated,
    isLoading,
    error,
    formatRate,
  }
}
