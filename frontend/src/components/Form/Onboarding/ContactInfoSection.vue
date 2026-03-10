<script setup lang="ts">
import FormInputField from '../FormInputField.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
</script>

<template>
  <div class="contact-info-section">
    <div class="field-row">
      <FormInputField 
        name="phone" 
        :label="t('onboardingForm.phone')" 
        type="tel" 
        placeholder="+55 (11) 99999-9999" 
        inputmode="tel"
        mask="phone" 
      />

      <FormInputField 
        name="email" 
        :label="t('onboardingForm.email')" 
        type="email" 
        placeholder="you@company.com" 
        autocomplete="email" 
      />
    </div>
  </div>
</template>

<style scoped>
.contact-info-section {
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

@media (min-width: 640px) {
  .contact-info-section {
    gap: 1.25rem;
  }

  .field-row {
    flex-direction: row;
    gap: 1.25rem;
  }
}
</style>
