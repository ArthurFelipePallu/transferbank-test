/**
 * HTTP CEP Gateway - Infrastructure Layer
 * Routes CEP lookups through the backend proxy to avoid browser CORS restrictions.
 */

import axios from 'axios'
import { axiosInstance } from '@/api/axiosInstance'
import type { ICepGateway } from '@/domain/address/ports/ICepGateway'
import type { Address, ViaCepResponse } from '@/domain/address/entities/Address'
import { sanitizeCep } from '@/utils/formatters'

const CEP_ENDPOINT = '/api/cep'
const CEP_REQUIRED_LENGTH = 8

export class HttpCepGateway implements ICepGateway {
  async lookupByCep(cep: string): Promise<Address | null> {
    const sanitized = sanitizeCep(cep)

    if (sanitized.length !== CEP_REQUIRED_LENGTH) {
      throw new Error('CEP must have 8 digits')
    }

    try {
      const response = await axiosInstance.get<ViaCepResponse>(
        `${CEP_ENDPOINT}/${sanitized}`,
      )
      return this.mapToAddress(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) return null
        throw new Error(`Failed to lookup CEP: ${error.message}`)
      }
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

export const httpCepGateway = new HttpCepGateway()