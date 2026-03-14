/**
 * Phone Input Composable - Presentation Layer
 * Manages phone input state and business logic
 */

import { ref, computed, type Ref } from 'vue'
import { phoneFormattingService } from '@/application/phone/PhoneFormattingService'

export interface UsePhoneInputOptions {
  defaultCountry?: string
  defaultDialCode?: string
  initialValue?: string
}

export function usePhoneInput(options: UsePhoneInputOptions = {}) {
  const {
    defaultCountry = 'BR',
    defaultDialCode = '+55',
    initialValue = ''
  } = options

  // State
  const selectedCountryCode = ref(defaultCountry)
  const currentDialCode = ref(defaultDialCode)
  const fullPhoneValue = ref(initialValue || defaultDialCode)

  // Initialize from initial value if provided
  if (initialValue) {
    const parsed = phoneFormattingService.parsePhoneString(initialValue)
    if (parsed.dialCode) {
      currentDialCode.value = parsed.dialCode
    }
  }

  // Computed: phone number without country code
  const phoneNumberOnly = computed({
    get: () => phoneFormattingService.removeDialCode(fullPhoneValue.value),
    set: (newValue: string) => {
      fullPhoneValue.value = phoneFormattingService.formatPhoneNumber(
        currentDialCode.value,
        newValue
      )
    }
  })

  // Handle country change
  const handleCountryChange = (country: { iso2: string; dialCode: string }) => {
    if (!country || !country.dialCode) return

    currentDialCode.value = country.dialCode
    selectedCountryCode.value = country.iso2

    // Update phone value with new country code
    const phoneWithoutCode = phoneNumberOnly.value
    fullPhoneValue.value = phoneFormattingService.formatPhoneNumber(
      country.dialCode,
      phoneWithoutCode
    )
  }

  // Update full phone value
  const updatePhoneValue = (newValue: string) => {
    fullPhoneValue.value = newValue
  }

  return {
    // State
    selectedCountryCode,
    currentDialCode,
    fullPhoneValue,
    phoneNumberOnly,
    
    // Actions
    handleCountryChange,
    updatePhoneValue
  }
}
