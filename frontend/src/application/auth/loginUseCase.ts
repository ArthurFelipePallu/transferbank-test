import type { AuthGateway } from '@/domain/auth/ports/AuthGateway'
import type { LoginCredentials, AuthSession } from '@/domain/auth/interfaces/authInterface'

export const login = async (
  gateway: AuthGateway,
  credentials: LoginCredentials
): Promise<AuthSession> => {
  return await gateway.login(credentials)
}
