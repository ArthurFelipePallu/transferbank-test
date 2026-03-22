<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useForm, useFieldValue } from 'vee-validate'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import FormInputField from '@/components/UI/FormInputField.vue'
import PhoneInputField from '@/components/UI/PhoneInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import { onboardingCompanySchema, type OnboardingCompanyValues } from '@/domain/onboarding/onboarding.schema'
import { useEmailRegistrationCheck } from '@/composables/lookup/useEmailRegistrationCheck'
import { useTranslation } from '@/composables/i18n/useTranslation'

interface Props {
  initialValues?: Partial<OnboardingCompanyValues>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: [values: OnboardingCompanyValues]
  back: []
  update: [values: Partial<OnboardingCompanyValues>]
}>()

const { t } = useTranslation()
const phoneInputRef = ref<InstanceType<typeof PhoneInputField> | null>(null)

const { isPending, isChecking, isRegistered, scheduleCheck, reset: resetEmailCheck } = useEmailRegistrationCheck()

const { handleSubmit, meta, values } = useForm<OnboardingCompanyValues>({
  validationSchema: onboardingCompanySchema,
  initialValues: {
    companyName: props.initialValues?.companyName ?? '',
    fantasyName: props.initialValues?.fantasyName ?? '',
    phone:       props.initialValues?.phone ?? '',
    email:       props.initialValues?.email ?? '',
  },
  validateOnMount: false,
})

const emailFieldValue = useFieldValue<string>('email')

watch(emailFieldValue, (newEmail) => scheduleCheck(newEmail ?? ''))

watch(values, (v) => emit('update', { ...v }), { deep: true })

const isBlocked = computed(() => isPending.value || isChecking.value || isRegistered.value)

const submit = handleSubmit((vals) => {
  if (isBlocked.value) return
  const fullPhone = (phoneInputRef.value?.fullPhoneNumber as { value: string } | undefined)?.value || vals.phone
  emit('next', { ...vals, phone: fullPhone })
})

const handleBack = () => {
  resetEmailCheck()
  emit('back')
}
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.steps.company.title')"
      :description="t('onboarding.steps.company.description')"
    />

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <FormInputField
          name="companyName"
          :label="t('onboarding.companyName')"
          :placeholder="t('onboarding.placeholders.companyName')"
        />
      </div>
      <div class="col-12 col-md-6">
        <FormInputField
          name="fantasyName"
          :label="t('onboarding.fantasyName')"
          :placeholder="t('onboarding.placeholders.fantasyName')"
        />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <PhoneInputField
          ref="phoneInputRef"
          name="phone"
          :label="t('onboarding.phone')"
          placeholder="(11) 99999-9999"
        />
      </div>
      <div class="col-12 col-md-6">
        <FormInputField
          name="email"
          :label="t('onboarding.email')"
          type="email"
          :placeholder="t('onboarding.placeholders.email')"
          autocomplete="email"
          inputmode="email"
        >
          <template #below>
            <div v-if="isPending || isChecking" class="d-flex align-items-center gap-1 mt-1 small text-muted">
              <BaseLucideIcon name="Search" :size="14" />
              <span class="pulse">{{ t('onboarding.searching') }}</span>
            </div>
          </template>
        </FormInputField>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <AlertCard v-if="isRegistered" variant="danger" class="mb-3">
        <template #icon><BaseLucideIcon name="Ban" :size="18" /></template>
        <strong class="d-block">{{ t('onboarding.companyStep.emailAlreadyRegistered') }}</strong>
        <span class="small">{{ t('onboarding.companyStep.emailAlreadyRegisteredHint') }}</span>
      </AlertCard>
    </Transition>

    <FormNavigation
      :show-back="true"
      :next-disabled="!meta.valid || isBlocked"
      @back="handleBack"
      @next="submit"
    />
  </form>
</template>
