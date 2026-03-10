/**
 * Generic Async Lookup Composable - Presentation Layer
 * Reusable composable for any async lookup operation
 * Follows DRY principle by extracting common lookup pattern
 */

import { ref } from 'vue'

export interface AsyncLookupOptions<TResult, TError = Error> {
  onSuccess?: (result: TResult) => void
  onError?: (error: TError) => void
  logPrefix?: string
}

export function useAsyncLookup<TResult, TError = Error>(
  options: AsyncLookupOptions<TResult, TError> = {}
) {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const specificError = ref<TError | null>(null)
  const result = ref<TResult | null>(null)

  const lookup = async (
    lookupFn: () => Promise<TResult | null>,
    errorType?: new (...args: any[]) => TError
  ): Promise<TResult | null> => {
    isLoading.value = true
    error.value = null
    specificError.value = null
    result.value = null

    if (options.logPrefix) {
      console.log(`[${options.logPrefix}] Starting lookup`)
    }

    try {
      const data = await lookupFn()
      result.value = data

      if (options.logPrefix) {
        console.log(`[${options.logPrefix}] Lookup successful:`, data)
      }

      if (data !== null) {
        options.onSuccess?.(data as TResult)
      }
      return data
    } catch (err) {
      if (options.logPrefix) {
        console.error(`[${options.logPrefix}] Lookup error:`, err)
      }

      // Check if error is of specific type
      if (errorType && err instanceof errorType) {
        specificError.value = err as TError
        error.value = err instanceof Error ? err.message : 'Lookup failed'
      } else {
        error.value = err instanceof Error ? err.message : 'Lookup failed'
      }

      options.onError?.(err as TError)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    isLoading.value = false
    error.value = null
    specificError.value = null
    result.value = null
  }

  return {
    isLoading,
    error,
    specificError,
    result,
    lookup,
    reset,
  }
}
