/**
 * Domain error: raised when a CNPJ lookup reveals the company is already
 * registered in our system. Thrown by the infrastructure layer, caught by
 * the application layer — no HTTP status codes leak into the domain.
 */
export class CnpjAlreadyRegisteredError extends Error {
  constructor(cnpj?: string) {
    super(cnpj ? `CNPJ ${cnpj} is already registered` : 'CNPJ already registered')
    this.name = 'CnpjAlreadyRegisteredError'
  }
}
