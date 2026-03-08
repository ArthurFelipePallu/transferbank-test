import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../useAuthStore'
import * as loginUseCase from '@/application/auth/loginUseCase'
import type { AuthSession } from '@/domain/auth/interfaces/authInterface'

vi.mock('@/application/auth/loginUseCase')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have null user and token initially', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should not be loading initially', () => {
      const store = useAuthStore()
      expect(store.isLoading).toBe(false)
    })

    it('should have no error initially', () => {
      const store = useAuthStore()
      expect(store.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)

      const result = await store.login('test@example.com', 'password123')

      expect(result).toBe(true)
      expect(store.user).toEqual({
        id: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        companyId: 'company-123',
      })
      expect(store.token).toBe('mock-token-123')
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
    })

    it('should store credentials in localStorage on successful login', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)

      await store.login('test@example.com', 'password123')

      expect(localStorage.getItem('auth_token')).toBe('mock-token-123')
      expect(localStorage.getItem('auth_user')).toBeTruthy()
    })

    it('should handle login failure', async () => {
      const store = useAuthStore()
      vi.mocked(loginUseCase.login).mockRejectedValue(new Error('Invalid credentials'))

      const result = await store.login('test@example.com', 'wrong-password')

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Invalid credentials')
    })

    it('should set loading state during login', async () => {
      const store = useAuthStore()
      vi.mocked(loginUseCase.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      const loginPromise = store.login('test@example.com', 'password123')
      expect(store.isLoading).toBe(true)

      await loginPromise
      expect(store.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear user and token', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)
      await store.login('test@example.com', 'password123')

      store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should clear localStorage', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)
      await store.login('test@example.com', 'password123')

      store.logout()

      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('auth_user')).toBeNull()
    })
  })

  describe('restoreSession', () => {
    it('should restore session from localStorage', () => {
      const store = useAuthStore()
      const mockUser = {
        id: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        companyId: 'company-123',
      }

      localStorage.setItem('auth_token', 'mock-token-123')
      localStorage.setItem('auth_user', JSON.stringify(mockUser))

      const result = store.restoreSession()

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe('mock-token-123')
      expect(store.isAuthenticated).toBe(true)
    })

    it('should return false if no session in localStorage', () => {
      const store = useAuthStore()
      const result = store.restoreSession()

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })

    it('should handle corrupted localStorage data', () => {
      const store = useAuthStore()
      localStorage.setItem('auth_token', 'mock-token-123')
      localStorage.setItem('auth_user', 'invalid-json')

      const result = store.restoreSession()

      expect(result).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should compute userEmail correctly', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)
      await store.login('test@example.com', 'password123')

      expect(store.userEmail).toBe('test@example.com')
    })

    it('should compute companyName correctly', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)
      await store.login('test@example.com', 'password123')

      expect(store.companyName).toBe('Test Company')
    })

    it('should compute companyId correctly', async () => {
      const store = useAuthStore()
      const mockSession: AuthSession = {
        companyId: 'company-123',
        email: 'test@example.com',
        companyName: 'Test Company',
        token: 'mock-token-123',
      }

      vi.mocked(loginUseCase.login).mockResolvedValue(mockSession)
      await store.login('test@example.com', 'password123')

      expect(store.companyId).toBe('company-123')
    })
  })
})
