import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginCredentials, AuthSession } from '@/domain/auth/interfaces/authInterface'
import { login as loginUseCase } from '@/application/auth/loginUseCase'
import { httpAuthGateway } from '@/infrastructure/auth/HttpAuthGateway'

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
  const userEmail = computed(() => user.value?.email ?? '')
  const companyName = computed(() => user.value?.companyName ?? '')
  const companyId = computed(() => user.value?.companyId ?? '')

  // Actions
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const credentials: LoginCredentials = { email, password }
      const session: AuthSession = await loginUseCase(httpAuthGateway, credentials)

      // Map session to user
      user.value = {
        id: session.companyId,
        email: session.email,
        companyName: session.companyName,
        companyId: session.companyId,
      }
      token.value = session.token

      // Store in localStorage
      localStorage.setItem('auth_token', session.token)
      localStorage.setItem('auth_user', JSON.stringify(user.value))

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

    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const restoreSession = () => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
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
      localStorage.setItem('auth_user', JSON.stringify(user.value))
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
