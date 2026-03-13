<script setup lang="ts">
import { watch, ref } from 'vue'
import FormInputField from '../FormInputField.vue'
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

const cnpjNotFoundMessage = ref<string | null>(null)
const isTestCnpj = ref(false)

// Check if CNPJ is a test CNPJ (all same digits)
const checkIfTestCnpj = (cnpj: string): boolean => {
  const sanitized = cnpj.replace(/\D/g, '')
  if (sanitized.length !== 14) return false
  
  const firstDigit = sanitized[0]
  return sanitized.split('').every(digit => digit === firstDigit)
}

// Watch CNPJ field and auto-fill form when valid CNPJ is entered
watch(() => props.cnpj, async (newCnpj, oldCnpj) => {
  const sanitized = sanitizeCnpj(newCnpj)
  const oldSanitized = sanitizeCnpj(oldCnpj || '')
  
  // Reset status error and messages when CNPJ changes
  emit('status-error', null)
  cnpjNotFoundMessage.value = null
  isTestCnpj.value = false
  resetCnpjLookup()
  
  // Only lookup if CNPJ has 14 digits and actually changed
  if (sanitized.length === 14 && sanitized !== oldSanitized) {
    // Check if it's a test CNPJ
    if (checkIfTestCnpj(sanitized)) {
      isTestCnpj.value = true
      return
    }
    
    const companyInfo = await lookupCnpj(sanitized)
    
    // Check for status error
    if (statusError.value) {
      emit('status-error', statusError.value.message)
      uiStore.showError(statusError.value.message, 8000)
      return
    }
    
    // Check if CNPJ was not found
    if (companyInfo === null) {
      cnpjNotFoundMessage.value = t('onboardingForm.cnpjNotFound')
      return
    }
    
    if (companyInfo) {
      // Auto-fill form with retrieved data (always update when CNPJ changes)
      emit('update:companyName', companyInfo.razaoSocial || '')
      emit('update:fantasyName', companyInfo.nomeFantasia || companyInfo.razaoSocial || '')
      
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
    <div class="row g-3">
      <div class="col-12 col-md-6">
        <FormInputField 
          name="cnpj" 
          :label="t('onboardingForm.cnpj')" 
          placeholder="00.000.000/0000-00" 
          inputmode="numeric" 
          mask="cnpj" 
        >
          <template #below>
            <div v-if="isCnpjLoading" class="small text-primary fw-medium mt-1">
              <span class="pulse">{{ t('onboardingForm.searching') }}</span>
            </div>
            <div v-else-if="isTestCnpj" class="small fw-medium mt-1" style="color: var(--bs-warning);">
              ⚠️ {{ t('onboardingForm.testCnpjWarning') }}
            </div>
            <div v-else-if="cnpjNotFoundMessage" class="small fw-medium mt-1" style="color: var(--bs-danger);">
              ❌ {{ cnpjNotFoundMessage }}
            </div>
          </template>
        </FormInputField>
      </div>

      <div class="col-12 col-md-6">
        <FormInputField 
          name="companyName" 
          :label="t('onboardingForm.companyName')" 
          placeholder="Your company LTDA" 
        />
      </div>
    </div>

    <FormInputField 
      name="fantasyName" 
      :label="t('onboardingForm.fantasyName')" 
      placeholder="Company fantasy name" 
    />
  </div>
</template>

<style scoped>
/* Styles removed - using utility class .pulse from base.css */
</style>
