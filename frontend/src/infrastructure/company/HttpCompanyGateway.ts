import { api } from '@/api/apiClient'
import type { CompanyGateway } from '@/domain/company/ports/CompanyGateway'
import type {
  CompanyRegistration,
  Company,
  CompanyListItem,
} from '@/domain/company/interfaces/companyInterface'
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import type { CompanyResponse, PartnerResponse } from '@/api/backendApi'
import { CompanyAlreadyExistsError } from '@/domain/onboarding/errors/CompanyAlreadyExistsError'
import { sanitizeCpf } from '@/utils/formatters'

const toPartnerSummary = (p: PartnerResponse): PartnerSummary => ({
  id: p.id ?? '',
  companyId: p.companyId ?? '',
  fullName: p.fullName ?? '',
  cpf: p.cpf ?? '',
  nationality: p.nationality ?? '',
  shareholding: p.shareholding ?? 0,
  isPep: p.isPep ?? false,
  createdAt: p.createdAt ?? '',
})

const toCompany = (r: CompanyResponse): Company => ({
  id: r.id ?? '',
  cnpj: r.cnpj ?? '',
  companyName: r.companyName ?? '',
  fantasyName: r.fantasyName ?? '',
  cryptoCurrencies: r.cryptoCurrencies ?? [],
  phone: r.phone ?? '',
  email: r.email ?? '',
  partnerCount: r.partnerCount ?? 0,
  partners: (r.partners ?? []).map(toPartnerSummary),
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

const extractValidationMessage = (err: any): string | null => {
  const errors = err?.response?.data?.errors
  if (errors && typeof errors === 'object') {
    return Object.entries(errors)
      .flatMap(([field, msgs]) =>
        Array.isArray(msgs)
          ? (msgs as string[]).map((m) => `: `)
          : [`: `],
      )
      .join('; ')
  }
  return err?.response?.data?.message ?? null
}

class HttpCompanyGatewayImpl implements CompanyGateway {
  async register(data: CompanyRegistration): Promise<Company> {
    try {
      const response = await api.company.companyRegisterCreate({
        cnpj: data.cnpj,
        companyName: data.companyName,
        fantasyName: data.fantasyName,
        cryptoCurrencies: data.cryptoCurrencies,
        phone: data.phone,
        email: data.email,
        password: data.password,
        partners: (data.partners ?? []).map((p) => ({
          fullName: p.fullName,
          cpf: sanitizeCpf(p.cpf),
          nationality: p.nationality,
          shareholding: p.shareholding,
          isPep: p.isPep,
          documents: p.documents
            .filter((d) => d.name && d.size > 0 && d.type)
            .map((d) => ({ name: d.name, size: d.size, type: d.type })),
        })),
      })
      return toCompany(response.data)
    } catch (err: any) {
      if (err?.response?.status === 409) throw new CompanyAlreadyExistsError()
      if (err?.response?.status === 400) {
        const msg = extractValidationMessage(err)
        if (msg) throw new Error(`Validation failed — `)
      }
      throw err
    }
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
    return response.data
  }

  async existsByCnpj(cnpj: string): Promise<boolean> {
    try {
      await api.company.companyCnpjDetail(cnpj)
      return true
    } catch (err: any) {
      if (err?.response?.status === 404) return false
      throw err
    }
  }
}

export const httpCompanyGateway: CompanyGateway = new HttpCompanyGatewayImpl()
