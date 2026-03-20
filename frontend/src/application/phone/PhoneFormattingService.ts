/**
 * Phone Formatting Service - Application Layer
 * Handles phone number formatting and parsing logic
 */

import { PhoneNumber } from '@/domain/phone/entities/PhoneNumber'

export class PhoneFormattingService {
  /**
   * Parse a phone string into dial code and number
   */
  parsePhoneString(phoneString: string): { dialCode: string; number: string } {
    if (!phoneString || phoneString.trim().length === 0) {
      return { dialCode: '', number: '' }
    }

    try {
      const phone = PhoneNumber.fromString(phoneString)
      return {
        dialCode: phone.dialCode,
        number: phone.getNumberOnly()
      }
    } catch {
      // If parsing fails, return empty
      return { dialCode: '', number: '' }
    }
  }

  /**
   * Format phone number with dial code
   */
  formatPhoneNumber(dialCode: string, number: string): string {
    if (!dialCode) return number
    if (!number || number.trim().length === 0) return dialCode
    
    return `${dialCode} ${number.trim()}`
  }

  /**
   * Remove dial code from phone string
   */
  removeDialCode(phoneString: string): string {
    if (!phoneString) return ''
    
    const cleaned = phoneString.replace(/^\+\d+\s*/, '').trim()
    return cleaned
  }

  /**
   * Extract dial code from phone string
   */
  extractDialCode(phoneString: string): string {
    if (!phoneString) return ''
    
    const match = phoneString.match(/^(\+\d+)/)
    return match ? match[1]! : ''
  }

  /**
   * Validate phone number format
   */
  isValidPhoneFormat(phoneString: string): boolean {
    if (!phoneString || phoneString.trim().length === 0) return false
    
    try {
      PhoneNumber.fromString(phoneString)
      return true
    } catch {
      return false
    }
  }
}

// Singleton instance
export const phoneFormattingService = new PhoneFormattingService()
