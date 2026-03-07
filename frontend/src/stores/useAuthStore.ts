import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  fullName: string
  companyId?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
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
  const userName = computed(() => user.value?.fullName ?? '')

  // Actions
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        fullName: 'John Doe',
      }

      const mockToken = 'mock-jwt-token-' + Date.now()

      user.value = mockUser
      token.value = mockToken

      // Store in localStorage
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('auth_user', JSON.stringify(mockUser))

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
    userName,

    // Actions
    login,
    logout,
    restoreSession,
    updateUser,
  }
})
