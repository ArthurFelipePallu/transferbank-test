<script setup lang="ts">
import { watch } from 'vue'
import FormInputField from '../FormInputField.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useCepLookup } from '@/composables/useCepLookup'
import { sanitizeCep } from '@/utils/formatters'

interface Props {
  cep: string
  logradouro: string
  bairro: string
  cidade: string
  uf: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:logradouro': [value: string]
  'update:bairro': [value: string]
  'update:cidade': [value: string]
  'update:uf': [value: string]
}>()

const { t } = useTranslation()
const { isLoading: isCepLoading, lookup: lookupCep, reset: resetCepLookup } = useCepLookup()

// Watch CEP field and auto-fill address when valid CEP is entered
watch(() => props.cep, async (newCep, oldCep) => {
  const sanitized = sanitizeCep(newCep)
  const oldSanitized = sanitizeCep(oldCep || '')
  
  // Reset CEP lookup
  resetCepLookup()
  
  // Only lookup if CEP has 8 digits and actually changed
  if (sanitized.length === 8 && sanitized !== oldSanitized) {
    const addressInfo = await lookupCep(sanitized)
    
    if (addressInfo) {
      // Auto-fill address fields (only if empty)
      if (!props.logradouro) {
        emit('update:logradouro', addressInfo.logradouro || '')
      }
      if (!props.bairro) {
        emit('update:bairro', addressInfo.bairro || '')
      }
      if (!props.cidade) {
        emit('update:cidade', addressInfo.localidade || '')
      }
      if (!props.uf) {
        emit('update:uf', addressInfo.uf || '')
      }
    }
  }
})
</script>

<template>
  <div class="address-section">
    <div class="field-row">
      <div class="field-with-indicator">
        <FormInputField 
          name="cep" 
          :label="t('onboardingForm.cep')" 
          placeholder="00000-000" 
          inputmode="numeric" 
          mask="cep" 
        />
        <span v-if="isCepLoading" class="loading-indicator">
          {{ t('onboardingForm.searching') }}
        </span>
      </div>
      
      <FormInputField 
        name="logradouro" 
        :label="t('onboardingForm.street')" 
        placeholder="Rua Example" 
      />
    </div>

    <div class="field-row">
      <FormInputField 
        name="numero" 
        :label="t('onboardingForm.number')" 
        placeholder="123" 
      />
      <FormInputField 
        name="complemento" 
        :label="t('onboardingForm.complement')" 
        placeholder="Apt 45 (optional)" 
      />
    </div>

    <div class="field-row">
      <FormInputField 
        name="bairro" 
        :label="t('onboardingForm.neighborhood')" 
        placeholder="Centro" 
      />
      <FormInputField 
        name="cidade" 
        :label="t('onboardingForm.city')" 
        placeholder="São Paulo" 
      />
    </div>

    <FormInputField 
      name="uf" 
      :label="t('onboardingForm.state')" 
      placeholder="SP" 
      maxlength="2" 
    />
  </div>
</template>

<style scoped>
.address-section {
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
  .address-section {
    gap: 1.25rem;
  }

  .field-row {
    flex-direction: row;
    gap: 1.25rem;
  }
}
</style>
