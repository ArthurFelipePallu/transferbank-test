import { ref, watch, type Ref } from 'vue'

/**
 * Applies CNPJ mask: 12.345.678/0001-90
 * Max length: 14 digits
 */
export const useCnpjMask = (modelValue: Ref<string>) => {
  const maskedValue = ref('')

  const applyMask = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Limit to 14 digits
    const limited = numbers.slice(0, 14)
    
    // Apply mask progressively
    let formatted = limited
    
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}.${limited.slice(2)}`
    }
    if (limited.length > 5) {
      formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`
    }
    if (limited.length > 8) {
      formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`
    }
    if (limited.length > 12) {
      formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`
    }
    
    return formatted
  }

  watch(modelValue, (newValue) => {
    maskedValue.value = applyMask(newValue)
  }, { immediate: true })

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const cursorPosition = input.selectionStart || 0
    const oldValue = maskedValue.value
    const newValue = input.value
    
    // Apply mask
    const formatted = applyMask(newValue)
    maskedValue.value = formatted
    modelValue.value = formatted
    
    // Restore cursor position
    setTimeout(() => {
      if (formatted.length > oldValue.length) {
        // Moving forward - adjust for added characters
        const diff = formatted.length - oldValue.length
        input.setSelectionRange(cursorPosition + diff, cursorPosition + diff)
      } else {
        input.setSelectionRange(cursorPosition, cursorPosition)
      }
    }, 0)
  }

  return {
    maskedValue,
    handleInput,
  }
}

/**
 * Applies CPF mask: 123.456.789-01
 * Max length: 11 digits
 */
export const useCpfMask = (modelValue: Ref<string>) => {
  const maskedValue = ref('')

  const applyMask = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Limit to 11 digits
    const limited = numbers.slice(0, 11)
    
    // Apply mask progressively
    let formatted = limited
    
    if (limited.length > 3) {
      formatted = `${limited.slice(0, 3)}.${limited.slice(3)}`
    }
    if (limited.length > 6) {
      formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`
    }
    if (limited.length > 9) {
      formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`
    }
    
    return formatted
  }

  watch(modelValue, (newValue) => {
    maskedValue.value = applyMask(newValue)
  }, { immediate: true })

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const cursorPosition = input.selectionStart || 0
    const oldValue = maskedValue.value
    const newValue = input.value
    
    // Apply mask
    const formatted = applyMask(newValue)
    maskedValue.value = formatted
    modelValue.value = formatted
    
    // Restore cursor position
    setTimeout(() => {
      if (formatted.length > oldValue.length) {
        const diff = formatted.length - oldValue.length
        input.setSelectionRange(cursorPosition + diff, cursorPosition + diff)
      } else {
        input.setSelectionRange(cursorPosition, cursorPosition)
      }
    }, 0)
  }

  return {
    maskedValue,
    handleInput,
  }
}

/**
 * Applies Brazilian phone mask: +55 (11) 99999-9999
 * Max length: 13 digits (country code + area code + number)
 */
export const usePhoneMask = (modelValue: Ref<string>) => {
  const maskedValue = ref('')

  const applyMask = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Limit to 13 digits (55 + 11 + 9 digits)
    const limited = numbers.slice(0, 13)
    
    // Apply mask progressively
    let formatted = limited
    
    if (limited.length > 0) {
      formatted = `+${limited}`
    }
    if (limited.length > 2) {
      formatted = `+${limited.slice(0, 2)} (${limited.slice(2)}`
    }
    if (limited.length > 4) {
      formatted = `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4)}`
    }
    if (limited.length > 9) {
      formatted = `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4, 9)}-${limited.slice(9)}`
    }
    
    return formatted
  }

  watch(modelValue, (newValue) => {
    maskedValue.value = applyMask(newValue)
  }, { immediate: true })

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const cursorPosition = input.selectionStart || 0
    const oldValue = maskedValue.value
    const newValue = input.value
    
    // Apply mask
    const formatted = applyMask(newValue)
    maskedValue.value = formatted
    modelValue.value = formatted
    
    // Restore cursor position
    setTimeout(() => {
      if (formatted.length > oldValue.length) {
        const diff = formatted.length - oldValue.length
        input.setSelectionRange(cursorPosition + diff, cursorPosition + diff)
      } else {
        input.setSelectionRange(cursorPosition, cursorPosition)
      }
    }, 0)
  }

  return {
    maskedValue,
    handleInput,
  }
}
