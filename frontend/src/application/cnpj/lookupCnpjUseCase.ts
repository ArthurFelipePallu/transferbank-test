/**
 * Lookup CNPJ Use Case - Application Layer
 * Business logic for CNPJ lookup operations
 */

import type { ICnpjGateway } from '@/domain/cnpj/ports/ICnpjGateway'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
import { isCompanyActive, getStatusDescription, getStatusExplanation } from '@/domain/cnpj/entities/CompanyInfo'
import { CompanyStatusError } from '@/domain/cnpj/errors/CompanyStatusError'

/**
 * Lookup company information by CNPJ and validate status
 * @param gateway - CNPJ gateway implementation
 * @param cnpj - CNPJ number to lookup
 * @returns Company information if found and active
 * @throws CompanyStatusError if company is not active
 */
export async function lookupCompanyByCnpj(
  gateway: ICnpjGateway,
  cnpj: string
): Promise<CompanyInfo | null> {
  if (!cnpj || cnpj.trim().length === 0) {
    throw new Error('CNPJ is required')
  }

  const companyInfo = await gateway.lookupByCnpj(cnpj)

  if (!companyInfo) {
    return null
  }

  // Validate company status
  if (!isCompanyActive(companyInfo.situacaoCadastral)) {
    const statusDescription = getStatusDescription(companyInfo.situacaoCadastral)
    const explanation = getStatusExplanation(companyInfo.situacaoCadastral)
    
    throw new CompanyStatusError(
      companyInfo.situacaoCadastral,
      statusDescription,
      companyInfo.razaoSocial,
      explanation
    )
  }

  return companyInfo
}
