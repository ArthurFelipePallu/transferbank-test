/**
 * Country Flags Utility - Presentation Layer
 * Provides flag icon utilities using flag-icons library
 * 
 * Note: This composable is deprecated in favor of CountryFlag component
 * and Country domain entity. Kept for backward compatibility.
 */

/**
 * Get flag icon class for a country code
 * @param countryCode - ISO2 country code (e.g., 'BR', 'US', 'GB')
 * @returns Flag icon class string (e.g., 'fi fi-br')
 */
export function getFlagClass(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return 'fi'
  }
  
  return `fi fi-${countryCode.toLowerCase()}`
}

/**
 * Get flag emoji for a country code (fallback for systems without flag-icons)
 * @param countryCode - ISO2 country code (e.g., 'BR', 'US', 'GB')
 * @returns Flag emoji string
 */
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️'
  }
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  
  return String.fromCodePoint(...codePoints)
}
