import axios from 'axios'
import axiosRetry from 'axios-retry'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'
import { translationService } from '@/infrastructure/i18n/TranslationService'
import { RouteName } from '@/domain/navigation/types/RouteNames'

// Import UI store dynamically to avoid circular dependencies
let uiStore: any = null
const getUiStore = async () => {
  if (!uiStore) {
    const { useUiStore } = await import('@/stores/useUiStore')
    uiStore = useUiStore()
  }
  return uiStore
}

// Import router dynamically to avoid circular dependencies
let router: any = null
const getRouter = async () => {
  if (!router) {
    const routerModule = await import('@/router')
    router = routerModule.default
  }
  return router
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
})

axiosInstance.interceptors.request.use((config) => {
  const token = storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN)
  const locale = storageService.get<string>(STORAGE_KEYS.APP_LOCALE)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (locale) {
    config.headers['Accept-Language'] = locale
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const ui = await getUiStore()

    // Network error (no response from server)
    if (!error.response) {
      ui.showError(translationService.t('errors.networkError'))
      return Promise.reject(error)
    }

    const status = error.response.status
    const errorData = error.response.data
    const errorMessage = extractErrorMessage(error)
    const errorCode = errorData?.errorCode

    // Log error details for debugging
    console.error('API Error:', {
      status,
      errorCode,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method,
      data: errorData,
    })

    // Handle specific status codes that require special actions
    switch (status) {
      case 401:
        // Unauthorized - Check if it's a login error or session expiration
        if (errorCode !== 'Unauthorized') {
          // Session expired - clear auth and redirect
          storageService.remove(STORAGE_KEYS.AUTH_TOKEN)
          storageService.remove(STORAGE_KEYS.AUTH_USER)
          const routerInstance = await getRouter()
          routerInstance.push({ name: RouteName.Login })
        }
        // Show backend error message
        ui.showError(errorMessage)
        break

      case 409:
        // Conflict — gateways are responsible for translating 409 into domain errors.
        // If a 409 reaches here it wasn't handled by a gateway, so show the message.
        ui.showError(errorMessage)
        break

      default:
        // For all other errors, just show the backend message
        ui.showError(errorMessage)
    }

    return Promise.reject(error)
  },
)

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    if (!axios.isAxiosError(error)) return false

    const status = error.response?.status
    const method = error.config?.method?.toUpperCase()

    // Never retry non-idempotent methods (POST, PUT, PATCH, DELETE)
    // Retrying a POST can cause duplicate resource creation
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return false

    // Only retry GET requests on server errors (5xx) or network errors
    return !status || status >= 500
  },
  onRetry: (retryCount, error) => {
    console.log(`Retry attempt ${retryCount} for ${error.config?.url}`)
  },
})

/**
 * Extract error message from error response
 * Prioritizes backend error message over generic messages
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Try to get message from backend error response
    const backendMessage = error.response?.data?.message
    if (backendMessage && typeof backendMessage === 'string') {
      return backendMessage
    }

    // Fallback to axios error message
    return error.message || 'An unexpected error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
