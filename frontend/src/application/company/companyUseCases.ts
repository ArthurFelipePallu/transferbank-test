import { httpCompanyGateway } from '@/infrastructure/company/HttpCompanyGateway'
import type { CompanyListItem } from '@/domain/company/interfaces/companyInterface'

export const getAllCompanies = async (): Promise<CompanyListItem[]> => {
  return await httpCompanyGateway.getAll()
}

export const getCompanyById = async (id: string) => {
  return await httpCompanyGateway.getById(id)
}

export const getCompanyByCnpj = async (cnpj: string) => {
  return await httpCompanyGateway.getByCnpj(cnpj)
}
