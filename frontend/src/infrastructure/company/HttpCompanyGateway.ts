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
import { PARTNER_SUMMARY_DEFAULTS } from '@/domain/partner/entities/PartnerDefaults'
import { COMPANY_DEFAULTS, COMPANY_LIST_ITEM_DEFAULTS } from '@/domain/company/entities/CompanyDefaults'
import { sanitizeCpf } from '@/utils/formatters'

// ─── Mappers ──────────────────────────────────────────────────────────────────

const toPartnerSummary = (p: PartnerResponse): PartnerSummary => ({
  ...PARTNER_SUMMARY_DEFAULTS,
  id: p.id ?? PARTNER_SUMMARY_DEFAULTS.id,
  companyId: p.companyId ?? PARTNER_SUMMARY_DEFAULTS.companyId,
  fullName: p.fullName ?? PARTNER_SUMMARY_DEFAULTS.fullName,
  cpf: p.cpf ?? PARTNER_SUMMARY_DEFAULTS.cpf,
  nationality: p.nationality ?? PARTNER_SUMMARY_DEFAULTS.nationality,
  shareholding: p.shareholding ?? PARTNER_SUMMARY_DEFAULTS.shareholding,
  isPep: p.isPep ?? PARTNER_SUMMARY_DEFAULTS.isPep,
  createdAt: p.createdAt ?? PARTNER_SUMMARY_DEFAULTS.createdAt,
})

const toCompany = (r: CompanyResponse): Company => ({
  ...COMPANY_DEFAULTS,
  id: r.id ?? COMPANY_DEFAULTS.id,
  cnpj: r.cnpj ?? COMPANY_DEFAULTS.cnpj,
  companyName: r.companyName ?? COMPANY_DEFAULTS.companyName,
  fantasyName: r.fantasyName ?? COMPANY_DEFAULTS.fantasyName,
  cryptoCurrencies: r.cryptoCurrencies ?? COMPANY_DEFAULTS.cryptoCurrencies,
  phone: r.phone ?? COMPANY_DEFAULTS.phone,
  email: r.email ?? COMPANY_DEFAULTS.email,
  partnerCount: r.partnerCount ?? COMPANY_DEFAULTS.partnerCount,
  partners: (r.partners ?? []).map(toPartnerSummary),
  createdAt: r.createdAt ?? COMPANY_DEFAULTS.createdAt,
})

const toCompanyListItem = (r: CompanyResponse): CompanyListItem => ({
  ...COMPANY_LIST_ITEM_DEFAULTS,
  id: r.id ?? COMPANY_LIST_ITEM_DEFAULTS.id,
  cnpj: r.cnpj ?? COMPANY_LIST_ITEM_DEFAULTS.cnpj,
  companyName: r.companyName ?? COMPANY_LIST_ITEM_DEFAULTS.companyName,
  fantasyName: r.fantasyName ?? COMPANY_LIST_ITEM_DEFAULTS.fantasyName,
  cryptoCurrencies: r.cryptoCurrencies ?? COMPANY_LIST_ITEM_DEFAULTS.cryptoCurrencies,
  email: r.email ?? COMPANY_LIST_ITEM_DEFAULTS.email,
  partnerCount: r.partnerCount ?? COMPANY_LIST_ITEM_DEFAULTS.partnerCount,
  createdAt: r.createdAt ?? COMPANY_LIST_ITEM_DEFAULTS.createdAt,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract ASP.NET ValidationProblemDetails errors into a readable string */
const extractValidationMessage = (err: any): string | null => {
  const errors = err?.response?.data?.errors
  if (errors && typeof errors === 'object') {
    return Object.entries(errors)
      .flatMap(([field, msgs]) =>
        Array.isArray(msgs)
          ? (msgs as string[]).map((m) => `${field}: ${m}`)
          : [`${field}: ${msgs}`],
      )
      .join('; ')
  }
  return err?.response?.data?.message ?? null
}

// ─── Gateway ──────────────────────────────────────────────────────────────────

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
          // Only send documents with valid metadata (backend requires size >= 1)
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
        if (msg) throw new Error(`Validation failed — ${msg}`)
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
}

export const httpCompanyGateway: CompanyGateway = new HttpCompanyGatewayImpl()
