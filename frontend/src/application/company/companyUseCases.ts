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

/**
 * Check if a CNPJ is already registered in our system.
 * Uses a CNPJ-only lookup — no email required.
 * Returns true if registered, false if not found.
 */
export const checkCnpjRegistered = (
  gateway: CompanyGateway,
  cnpj: string,
): Promise<boolean> => gateway.existsByCnpj(cnpj)
