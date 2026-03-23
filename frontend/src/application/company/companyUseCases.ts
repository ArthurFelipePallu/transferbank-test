import type { ICompanyGateway } from '@/domain/company/ports/CompanyGateway'
import type { CompanyRegistration, Company, CompanyListItem } from '@/domain/company/interfaces/companyInterface'

export const registerCompany = (
  gateway: ICompanyGateway,
  data: CompanyRegistration,
): Promise<Company> => gateway.register(data)

export const getAllCompanies = (
  gateway: ICompanyGateway,
): Promise<CompanyListItem[]> => gateway.getAll()

export const getCompanyById = (
  gateway: ICompanyGateway,
  id: string,
): Promise<Company> => gateway.getById(id)

export const getCompanyByCnpj = (
  gateway: ICompanyGateway,
  cnpj: string,
): Promise<Company> => gateway.getByCnpj(cnpj)

export const checkCompanyExists = (
  gateway: ICompanyGateway,
  cnpj: string,
  email: string,
): Promise<boolean> => gateway.exists(cnpj, email)

/**
 * Check if a CNPJ is already registered in our system.
 * Uses a CNPJ-only lookup — no email required.
 * Returns true if registered, false if not found.
 */
export const checkCnpjRegistered = (
  gateway: ICompanyGateway,
  cnpj: string,
): Promise<boolean> => gateway.existsByCnpj(cnpj)

/**
 * Check if an email is already registered in our system.
 * Returns true if registered, false if not found.
 */
export const checkEmailRegistered = (
  gateway: ICompanyGateway,
  email: string,
): Promise<boolean> => gateway.existsByEmail(email)
