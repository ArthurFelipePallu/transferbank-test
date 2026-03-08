import { api } from '@/api/apiClient'
import type { LoginRequest, LoginResponse } from '@/api/backendApi'
import type { LoginCredentials, AuthSession } from '@/domain/auth/interfaces/authInterface'
import type { AuthGateway } from '@/domain/auth/ports/AuthGateway'

const mapToLoginRequest = (credentials: LoginCredentials): LoginRequest => ({
  email: credentials.email,
  password: credentials.password,
})

const mapToAuthSession = (response: LoginResponse): AuthSession => ({
  companyId: response.companyId || '',
  email: response.email || '',
  companyName: response.companyName || '',
  token: response.token || '',
})

export const httpAuthGateway: AuthGateway = {
  async login(credentials) {
    const request = mapToLoginRequest(credentials)
    const response = await api.auth.authLoginCreate(request)
    return mapToAuthSession(response.data)
  },
}
