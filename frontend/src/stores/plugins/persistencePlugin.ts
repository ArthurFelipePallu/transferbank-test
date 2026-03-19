import type { PiniaPluginContext } from 'pinia'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'

/**
 * Pinia plugin for automatic state persistence to localStorage
 * Follows DDD principles by separating persistence concerns from business logic
 */

interface PersistenceOptions {
  key: string
  paths?: string[]
}

const PERSISTENCE_CONFIG: Record<string, PersistenceOptions> = {
  partner: {
    key: STORAGE_KEYS.PARTNER_FORM_CACHE,
    paths: ['formData', 'currentStep', 'steps'],
  },
}

export function createPersistencePlugin() {
  return (context: PiniaPluginContext) => {
    const { store } = context
    const config = PERSISTENCE_CONFIG[store.$id]

    if (!config) {
      return
    }

    // Restore state from storage on initialization
    const savedState = storageService.get<any>(config.key)
    if (savedState) {
      // Only restore specified paths or all state
      if (config.paths) {
        config.paths.forEach((path) => {
          if (savedState[path] !== undefined) {
            store.$state[path] = savedState[path]
          }
        })
      } else {
        store.$patch(savedState)
      }
    }

    // Subscribe to state changes and persist to storage
    store.$subscribe(
      (mutation, state) => {
        const dataToSave = config.paths
          ? config.paths.reduce((acc, path) => {
              acc[path] = state[path]
              return acc
            }, {} as Record<string, any>)
          : state

        storageService.set(config.key, dataToSave)
      },
      { detached: true }
    )
  }
}
