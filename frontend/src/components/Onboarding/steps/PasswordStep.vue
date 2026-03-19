<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import PasswordSection from '@/components/Onboarding/PasswordSection.vue'
import { onboardingPasswordSchema, type OnboardingPasswordValues } from '@/domain/onboarding/onboarding.schema'
import { useTranslation } from '@/composables/i18n/useTranslation'

const emit = defineEmits<{ next: [values: OnboardingPasswordValues]; back: [] }>()
const { t } = useTranslation()

const { handleSubmit, meta, values } = useForm<OnboardingPasswordValues>({
  validationSchema: onboardingPasswordSchema,
  initialValues: { password: '', passwordConfirmation: '' },
  validateOnMount: false,
})

const submit = handleSubmit((vals) => emit('next', vals))
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.steps.password.title')"
      :description="t('onboarding.steps.password.description')"
    />

    <PasswordSection :password="values.password" />

    <FormNavigation
      :show-back="true"
      :next-disabled="!meta.valid"
      @back="$emit('back')"
      @next="submit"
    />
  </form>
</template>
