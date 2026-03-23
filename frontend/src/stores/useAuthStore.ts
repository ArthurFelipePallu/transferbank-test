import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginCredentials, AuthSession } from '@/domain/auth/interfaces/authInterface'
import { login as loginUseCase } from '@/application/auth/loginUseCase'
import { authGateway } from '@/infrastructure/gateways'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'
import { USER_DEFAULTS } from '@/domain/auth/entities/AuthDefaults'

export interface User {
  id: string
  email: string
  companyName: string
  companyId: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userEmail = computed(() => user.value?.email ?? USER_DEFAULTS.email)
  const companyName = computed(() => user.value?.companyName ?? USER_DEFAULTS.companyName)
  const companyId = computed(() => user.value?.companyId ?? USER_DEFAULTS.companyId)

  // Actions
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const credentials: LoginCredentials = { email, password }
      const session: AuthSession = await loginUseCase(authGateway, credentials)

      // Map session to user
      user.value = {
        id: session.companyId,
        email: session.email,
        companyName: session.companyName,
        companyId: session.companyId,
      }
      token.value = session.token

      // Store in storage service
      storageService.set(STORAGE_KEYS.AUTH_TOKEN, session.token)
      storageService.set(STORAGE_KEYS.AUTH_USER, user.value)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null

    // Clear storage
    storageService.remove(STORAGE_KEYS.AUTH_TOKEN)
    storageService.remove(STORAGE_KEYS.AUTH_USER)
  }

  const restoreSession = () => {
    try {
      const storedToken = storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN)
      const storedUser = storageService.get<User>(STORAGE_KEYS.AUTH_USER)

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = storedUser
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to restore session:', err)
      return false
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      storageService.set(STORAGE_KEYS.AUTH_USER, user.value)
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userEmail,
    companyName,
    companyId,

    // Actions
    login,
    logout,
    restoreSession,
    updateUser,
  }
})
