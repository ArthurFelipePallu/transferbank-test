import type { CompanyGateway } from '@/domain/company/ports/CompanyGateway'
import type { CompanyRegistration, Company } from '@/domain/company/interfaces/companyInterface'

export const registerCompany = async (
  gateway: CompanyGateway,
  data: CompanyRegistration
): Promise<Company> => {
  return await gateway.register(data)
}

export const getCompanyById = async (
  gateway: CompanyGateway,
  id: string
): Promise<Company> => {
  return await gateway.getById(id)
}

export const getCompanyByCnpj = async (
  gateway: CompanyGateway,
  cnpj: string
): Promise<Company> => {
  return await gateway.getByCnpj(cnpj)
}

export const checkCompanyExists = async (
  gateway: CompanyGateway,
  cnpj: string,
  email: string
): Promise<boolean> => {
  return await gateway.exists(cnpj, email)
}
