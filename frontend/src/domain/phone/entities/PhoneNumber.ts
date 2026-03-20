/**
 * PhoneNumber Value Object - Domain Layer
 * Represents a phone number with country code
 */

export class PhoneNumber {
  private constructor(
    public readonly dialCode: string,
    public readonly number: string
  ) {}

  static create(dialCode: string, number: string): PhoneNumber {
    if (!dialCode || !dialCode.startsWith('+')) {
      throw new Error('Invalid dial code')
    }
    
    return new PhoneNumber(dialCode, number.trim())
  }

  /**
   * Create from full phone string (e.g., "+55 11 99999-9999")
   */
  static fromString(phoneString: string): PhoneNumber {
    if (!phoneString || phoneString.trim().length === 0) {
      throw new Error('Phone string cannot be empty')
    }

    const match = phoneString.match(/^(\+\d+)\s*(.*)$/)
    if (!match) {
      throw new Error('Invalid phone format')
    }

    return new PhoneNumber(match[1]!, match[2]!.trim())
  }

  /**
   * Get the full phone number as string
   */
  toString(): string {
    return this.number ? `${this.dialCode} ${this.number}` : this.dialCode
  }

  /**
   * Get just the number without dial code
   */
  getNumberOnly(): string {
    return this.number
  }

  /**
   * Check if phone number is empty (only has dial code)
   */
  isEmpty(): boolean {
    return !this.number || this.number.trim().length === 0
  }

  /**
   * Create a new PhoneNumber with updated number
   */
  withNumber(newNumber: string): PhoneNumber {
    return new PhoneNumber(this.dialCode, newNumber.trim())
  }

  /**
   * Create a new PhoneNumber with updated dial code
   */
  withDialCode(newDialCode: string): PhoneNumber {
    return new PhoneNumber(newDialCode, this.number)
  }
}
