/**
 * InvalidCnpjError — Domain Layer
 * Thrown when a CNPJ fails check-digit validation (arithmetically invalid).
 */
export class InvalidCnpjError extends Error {
  constructor(cnpj: string) {
    super(`CNPJ "${cnpj}" is arithmetically invalid (check-digit mismatch).`)
    this.name = 'InvalidCnpjError'
  }
}
