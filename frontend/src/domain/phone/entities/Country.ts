/**
 * Country Entity - Domain Layer
 * Represents a country with its phone dialing information
 */

export interface Country {
  readonly name: string
  readonly iso2: string
  readonly dialCode: string
}

/**
 * Country value object with validation
 */
export class CountryVO {
  private constructor(
    public readonly name: string,
    public readonly iso2: string,
    public readonly dialCode: string
  ) {}

  static create(name: string, iso2: string, dialCode: string): CountryVO {
    if (!iso2 || iso2.length !== 2) {
      throw new Error('Invalid ISO2 code: must be 2 characters')
    }
    
    if (!dialCode || !dialCode.startsWith('+')) {
      throw new Error('Invalid dial code: must start with +')
    }
    
    if (!name || name.trim().length === 0) {
      throw new Error('Invalid country name: cannot be empty')
    }
    
    return new CountryVO(name.trim(), iso2.toUpperCase(), dialCode)
  }

  /**
   * Get flag icon class for this country
   */
  getFlagClass(): string {
    return `fi fi-${this.iso2.toLowerCase()}`
  }

  /**
   * Check if this country matches a search query
   */
  matchesSearch(query: string): boolean {
    const lowerQuery = query.toLowerCase()
    return (
      this.name.toLowerCase().includes(lowerQuery) ||
      this.iso2.toLowerCase().includes(lowerQuery) ||
      this.dialCode.includes(query)
    )
  }

  equals(other: CountryVO): boolean {
    return this.iso2 === other.iso2
  }
}
