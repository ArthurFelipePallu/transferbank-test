import type { CompanyGateway } from '@/domain/company/ports/CompanyGateway'
import type { CompanyRegistration, Company, CompanyListItem } from '@/domain/company/interfaces/companyInterface'

export const registerCompany = (
  gateway: CompanyGateway,
  data: CompanyRegistration,
): Promise<Company> => gateway.register(data)

export const getAllCompanies = (
  gateway: CompanyGateway,
): Promise<CompanyListItem[]> => gateway.getAll()

export const getCompanyById = (
  gateway: CompanyGateway,
  id: string,
): Promise<Company> => gateway.getById(id)

export const getCompanyByCnpj = (
  gateway: CompanyGateway,
  cnpj: string,
): Promise<Company> => gateway.getByCnpj(cnpj)

export const checkCompanyExists = (
  gateway: CompanyGateway,
  cnpj: string,
  email: string,
): Promise<boolean> => gateway.exists(cnpj, email)
