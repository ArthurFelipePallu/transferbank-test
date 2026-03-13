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
    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <div class="position-relative">
          <FormInputField 
            name="cep" 
            :label="t('onboardingForm.cep')" 
            placeholder="00000-000" 
            inputmode="numeric" 
            mask="cep" 
          />
          <span v-if="isCepLoading" class="position-absolute top-50 end-0 translate-middle-y me-3 small text-primary fw-medium pulse">
            {{ t('onboardingForm.searching') }}
          </span>
        </div>
      </div>
      
      <div class="col-12 col-md-6">
        <FormInputField 
          name="logradouro" 
          :label="t('onboardingForm.street')" 
          placeholder="Rua Example" 
        />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <FormInputField 
          name="numero" 
          :label="t('onboardingForm.number')" 
          placeholder="123" 
        />
      </div>
      <div class="col-12 col-md-6">
        <FormInputField 
          name="complemento" 
          :label="t('onboardingForm.complement')" 
          placeholder="Apt 45 (optional)" 
        />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <FormInputField 
          name="bairro" 
          :label="t('onboardingForm.neighborhood')" 
          placeholder="Centro" 
        />
      </div>
      <div class="col-12 col-md-6">
        <FormInputField 
          name="cidade" 
          :label="t('onboardingForm.city')" 
          placeholder="São Paulo" 
        />
      </div>
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
/* Styles removed - using utility class .pulse from base.css */
</style>
