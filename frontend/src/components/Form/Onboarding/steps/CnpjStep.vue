<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-vue-next'
import FormInputField from '@/components/Form/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import { onboardingCnpjSchema, type OnboardingCnpjValues } from '@/domain/onboarding/onboarding.schema'
import { useCnpjLookup } from '@/composables/useCnpjLookup'
import { sanitizeCnpj, formatPhone, formatCep } from '@/utils/formatters'
import { useTranslation } from '@/composables/useTranslation'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'

interface Props {
  initialValues?: Partial<OnboardingCnpjValues>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: [values: OnboardingCnpjValues & { companyInfo: CompanyInfo | null; isTestCnpj: boolean }]
}>()

const { t } = useTranslation()
const { isLoading, statusError, companyInfo, lookup, reset } = useCnpjLookup()

const isTestCnpj = ref(false)
const cnpjNotFound = ref(false)
const lookupDone = ref(false)

const { handleSubmit, values, meta } = useForm<OnboardingCnpjValues>({
  validationSchema: onboardingCnpjSchema,
  initialValues: { cnpj: props.initialValues?.cnpj ?? '' },
  validateOnMount: false,
})

const checkIfTestCnpj = (cnpj: string): boolean => {
  const s = cnpj.replace(/\D/g, '')
  if (s.length !== 14) return false
  return s.split('').every((d) => d === s[0])
}

// Auto-lookup when CNPJ reaches 14 digits
watch(
  () => values.cnpj,
  async (newVal) => {
    const sanitized = sanitizeCnpj(newVal)
    // Reset state on every change
    isTestCnpj.value = false
    cnpjNotFound.value = false
    lookupDone.value = false
    reset()

    if (sanitized.length === 14) {
      if (checkIfTestCnpj(sanitized)) {
        isTestCnpj.value = true
        lookupDone.value = true
        return
      }
      await lookup(sanitized)
      lookupDone.value = true
      if (!companyInfo.value && !statusError.value) {
        cnpjNotFound.value = true
      }
    }
  },
)

// Block next if status error
const canProceed = () => {
  if (!lookupDone.value && !isTestCnpj.value) return false
  if (statusError.value) return false
  return true
}

const submit = handleSubmit((vals) => {
  if (!canProceed()) return
  emit('next', {
    ...vals,
    companyInfo: companyInfo.value ?? null,
    isTestCnpj: isTestCnpj.value,
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
          <div v-if="isLoading" class="d-flex align-items-center gap-1 mt-1 small text-primary">
            <Search :size="14" />
            <span class="pulse">{{ t('onboarding.searching') }}</span>
          </div>
        </template>
      </FormInputField>
    </div>

    <!-- Status feedback cards -->
    <Transition name="fade" mode="out-in">
      <!-- Active company -->
      <AlertCard v-if="companyInfo && !statusError" variant="success" class="mb-3">
        <template #icon><CheckCircle :size="18" /></template>
        <strong class="d-block">{{ t('onboarding.cnpjStep.activeStatus') }}</strong>
        <span class="small">{{ companyInfo.razaoSocial }}</span>
      </AlertCard>

      <!-- Status error (inactive / suspended) -->
      <AlertCard v-else-if="statusError" variant="danger" class="mb-3">
        <template #icon><XCircle :size="18" /></template>
        <strong class="d-block">{{ t('onboarding.cnpjStep.inactiveStatus') }}</strong>
        <span class="small">{{ statusError.message }}</span>
      </AlertCard>

      <!-- Test CNPJ -->
      <AlertCard v-else-if="isTestCnpj" variant="warning" class="mb-3">
        <template #icon><AlertTriangle :size="18" /></template>
        <span class="small">{{ t('onboarding.cnpjStep.testCnpjInfo') }}</span>
      </AlertCard>

      <!-- Not found -->
      <AlertCard v-else-if="cnpjNotFound" variant="warning" class="mb-3">
        <template #icon><AlertTriangle :size="18" /></template>
        <span class="small">{{ t('onboarding.cnpjStep.notFound') }}</span>
      </AlertCard>
    </Transition>

    <FormNavigation
      :show-back="false"
      :next-label="t('common.next')"
      :next-disabled="!meta.valid || !!statusError || isLoading"
      @next="submit"
    />
  </form>
</template>
