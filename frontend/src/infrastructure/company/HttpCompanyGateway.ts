import { api } from '@/api/apiClient'
import type { RegisterCompanyRequest, CompanyResponse } from '@/api/backendApi'
import type {
  CompanyRegistration,
  Company,
  CompanyListItem,
} from '@/domain/company/interfaces/companyInterface'
import type { CompanyGateway } from '@/domain/company/ports/CompanyGateway'

const mapToRegisterRequest = (data: CompanyRegistration): RegisterCompanyRequest => ({
  cnpj: data.cnpj,
  companyName: data.companyName,
  fantasyName: data.fantasyName,
  cryptoCurrencies: data.cryptoCurrencies,
  phone: data.phone,
  email: data.email,
  password: data.password,
})

const mapToCompany = (response: CompanyResponse): Company => ({
  id: response.id || '',
  cnpj: response.cnpj || '',
  companyName: response.companyName || '',
  fantasyName: response.fantasyName || '',
  cryptoCurrencies: response.cryptoCurrencies || [],
  phone: response.phone || '',
  email: response.email || '',
  partnerCount: response.partnerCount || 0,
  createdAt: response.createdAt || '',
})

const mapToCompanyListItem = (response: CompanyResponse): CompanyListItem => ({
  id: response.id || '',
  cnpj: response.cnpj || '',
  companyName: response.companyName || '',
  fantasyName: response.fantasyName || '',
  cryptoCurrencies: response.cryptoCurrencies || [],
  email: response.email || '',
  partnerCount: response.partnerCount || 0,
  createdAt: response.createdAt || '',
})

export const httpCompanyGateway: CompanyGateway = {
  async register(data) {
    const request = mapToRegisterRequest(data)
    const response = await api.company.companyRegisterCreate(request)
    return mapToCompany(response.data)
  },

  async getById(id) {
    const response = await api.company.companyDetail(id)
    return mapToCompany(response.data)
  },

  async getByCnpj(cnpj) {
    const response = await api.company.companyCnpjDetail(cnpj)
    return mapToCompany(response.data)
  },

  async getAll() {
    const response = await api.company.companyList()
    return response.data.map(mapToCompanyListItem)
  },

  async exists(cnpj, email) {
    const response = await api.company.companyExistsList({ cnpj, email })
    return response.data
  },
}
