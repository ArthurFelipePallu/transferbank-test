/**
 * Brazilian State Entity - Domain Layer
 * Represents a Brazilian state with its area codes (DDD)
 */

export interface BrazilianState {
  code: string // UF code (e.g., 'SP', 'RJ')
  name: string // Full state name
  ddds: string[] // Area codes for this state
  flag: string // Emoji flag or icon
  region: string // Geographic region
}

/**
 * Brazilian States Database
 * Maps area codes (DDD) to their respective states
 */
export const BRAZILIAN_STATES: BrazilianState[] = [
  // Southeast
  { code: 'SP', name: 'São Paulo', ddds: ['11', '12', '13', '14', '15', '16', '17', '18', '19'], flag: '🏙️', region: 'Southeast' },
  { code: 'RJ', name: 'Rio de Janeiro', ddds: ['21', '22', '24'], flag: '🏖️', region: 'Southeast' },
  { code: 'MG', name: 'Minas Gerais', ddds: ['31', '32', '33', '34', '35', '37', '38'], flag: '⛰️', region: 'Southeast' },
  { code: 'ES', name: 'Espírito Santo', ddds: ['27', '28'], flag: '🌊', region: 'Southeast' },
  
  // South
  { code: 'PR', name: 'Paraná', ddds: ['41', '42', '43', '44', '45', '46'], flag: '🌲', region: 'South' },
  { code: 'SC', name: 'Santa Catarina', ddds: ['47', '48', '49'], flag: '🏔️', region: 'South' },
  { code: 'RS', name: 'Rio Grande do Sul', ddds: ['51', '53', '54', '55'], flag: '🧉', region: 'South' },
  
  // Northeast
  { code: 'BA', name: 'Bahia', ddds: ['71', '73', '74', '75', '77'], flag: '🥥', region: 'Northeast' },
  { code: 'SE', name: 'Sergipe', ddds: ['79'], flag: '🦐', region: 'Northeast' },
  { code: 'AL', name: 'Alagoas', ddds: ['82'], flag: '🏝️', region: 'Northeast' },
  { code: 'PE', name: 'Pernambuco', ddds: ['81', '87'], flag: '🎭', region: 'Northeast' },
  { code: 'PB', name: 'Paraíba', ddds: ['83'], flag: '🌴', region: 'Northeast' },
  { code: 'RN', name: 'Rio Grande do Norte', ddds: ['84'], flag: '🦀', region: 'Northeast' },
  { code: 'CE', name: 'Ceará', ddds: ['85', '88'], flag: '⛱️', region: 'Northeast' },
  { code: 'PI', name: 'Piauí', ddds: ['86', '89'], flag: '🌵', region: 'Northeast' },
  { code: 'MA', name: 'Maranhão', ddds: ['98', '99'], flag: '🦜', region: 'Northeast' },
  
  // North
  { code: 'AM', name: 'Amazonas', ddds: ['92', '97'], flag: '🌳', region: 'North' },
  { code: 'RR', name: 'Roraima', ddds: ['95'], flag: '🏞️', region: 'North' },
  { code: 'AP', name: 'Amapá', ddds: ['96'], flag: '🌿', region: 'North' },
  { code: 'PA', name: 'Pará', ddds: ['91', '93', '94'], flag: '🦎', region: 'North' },
  { code: 'TO', name: 'Tocantins', ddds: ['63'], flag: '🌾', region: 'North' },
  { code: 'RO', name: 'Rondônia', ddds: ['69'], flag: '🌱', region: 'North' },
  { code: 'AC', name: 'Acre', ddds: ['68'], flag: '🦋', region: 'North' },
  
  // Central-West
  { code: 'DF', name: 'Distrito Federal', ddds: ['61'], flag: '🏛️', region: 'Central-West' },
  { code: 'GO', name: 'Goiás', ddds: ['62', '64'], flag: '🌻', region: 'Central-West' },
  { code: 'MT', name: 'Mato Grosso', ddds: ['65', '66'], flag: '🐆', region: 'Central-West' },
  { code: 'MS', name: 'Mato Grosso do Sul', ddds: ['67'], flag: '🐊', region: 'Central-West' },
]

/**
 * DDD to State mapping for quick lookup
 */
export const DDD_TO_STATE_MAP = new Map<string, BrazilianState>(
  BRAZILIAN_STATES.flatMap(state => 
    state.ddds.map(ddd => [ddd, state])
  )
)

/**
 * Get Brazilian state by DDD (area code)
 * @param ddd - Area code (2 digits)
 * @returns BrazilianState or undefined if not found
 */
export function getStateByDDD(ddd: string): BrazilianState | undefined {
  return DDD_TO_STATE_MAP.get(ddd)
}

/**
 * Extract DDD from phone number
 * @param phone - Phone number (can be formatted or not)
 * @returns DDD (2 digits) or null
 */
export function extractDDD(phone: string): string | null {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Brazilian phone numbers: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  // DDD is the first 2 digits
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2)
  }
  
  return null
}

/**
 * Validate if DDD is valid
 * @param ddd - Area code to validate
 * @returns true if valid Brazilian DDD
 */
export function isValidDDD(ddd: string): boolean {
  return DDD_TO_STATE_MAP.has(ddd)
}
