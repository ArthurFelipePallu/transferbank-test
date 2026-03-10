<script setup lang="ts">
import { watch } from 'vue'
import FormInputField from '../FormInputField.vue'
import StatusErrorAlert from './StatusErrorAlert.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useCnpjLookup } from '@/composables/useCnpjLookup'
import { sanitizeCnpj, formatPhone, formatCep } from '@/utils/formatters'
import { useUiStore } from '@/stores/useUiStore'

interface Props {
  cnpj: string
  companyName: string
  fantasyName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:cnpj': [value: string]
  'update:companyName': [value: string]
  'update:fantasyName': [value: string]
  'update:phone': [value: string]
  'update:email': [value: string]
  'update:cep': [value: string]
  'status-error': [error: string | null]
}>()

const { t } = useTranslation()
const uiStore = useUiStore()
const { isLoading: isCnpjLoading, statusError, lookup: lookupCnpj, reset: resetCnpjLookup } = useCnpjLookup()

// Watch CNPJ field and auto-fill form when valid CNPJ is entered
watch(() => props.cnpj, async (newCnpj, oldCnpj) => {
  const sanitized = sanitizeCnpj(newCnpj)
  const oldSanitized = sanitizeCnpj(oldCnpj || '')
  
  // Reset status error when CNPJ changes
  emit('status-error', null)
  resetCnpjLookup()
  
  // Only lookup if CNPJ has 14 digits and actually changed
  if (sanitized.length === 14 && sanitized !== oldSanitized) {
    const companyInfo = await lookupCnpj(sanitized)
    
    // Check for status error
    if (statusError.value) {
      emit('status-error', statusError.value.message)
      uiStore.showError(statusError.value.message, 8000)
      return
    }
    
    if (companyInfo) {
      // Auto-fill form with retrieved data (only if fields are empty)
      if (!props.companyName) {
        emit('update:companyName', companyInfo.razaoSocial || '')
      }
      if (!props.fantasyName) {
        emit('update:fantasyName', companyInfo.nomeFantasia || companyInfo.razaoSocial || '')
      }
      if (companyInfo.telefone) {
        emit('update:phone', formatPhone(companyInfo.telefone))
      }
      if (companyInfo.email) {
        emit('update:email', companyInfo.email)
      }
      
      // Auto-fill CEP if available
      if (companyInfo.cep) {
        emit('update:cep', formatCep(companyInfo.cep))
      }
    }
  }
})
</script>

<template>
  <div class="company-info-section">
    <div class="field-row">
      <div class="field-with-indicator">
        <FormInputField 
          name="cnpj" 
          :label="t('onboardingForm.cnpj')" 
          placeholder="00.000.000/0000-00" 
          inputmode="numeric" 
          mask="cnpj" 
        />
        <span v-if="isCnpjLoading" class="loading-indicator">
          {{ t('onboardingForm.searching') }}
        </span>
      </div>

      <FormInputField 
        name="companyName" 
        :label="t('onboardingForm.companyName')" 
        placeholder="Your company LTDA" 
      />
    </div>

    <FormInputField 
      name="fantasyName" 
      :label="t('onboardingForm.fantasyName')" 
      placeholder="Company fantasy name" 
    />
  </div>
</template>

<style scoped>
.company-info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-row > * {
  flex: 1 1 0;
}

.field-with-indicator {
  position: relative;
  flex: 1;
}

.loading-indicator {
  position: absolute;
  right: 0.75rem;
  top: 2.5rem;
  font-size: 0.75rem;
  color: var(--color-primary-teal);
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (min-width: 640px) {
  .company-info-section {
    gap: 1.25rem;
  }

  .field-row {
    flex-direction: row;
    gap: 1.25rem;
  }
}
</style>
