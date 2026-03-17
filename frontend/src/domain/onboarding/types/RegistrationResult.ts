/**
 * Registration Result - Domain Enum
 * Outcome of the company registration use case.
 * Defined in the domain so no layer above needs to know about HTTP codes.
 */
export enum RegistrationResult {
  Success = 'success',
  AlreadyExists = 'already_exists',
  Error = 'error',
}
