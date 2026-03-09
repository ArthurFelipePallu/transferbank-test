/**
 * Company Status Error - Domain Layer
 * Custom error for inactive company status
 */

export class CompanyStatusError extends Error {
  constructor(
    public readonly status: string,
    public readonly statusDescription: string,
    public readonly companyName: string,
    public readonly explanation?: string
  ) {
    const detailedMessage = explanation 
      ? `Company "${companyName}" is ${statusDescription}. ${explanation}`
      : `Company "${companyName}" is ${statusDescription} and cannot be registered`
    
    super(detailedMessage)
    this.name = 'CompanyStatusError'
  }
}
