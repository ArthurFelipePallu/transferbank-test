/**
 * CNPJ Check-Digit Validator — Domain Utility
 *
 * Validates the two check digits of a Brazilian CNPJ number.
 * A CNPJ is 14 digits: 12 base digits + 2 check digits.
 *
 * Algorithm:
 *   1. Multiply the first 12 digits by weights [5,4,3,2,9,8,7,6,5,4,3,2]
 *   2. Sum the products; remainder = sum % 11
 *   3. First check digit = remainder < 2 ? 0 : 11 - remainder
 *   4. Repeat with 13 digits and weights [6,5,4,3,2,9,8,7,6,5,4,3,2]
 *   5. Second check digit = same rule
 */

const CNPJ_LENGTH = 14
const FIRST_DIGIT_WEIGHTS  = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const SECOND_DIGIT_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const CHECK_DIGIT_THRESHOLD = 2
const CHECK_DIGIT_BASE = 11

function calcCheckDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * (weights[i] ?? 0), 0)
  const remainder = sum % CHECK_DIGIT_BASE
  return remainder < CHECK_DIGIT_THRESHOLD ? 0 : CHECK_DIGIT_BASE - remainder
}

/**
 * Returns true if the 14-digit CNPJ string passes check-digit validation.
 * Does NOT accept masked input — strip non-digits before calling.
 */
export function isValidCnpjCheckDigits(cnpj: string): boolean {
  if (cnpj.length !== CNPJ_LENGTH || !/^\d+$/.test(cnpj)) return false

  // All-same-digit CNPJs are structurally invalid (e.g. 00000000000000)
  const firstDigit = cnpj[0]
  if (cnpj.split('').every((d) => d === firstDigit)) return false

  const digits = cnpj.split('').map(Number)

  const first  = calcCheckDigit(digits.slice(0, 12), FIRST_DIGIT_WEIGHTS)
  if (first !== digits[12]) return false

  const second = calcCheckDigit(digits.slice(0, 13), SECOND_DIGIT_WEIGHTS)
  return second === digits[13]
}

/**
 * Domain rule: a CNPJ where all 14 digits are the same is a test/dev CNPJ.
 * Used to skip the external CNPJ registry lookup for test scenarios.
 * Example: "00000000000000", "11111111111111"
 */
export function isTestCnpj(cnpj: string): boolean {
  const s = cnpj.replace(/\D/g, '')
  return s.length === CNPJ_LENGTH && s.split('').every((d) => d === s[0])
}
