<script setup lang="ts">
/**
 * FormValidationFeedback Component - Presentation Layer
 * Shows validation errors to help users understand what's preventing form submission
 */

import { computed } from 'vue'
import { useFormErrors } from 'vee-validate'
import { useTranslation } from '@/composables/i18n/useTranslation'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

const { t } = useTranslation()
const errors = useFormErrors()

// Group errors by section for better UX
const errorsBySection = computed(() => {
  const allErrors = errors.value
  
  const sections = {
    company: [] as string[],
    crypto: [] as string[],
    contact: [] as string[],
    address: [] as string[],
    password: [] as string[]
  }
  
  Object.entries(allErrors).forEach(([field, message]) => {
    if (['cnpj', 'companyName', 'fantasyName'].includes(field)) {
      sections.company.push(message as string)
    } else if (field === 'cryptoCurrencies') {
      sections.crypto.push(message as string)
    } else if (['phone', 'email'].includes(field)) {
      sections.contact.push(message as string)
    } else if (['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'].includes(field)) {
      sections.address.push(message as string)
    } else if (['password', 'passwordConfirmation'].includes(field)) {
      sections.password.push(message as string)
    }
  })
  
  return sections
})

const hasErrors = computed(() => {
  return Object.values(errorsBySection.value).some(errors => errors.length > 0)
})

const totalErrors = computed(() => {
  return Object.values(errorsBySection.value).reduce((sum, errors) => sum + errors.length, 0)
})
</script>

<template>
  <div v-if="hasErrors" class="validation-feedback">
    <div class="feedback-header">
      <BaseLucideIcon name="alert-circle" :size="20" />
      <span class="feedback-title">
        {{ totalErrors }} {{ totalErrors === 1 ? t('onboarding.validation.issuesSingular') : t('onboarding.validation.issuesPlural') }}
      </span>
    </div>
    
    <div class="feedback-sections">
      <div v-if="errorsBySection.company.length > 0" class="feedback-section">
        <div class="section-title">{{ t('onboarding.validation.sectionCompany') }}</div>
        <ul class="error-list">
          <li v-for="(error, index) in errorsBySection.company" :key="`company-${index}`">{{ error }}</li>
        </ul>
      </div>
      
      <div v-if="errorsBySection.crypto.length > 0" class="feedback-section">
        <div class="section-title">{{ t('onboarding.validation.sectionCrypto') }}</div>
        <ul class="error-list">
          <li v-for="(error, index) in errorsBySection.crypto" :key="`crypto-${index}`">{{ error }}</li>
        </ul>
      </div>
      
      <div v-if="errorsBySection.contact.length > 0" class="feedback-section">
        <div class="section-title">{{ t('onboarding.validation.sectionContact') }}</div>
        <ul class="error-list">
          <li v-for="(error, index) in errorsBySection.contact" :key="`contact-${index}`">{{ error }}</li>
        </ul>
      </div>
      
      <div v-if="errorsBySection.address.length > 0" class="feedback-section">
        <div class="section-title">{{ t('onboarding.validation.sectionAddress') }}</div>
        <ul class="error-list">
          <li v-for="(error, index) in errorsBySection.address" :key="`address-${index}`">{{ error }}</li>
        </ul>
      </div>
      
      <div v-if="errorsBySection.password.length > 0" class="feedback-section">
        <div class="section-title">{{ t('onboarding.validation.sectionPassword') }}</div>
        <ul class="error-list">
          <li v-for="(error, index) in errorsBySection.password" :key="`password-${index}`">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validation-feedback {
  background: var(--color-warning-ui-bg);
  border: 1px solid var(--color-warning-ui);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-warning-ui-text);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feedback-title {
  font-size: 0.9375rem;
}

.feedback-sections {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feedback-section {
  padding-left: 1.75rem;
}

.section-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-warning-ui-text);
  margin-bottom: 0.25rem;
}

.error-list {
  list-style: disc;
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-warning-ui-text);
}

.error-list li {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.error-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 576px) {
  .validation-feedback {
    padding: 0.875rem;
  }
  
  .feedback-header {
    font-size: 0.875rem;
  }
  
  .section-title {
    font-size: 0.8125rem;
  }
  
  .error-list li {
    font-size: 0.8125rem;
  }
}
</style>
