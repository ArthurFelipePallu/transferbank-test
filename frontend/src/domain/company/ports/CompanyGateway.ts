import type { CompanyRegistration, Company, CompanyListItem } from '../interfaces/companyInterface'

export interface CompanyGateway {
  register(data: CompanyRegistration): Promise<Company>
  getById(id: string): Promise<Company>
  getByCnpj(cnpj: string): Promise<Company>
  getAll(): Promise<CompanyListItem[]>
  exists(cnpj: string, email: string): Promise<boolean>
  existsByCnpj(cnpj: string): Promise<boolean>
  /** Check if a company with this email is already registered */
  existsByEmail(email: string): Promise<boolean>
}
