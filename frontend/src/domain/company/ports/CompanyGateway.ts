import type { CompanyRegistration, Company, CompanyListItem } from '../interfaces/companyInterface'

export interface CompanyGateway {
  register(data: CompanyRegistration): Promise<Company>
  getById(id: string): Promise<Company>
  getByCnpj(cnpj: string): Promise<Company>
  getAll(): Promise<CompanyListItem[]>
  exists(cnpj: string, email: string): Promise<boolean>
  /** Check if a company with this CNPJ is already registered — no email required */
  existsByCnpj(cnpj: string): Promise<boolean>
}
