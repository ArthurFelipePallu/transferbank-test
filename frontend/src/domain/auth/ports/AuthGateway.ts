import type { LoginCredentials, AuthSession } from '../interfaces/authInterface'

export interface AuthGateway {
  login(credentials: LoginCredentials): Promise<AuthSession>
}
