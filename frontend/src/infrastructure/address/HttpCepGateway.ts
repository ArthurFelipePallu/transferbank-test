/**
 * HTTP CEP Gateway - Infrastructure Layer
 * Concrete implementation using ViaCEP API
 */

import axios from 'axios'
import type { ICepGateway } from '@/domain/address/ports/ICepGateway'
import type { Address, ViaCepResponse } from '@/domain/address/entities/Address'
import { sanitizeCep } from '@/utils/formatters'

export class HttpCepGateway implements ICepGateway {
  private readonly baseUrl = 'https://viacep.com.br/ws'

  async lookupByCep(cep: string): Promise<Address | null> {
    try {
      // Sanitize CEP (remove formatting)
      const sanitizedCep = sanitizeCep(cep)

      if (sanitizedCep.length !== 8) {
        throw new Error('CEP must have 8 digits')
      }

      console.log('[CEP Lookup] Fetching:', sanitizedCep)

      const response = await axios.get<ViaCepResponse>(
        `${this.baseUrl}/${sanitizedCep}/json/`,
        {
          timeout: 10000, // 10 second timeout
        }
      )

      // ViaCEP returns { erro: true } when CEP is not found
      if (response.data.erro) {
        console.log('[CEP Lookup] CEP not found')
        return null
      }

      console.log('[CEP Lookup] Response received:', response.data)

      return this.mapToAddress(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[CEP Lookup] Error:', error.response?.status, error.message)
        if (error.response?.status === 404) {
          return null // CEP not found
        }
        throw new Error(`Failed to lookup CEP: ${error.message}`)
      }
      console.error('[CEP Lookup] Unexpected error:', error)
      throw error
    }
  }

  private mapToAddress(data: ViaCepResponse): Address {
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    }
  }
}

// Singleton instance
export const httpCepGateway = new HttpCepGateway()
