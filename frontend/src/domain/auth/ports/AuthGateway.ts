import type { LoginCredentials, AuthSession } from '../interfaces/authInterface'

export interface IAuthGateway {
  login(credentials: LoginCredentials): Promise<AuthSession>
}
