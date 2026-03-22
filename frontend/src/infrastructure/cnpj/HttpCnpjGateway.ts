import axios from 'axios'
import type { ICnpjGateway } from '@/domain/cnpj/ports/ICnpjGateway'
import type { CompanyInfo, CnpjApiResponse } from '@/domain/cnpj/entities/CompanyInfo'
import { sanitizeCnpj } from '@/utils/formatters'
import { InvalidCnpjError } from '@/domain/cnpj/errors/InvalidCnpjError'

/**
 * Routes CNPJ lookups through the backend API proxy, which makes the
 * server-to-server call to publica.cnpj.ws — no CORS issues in any environment.
 *
 * Works in dev (localhost backend), Netlify (Cloud Run backend), and anywhere else
 * as long as VITE_API_URL is set correctly.
 */
const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:5287'
const CNPJ_BASE_URL = `${BACKEND_URL}/api/cnpj`
const CNPJ_REQUIRED_LENGTH = 14
const CNPJ_TIMEOUT_MS = 10_000

export class HttpCnpjGateway implements ICnpjGateway {
  async lookupByCnpj(cnpj: string): Promise<CompanyInfo | null> {
    const sanitized = sanitizeCnpj(cnpj)

    if (sanitized.length !== CNPJ_REQUIRED_LENGTH) {
      throw new InvalidCnpjError(sanitized)
    }

    try {
      const response = await axios.get<CnpjApiResponse>(
        `${CNPJ_BASE_URL}/${sanitized}`,
        { timeout: CNPJ_TIMEOUT_MS },
      )
      return this._mapToCompanyInfo(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) return null
        if (error.response?.status === 400) throw new InvalidCnpjError(sanitized)
        throw new Error(`Failed to lookup CNPJ: ${error.message}`)
      }
      throw error
    }
  }

  private _mapToCompanyInfo(data: CnpjApiResponse): CompanyInfo {
    const est = data.estabelecimento

    const telefone =
      est.ddd1 && est.telefone1 ? `${est.ddd1}${est.telefone1}` : undefined

    const logradouro =
      est.tipo_logradouro && est.logradouro
        ? `${est.tipo_logradouro} ${est.logradouro}`
        : est.logradouro

    return {
      cnpj: est.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: est.nome_fantasia,
      situacaoCadastral: est.situacao_cadastral,
      telefone,
      email: est.email,
      logradouro,
      numero: est.numero,
      complemento: est.complemento,
      bairro: est.bairro,
      municipio: data.municipio?.nome,
      uf: data.uf,
      cep: est.cep,
      socios:
        data.socios?.map((s) => ({
          nome: s.nome,
          cpf: s.cpf_cnpj_socio,
          qualificacao: s.qualificacao_socio?.descricao,
          participacao: s.percentual_capital_social,
        })) ?? [],
    }
  }
}

export const httpCnpjGateway = new HttpCnpjGateway()
