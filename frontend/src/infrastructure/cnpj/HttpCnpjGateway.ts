/**
 * HTTP CNPJ Gateway - Infrastructure Layer
 * Concrete implementation using CNPJ.ws API
 */

import axios from 'axios'
import type { ICnpjGateway } from '@/domain/cnpj/ports/ICnpjGateway'
import type { CompanyInfo, CnpjApiResponse } from '@/domain/cnpj/entities/CompanyInfo'
import { sanitizeCnpj } from '@/utils/formatters'

export class HttpCnpjGateway implements ICnpjGateway {
  private readonly baseUrl = 'https://publica.cnpj.ws/cnpj'

  async lookupByCnpj(cnpj: string): Promise<CompanyInfo | null> {
    try {
      // Sanitize CNPJ (remove formatting)
      const sanitizedCnpj = sanitizeCnpj(cnpj)

      if (sanitizedCnpj.length !== 14) {
        throw new Error('CNPJ must have 14 digits')
      }

      console.log('[CNPJ Lookup] Fetching:', sanitizedCnpj)
      
      const response = await axios.get<CnpjApiResponse>(
        `${this.baseUrl}/${sanitizedCnpj}`,
        {
          timeout: 10000, // 10 second timeout
        }
      )

      console.log('[CNPJ Lookup] Response received:', {
        razaoSocial: response.data.razao_social,
        situacao: response.data.estabelecimento?.situacao_cadastral
      })

      return this.mapToCompanyInfo(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[CNPJ Lookup] Error:', error.response?.status, error.message)
        if (error.response?.status === 404) {
          return null // CNPJ not found
        }
        throw new Error(`Failed to lookup CNPJ: ${error.message}`)
      }
      console.error('[CNPJ Lookup] Unexpected error:', error)
      throw error
    }
  }

  private mapToCompanyInfo(data: CnpjApiResponse): CompanyInfo {
    const estabelecimento = data.estabelecimento

    // Format phone number
    const telefone = estabelecimento.ddd1 && estabelecimento.telefone1
      ? `${estabelecimento.ddd1}${estabelecimento.telefone1}`
      : undefined

    // Build full address
    const logradouro = estabelecimento.tipo_logradouro && estabelecimento.logradouro
      ? `${estabelecimento.tipo_logradouro} ${estabelecimento.logradouro}`
      : estabelecimento.logradouro

    return {
      cnpj: estabelecimento.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: estabelecimento.nome_fantasia,
      situacaoCadastral: estabelecimento.situacao_cadastral,
      telefone,
      email: estabelecimento.email,
      logradouro,
      numero: estabelecimento.numero,
      complemento: estabelecimento.complemento,
      bairro: estabelecimento.bairro,
      municipio: data.municipio?.nome,
      uf: data.uf,
      cep: estabelecimento.cep,
    }
  }
}

// Singleton instance
export const httpCnpjGateway = new HttpCnpjGateway()
