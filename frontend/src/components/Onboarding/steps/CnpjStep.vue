<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useForm } from 'vee-validate'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import FormInputField from '@/components/UI/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import { onboardingCnpjSchema, type OnboardingCnpjValues } from '@/domain/onboarding/onboarding.schema'
import { useCnpjLookup } from '@/composables/lookup/useCnpjLookup'
import { useCnpjRegistrationCheck } from '@/composables/lookup/useCnpjRegistrationCheck'
import { sanitizeCnpj, isTestCnpj } from '@/utils/formatters'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'

interface Props {
  initialValues?: Partial<OnboardingCnpjValues>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: [values: OnboardingCnpjValues & { companyInfo: CompanyInfo | null; isTestCnpj: boolean }]
  update: [values: Partial<OnboardingCnpjValues>]
}>()

const { t } = useTranslation()
const { isLoading, statusError, invalidCnpj, companyInfo, lookup, reset: resetLookup } = useCnpjLookup()
const { isChecking, isRegistered, check: checkRegistration, reset: resetCheck } = useCnpjRegistrationCheck()

// ── UI state (presentation only) ──────────────────────────────────────────────
const isTestCnpjValue = ref(false)
const cnpjNotFound    = ref(false)
const lookupDone      = ref(false)

const { handleSubmit, values, meta } = useForm<OnboardingCnpjValues>({
  validationSchema: onboardingCnpjSchema,
  initialValues: { cnpj: props.initialValues?.cnpj ?? '' },
  validateOnMount: false,
})

// ── Reset all state on CNPJ change ────────────────────────────────────────────
const resetState = () => {
  isTestCnpjValue.value = false
  cnpjNotFound.value    = false
  lookupDone.value      = false
  resetLookup()
  resetCheck()
}

// ── Single watcher: persist + auto-lookup when CNPJ changes ──────────────────
watch(
  () => values.cnpj,
  async (newVal) => {
    emit('update', { cnpj: newVal })

    const sanitized = sanitizeCnpj(newVal)
    resetState()

    if (sanitized.length !== 14) return

    if (isTestCnpj(sanitized)) {
      isTestCnpjValue.value = true
      lookupDone.value      = true
      await checkRegistration(sanitized)
      return
    }

    await lookup(sanitized)
    lookupDone.value = true

    if (!companyInfo.value && !statusError.value && !invalidCnpj.value) {
      cnpjNotFound.value = true
      return
    }

    if (!statusError.value && !invalidCnpj.value) {
      await checkRegistration(sanitized)
    }
  },
)

// ── Proceed guard — all blocking conditions named ─────────────────────────────
const isBlocked = computed(
  () =>
    !lookupDone.value    ||
    !!statusError.value  ||
    !!invalidCnpj.value  ||
    isLoading.value      ||
    isChecking.value     ||
    isRegistered.value,
)

const submit = handleSubmit((vals) => {
  if (isBlocked.value) return
  emit('next', {
    ...vals,
    companyInfo: companyInfo.value ?? null,
    isTestCnpj: isTestCnpjValue.value,
  })
})
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.cnpjStep.title')"
      :description="t('onboarding.cnpjStep.description')"
    />

    <div class="mb-3">
      <FormInputField
        name="cnpj"
        :label="t('onboarding.cnpj')"
        :placeholder="t('onboarding.placeholders.cnpj')"
        inputmode="numeric"
        mask="cnpj"
      >
        <template #below>
          <div v-if="isLoading || isChecking" class="d-flex align-items-center gap-1 mt-1 small text-primary">
            <BaseLucideIcon name="Search" :size="14" />
            <span class="pulse">{{ t('onboarding.searching') }}</span>
          </div>
        </template>
      </FormInputField>
    </div>

    <!-- Status feedback — one card at a time, highest priority first -->
    <Transition name="fade" mode="out-in">

      <!-- Already registered in our system -->
      <AlertCard v-if="isRegistered" variant="danger" class="mb-3">
        <template #icon><BaseLucideIcon name="Ban" :size="18" /></template>
        <strong class="d-block">{{ t('onboarding.cnpjStep.alreadyRegistered') }}</strong>
      </AlertCard>

      <!-- Active company, not yet registered -->
      <AlertCard v-else-if="companyInfo && !statusError" variant="success" class="mb-3">
        <template #icon><BaseLucideIcon name="CheckCircle" :size="18" /></template>
        <strong class="d-block">{{ t('onboarding.cnpjStep.activeStatus') }}</strong>
        <span class="small">{{ companyInfo.razaoSocial }}</span>
      </AlertCard>

      <!-- Inactive / suspended -->
      <AlertCard v-else-if="statusError" variant="danger" class="mb-3">
        <template #icon><BaseLucideIcon name="XCircle" :size="18" /></template>
        <strong class="d-block">{{ t('onboarding.cnpjStep.inactiveStatus') }}</strong>
        <span class="small">{{ statusError.message }}</span>
      </AlertCard>

      <!-- Arithmetically invalid CNPJ (check-digit failure) -->
      <AlertCard v-else-if="invalidCnpj" variant="warning" class="mb-3">
        <template #icon><BaseLucideIcon name="TriangleAlert" :size="18" /></template>
        <span class="small">{{ t('onboarding.cnpjStep.invalidCnpj') }}</span>
      </AlertCard>

      <!-- Test CNPJ (and not already registered) -->
      <AlertCard v-else-if="isTestCnpjValue && !isRegistered" variant="warning" class="mb-3">
        <template #icon><BaseLucideIcon name="TriangleAlert" :size="18" /></template>
        <span class="small">{{ t('onboarding.cnpjStep.testCnpjInfo') }}</span>
      </AlertCard>

      <!-- Not found in external registry -->
      <AlertCard v-else-if="cnpjNotFound" variant="warning" class="mb-3">
        <template #icon><BaseLucideIcon name="TriangleAlert" :size="18" /></template>
        <span class="small">{{ t('onboarding.cnpjStep.notFound') }}</span>
      </AlertCard>

    </Transition>

    <FormNavigation
      :show-back="false"
      :next-label="t('common.next')"
      :next-disabled="!meta.valid || isBlocked"
      @next="submit"
    />
  </form>
</template>
