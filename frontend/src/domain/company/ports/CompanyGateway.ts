import type { CompanyRegistration, Company, CompanyListItem } from '../interfaces/companyInterface'

export interface CompanyGateway {
  register(data: CompanyRegistration): Promise<Company>
  getById(id: string): Promise<Company>
  getByCnpj(cnpj: string): Promise<Company>
  getAll(): Promise<CompanyListItem[]>
  exists(cnpj: string, email: string): Promise<boolean>
}
