<script setup lang="ts">
/**
 * PhoneInputField Component - Presentation Layer
 * International phone number input with country selection
 * Follows DDD/SOLID principles with proper separation of concerns
 * 
 * Note: This component stores ONLY the phone number (without dial code) in the form field.
 * The dial code is stored separately and can be accessed via the dialCode prop/event.
 */

import { ref, watch, computed } from 'vue'
import { useField } from 'vee-validate'
import 'flag-icons/css/flag-icons.min.css'
import CountryFlag from './Phone/CountryFlag.vue'
import CountrySelector from './Phone/CountrySelector.vue'

interface Props {
  name: string
  label: string
  placeholder?: string
  defaultCountry?: string
  defaultDialCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  defaultCountry: 'BR',
  defaultDialCode: '55'
})

interface Emits {
  (e: 'dialCodeChange', dialCode: string): void
  (e: 'fullPhoneChange', fullPhone: string): void
}

const emit = defineEmits<Emits>()

// Get field from vee-validate - stores ONLY the phone number
const { value, errorMessage, meta } = useField<string>(props.name)

// Selected country code and dial code (not stored in form)
const selectedCountryCode = ref(props.defaultCountry)
const currentDialCode = ref(props.defaultDialCode)

// Ref to country selector
const countrySelectorRef = ref<InstanceType<typeof CountrySelector> | null>(null)

// Apply Brazilian phone mask (without country code)
const applyLocalPhoneMask = (phoneValue: string): string => {
  // First, limit to 11 digits
  const numbers = phoneValue.replace(/\D/g, '').slice(0, 11)
  
  if (numbers.length === 0) return ''
  if (numbers.length <= 2) return `(${numbers}`
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  // For 11 digits: (XX) XXXXX-XXXX
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

// Masked value for display
const maskedValue = computed({
  get: () => applyLocalPhoneMask(value.value || ''),
  set: (newValue: string) => {
    // Store only numbers, limited to 11 digits
    const numbers = newValue.replace(/\D/g, '').slice(0, 11)
    value.value = numbers
  }
})

// Computed full phone number (for display/submission purposes)
const fullPhoneNumber = computed(() => {
  if (!value.value || value.value.trim().length === 0) {
    return currentDialCode.value
  }
  return `${currentDialCode.value} ${maskedValue.value}`
})

// Handle country change
const handleCountryChange = (country: { iso2: string; dialCode: string }) => {
  if (!country || !country.dialCode) return

  currentDialCode.value = country.dialCode
  selectedCountryCode.value = country.iso2
  
  // Emit dial code change
  emit('dialCodeChange', country.dialCode)
  emit('fullPhoneChange', fullPhoneNumber.value)
}

// Handle flag click
const handleFlagClick = () => {
  if (countrySelectorRef.value) {
    countrySelectorRef.value.openDropdown()
  }
}

// Watch value changes to emit full phone
watch(value, () => {
  emit('fullPhoneChange', fullPhoneNumber.value)
})

// Expose full phone number for parent components
defineExpose({
  fullPhoneNumber,
  dialCode: currentDialCode,
  countryCode: selectedCountryCode
})
</script>

<template>
  <div class="phone-input-field mb-3">
    <label v-if="label" :for="name" class="form-label">
      {{ label }}
    </label>
    
    <div class="phone-input-container">
      <!-- Flag Display with Country Selector overlay -->
      <div class="flag-selector-wrapper">
        <!-- Flag Display (clickable) -->
        <div class="flag-display" @click="handleFlagClick">
          <CountryFlag :country-code="selectedCountryCode" size="md" />
        </div>
        
        <!-- Country Selector (hidden) -->
        <CountrySelector
          ref="countrySelectorRef"
          v-model="selectedCountryCode"
          :default-country="defaultCountry"
          @change="handleCountryChange"
        />
      </div>

      <!-- Dial Code Display -->
      <span class="dial-code-display">+{{ currentDialCode }}</span>

      <!-- Phone Number Input -->
      <input
        :id="name"
        v-model="maskedValue"
        type="tel"
        class="form-control phone-number-input"
        :class="{ 'is-invalid': meta.touched && errorMessage }"
        :placeholder="placeholder || '(11) 99999-9999'"
        inputmode="tel"
        maxlength="15"
      />
    </div>

    <!-- Error Message -->
    <div v-if="meta.touched && errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.phone-input-field {
  margin-bottom: 0;
}

/* Container for all phone input elements  83.646.984/0107-68*/
.phone-input-container {
  position: relative;
  display: flex;
  align-items: stretch;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.375rem;
  background: white;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: hidden;
}

.phone-input-container:focus-within {
  border-color: var(--color-primary-teal);
  box-shadow: 0 0 0 0.2rem rgba(28, 156, 140, 0.25);
}

/* Wrapper for flag display and country selector */
.flag-selector-wrapper {
  position: relative;
  flex-shrink: 0;
  min-width: 48px;
}

/* Flag display section */
.flag-display {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.5rem;
  background: var(--bs-light);
  border-right: 1px solid var(--bs-border-color);
  min-width: 48px;
  height: 100%;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: background-color 0.15s ease;
}

.flag-display:hover {
  background: #e0e0e0;
}

/* Dial code display */
.dial-code-display {
  flex-shrink: 0;
  color: var(--bs-secondary);
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.375rem 0.75rem;
  user-select: none;
  display: flex;
  align-items: center;
  background: white;
  border-right: 1px solid var(--bs-border-color);
}

/* Phone number input */
.phone-number-input {
  flex: 1;
  border: none !important;
  background: transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  color: var(--bs-body-color);
  box-shadow: none !important;
}

.phone-number-input:focus {
  outline: none;
  box-shadow: none !important;
}

.phone-number-input::placeholder {
  color: var(--bs-secondary);
  opacity: 0.6;
}

/* Error state */
.phone-input-container:has(.phone-number-input.is-invalid) {
  border-color: var(--bs-danger);
}

.phone-input-container:has(.phone-number-input.is-invalid):focus-within {
  border-color: var(--bs-danger);
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Mobile responsive */
@media (max-width: 576px) {
  .flag-selector-wrapper {
    min-width: 44px;
  }
  
  .flag-display {
    min-width: 44px;
    padding: 0.375rem 0.375rem;
  }
  
  .dial-code-display {
    font-size: 0.875rem;
    padding: 0.375rem 0.5rem;
  }
  
  .phone-number-input {
    padding: 0.375rem 0.5rem;
  }
}
</style>
