export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  companyId: string
  email: string
  companyName: string
  token: string
}
