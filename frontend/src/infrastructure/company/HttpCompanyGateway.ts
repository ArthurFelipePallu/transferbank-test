import { api } from '@/api/apiClient'
import { axiosInstance } from '@/api/axiosInstance'
import type { CompanyGateway } from '@/domain/company/ports/CompanyGateway'
import type { CompanyRegistration, Company, CompanyListItem } from '@/domain/company/interfaces/companyInterface'
import type { CompanyResponse } from '@/api/backendApi'

const COMPANY_EXISTS_BY_EMAIL_ENDPOINT = '/api/Company/exists-by-email'

const toCompany = (r: CompanyResponse): Company => ({
  id: r.id ?? '',
  cnpj: r.cnpj ?? '',
  companyName: r.companyName ?? '',
  fantasyName: r.fantasyName ?? '',
  email: r.email ?? '',
  phone: r.phone ?? '',
  cryptoCurrencies: r.cryptoCurrencies ?? [],
  partnerCount: r.partnerCount,
  createdAt: r.createdAt ?? '',
})

const toCompanyListItem = (r: CompanyResponse): CompanyListItem => ({
  id: r.id ?? '',
  cnpj: r.cnpj ?? '',
  companyName: r.companyName ?? '',
  fantasyName: r.fantasyName ?? '',
  cryptoCurrencies: r.cryptoCurrencies ?? [],
  email: r.email ?? '',
  partnerCount: r.partnerCount ?? 0,
  createdAt: r.createdAt ?? '',
})

class HttpCompanyGatewayImpl implements CompanyGateway {
  async register(data: CompanyRegistration): Promise<Company> {
    const response = await api.company.companyRegisterCreate({
      cnpj: data.cnpj,
      companyName: data.companyName,
      fantasyName: data.fantasyName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      cryptoCurrencies: data.cryptoCurrencies,
    })
    return toCompany(response.data)
  }

  async getById(id: string): Promise<Company> {
    const response = await api.company.companyDetail(id)
    return toCompany(response.data)
  }

  async getByCnpj(cnpj: string): Promise<Company> {
    const response = await api.company.companyCnpjDetail(cnpj)
    return toCompany(response.data)
  }

  async getAll(): Promise<CompanyListItem[]> {
    const response = await api.company.companyList()
    return (response.data ?? []).map(toCompanyListItem)
  }

  async exists(cnpj: string, email: string): Promise<boolean> {
    const response = await api.company.companyExistsList({ cnpj, email })
    return response.data ?? false
  }

  async existsByCnpj(cnpj: string): Promise<boolean> {
    const response = await api.company.companyExistsList({ cnpj })
    return response.data ?? false
  }

  async existsByEmail(email: string): Promise<boolean> {
    const response = await axiosInstance.get<boolean>(COMPANY_EXISTS_BY_EMAIL_ENDPOINT, {
      params: { email },
    })
    return response.data ?? false
  }
}

export const httpCompanyGateway: CompanyGateway = new HttpCompanyGatewayImpl()
