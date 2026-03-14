<script setup lang="ts">
/**
 * CountrySelector Component - Presentation Layer
 * Wraps vue3-country-intl for country selection
 * Handles the dropdown logic and emits country changes
 */

import { ref, onMounted, onUnmounted } from 'vue'
import Vue3CountryIntl from 'vue3-country-intl'
import 'vue3-country-intl/lib/vue3-country-intl.css'

interface Props {
  modelValue: string
  defaultCountry?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', country: { iso2: string; dialCode: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  defaultCountry: 'BR'
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue || props.defaultCountry)
const selectorRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const handleChange = (country: any) => {
  if (country && country.dialCode) {
    localValue.value = country.iso2
    emit('update:modelValue', country.iso2)
    emit('change', {
      iso2: country.iso2,
      dialCode: country.dialCode
    })
    
    // Close dropdown after selection
    closeDropdown()
  }
}

// Handle click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return
  
  const dropdown = document.querySelector('.vue-country-intl-inputer-dropdown')
  const target = event.target as Node
  const flagDisplay = document.querySelector('.flag-display')
  
  // Don't close if clicking on the flag or inside the dropdown
  if (dropdown && !dropdown.contains(target) && 
      !selectorRef.value?.contains(target) &&
      !flagDisplay?.contains(target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose method to trigger dropdown
const openDropdown = () => {
  if (selectorRef.value) {
    const label = selectorRef.value.querySelector('.country-intl-label') as HTMLElement
    
    if (label) {
      label.click()
      
      // Delay setting isOpen to prevent immediate close from click-outside
      setTimeout(() => {
        isOpen.value = true
      }, 100)
      
      // Force dropdown to show and fix dimensions/position
      setTimeout(() => {
        const dropdown = document.querySelector('.vue-country-intl-inputer-dropdown') as HTMLElement
        if (dropdown) {
          dropdown.style.display = 'block'
          dropdown.style.visibility = 'visible'
          dropdown.style.opacity = '1'
          dropdown.style.width = '400px'
          dropdown.style.minWidth = '400px'
          
          // Fix position - get the phone input container position
          const phoneContainer = document.querySelector('.phone-input-container')
          if (phoneContainer) {
            const rect = phoneContainer.getBoundingClientRect()
            dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`
            dropdown.style.left = `${rect.left + window.scrollX}px`
          }
        }
      }, 50)
    }
  }
}

// Method to close dropdown
const closeDropdown = () => {
  isOpen.value = false
  setTimeout(() => {
    const dropdown = document.querySelector('.vue-country-intl-inputer-dropdown') as HTMLElement
    if (dropdown) {
      dropdown.style.display = 'none'
    }
  }, 100)
}

defineExpose({ openDropdown, closeDropdown })
</script>

<template>
  <div ref="selectorRef" class="country-selector-wrapper">
    <Vue3CountryIntl
      v-model="localValue"
      type="phone"
      :default-country="defaultCountry"
      :show-area-code="true"
      :show-label-img="false"
      :only-value="true"
      :show-search-box="true"
      :list-z-index="1060"
      :max-height="320"
      search-input-placeholder="Search country..."
      selected-text="✓"
      @change="handleChange"
    />
  </div>
</template>

<style scoped>
/* Position selector but keep it accessible */
.country-selector-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 1px;
  overflow: visible;
  z-index: 1050;
}

:deep(.vue-country-intl) {
  position: relative;
}

:deep(.country-intl-input-wrap) {
  width: 1px;
  height: 1px;
  overflow: visible;
}

:deep(.country-intl-input) {
  display: none !important;
}

:deep(.country-intl-label) {
  width: 1px;
  height: 1px;
  opacity: 0;
  cursor: pointer;
}

/* Dropdown styling - make it visible when opened */
:deep(.vue-country-intl-inputer-dropdown) {
  min-width: 400px !important;
  max-width: 420px !important;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid var(--bs-border-color);
  margin-top: 0.5rem !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  background: white !important;
  z-index: 1060 !important;
  display: block !important;
}

:deep(.vue-country-list-wrap) {
  border-radius: 0.375rem;
  max-height: 320px;
  display: block !important;
}

:deep(.country-intl-search) {
  padding: 0.75rem;
  background: var(--bs-light);
  border-bottom: 1px solid var(--bs-border-color);
  position: sticky;
  top: 0;
  z-index: 1;
}

:deep(.country-intl-search input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background: white;
}

:deep(.country-intl-search input:focus) {
  outline: none;
  border-color: var(--color-primary-teal);
  box-shadow: 0 0 0 0.2rem rgba(28, 156, 140, 0.25);
}

:deep(.vue-country-item) {
  padding: 0.75rem 1rem;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid var(--bs-border-color-translucent);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

:deep(.vue-country-item:last-child) {
  border-bottom: none;
}

:deep(.vue-country-item:hover) {
  background: var(--bs-light);
}

:deep(.vue-country-item.selected) {
  background: rgba(28, 156, 140, 0.1);
  color: var(--color-primary-teal);
}

:deep(.vue-country-item .iti-flag) {
  flex-shrink: 0;
  transform: scale(1.1);
}

:deep(.vue-country-item .country-name) {
  flex: 1;
  font-size: 0.9375rem;
}

:deep(.vue-country-item .vue-country-areaCode) {
  color: var(--bs-secondary) !important;
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: auto;
}

:deep(.vue-country-item.selected .vue-country-areaCode) {
  color: var(--color-primary-teal) !important;
}

:deep(.selected-text) {
  color: var(--color-primary-teal);
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 576px) {
  :deep(.vue-country-intl-inputer-dropdown) {
    min-width: 320px !important;
    max-width: 95vw !important;
  }
}
</style>
