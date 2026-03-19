<script setup lang="ts">
import { ref } from 'vue'
import FormInputField from '@/components/UI/FormInputField.vue'
import PhoneInputField from '@/components/UI/PhoneInputField.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'

const { t } = useTranslation()

// Store dial code separately
const phoneDialCode = ref('+55')
const phoneInputRef = ref<InstanceType<typeof PhoneInputField> | null>(null)

// Handle dial code changes
const handleDialCodeChange = (dialCode: string) => {
  phoneDialCode.value = dialCode
}

// Expose method to get full phone number for form submission
const getFullPhoneNumber = () => {
  if (phoneInputRef.value) {
    return phoneInputRef.value.fullPhoneNumber
  }
  return phoneDialCode.value
}

defineExpose({
  getFullPhoneNumber,
  dialCode: phoneDialCode
})
</script>

<template>
  <div class="contact-info-section">
    <!-- Mobile: stack vertically, Tablet+: side by side -->
    <div class="row g-3">
      <div class="col-12 col-md-6">
        <PhoneInputField 
          ref="phoneInputRef"
          name="phone" 
          :label="t('onboarding.phone')" 
          placeholder="(11) 99999-9999"
          @dial-code-change="handleDialCodeChange"
        />
      </div>

      <div class="col-12 col-md-6">
        <FormInputField 
          name="email" 
          :label="t('onboarding.email')" 
          type="email" 
          placeholder="you@company.com" 
          autocomplete="email" 
          inputmode="email"
        />
      </div>
    </div>
  </div>
</template>
