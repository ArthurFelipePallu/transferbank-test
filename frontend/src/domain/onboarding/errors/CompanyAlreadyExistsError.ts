/**
 * Domain error thrown when a company registration is rejected
 * because the CNPJ or email is already registered.
 *
 * Raised by the gateway/infrastructure layer and caught by the
 * application layer — keeps HTTP status codes out of the domain.
 */
export class CompanyAlreadyExistsError extends Error {
  constructor(message = 'Company already exists') {
    super(message)
    this.name = 'CompanyAlreadyExistsError'
  }
}
