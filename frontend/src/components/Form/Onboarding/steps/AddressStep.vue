<script setup lang="ts">
import { watch, onMounted, nextTick, ref } from 'vue'
import { useForm } from 'vee-validate'
import FormInputField from '@/components/Form/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import { onboardingAddressSchema, type OnboardingAddressValues } from '@/domain/onboarding/onboarding.schema'
import { useCepLookup } from '@/composables/useCepLookup'
import { sanitizeCep, applyCepMask } from '@/utils/formatters'
import { useTranslation } from '@/composables/useTranslation'
import { ADDRESS_DEFAULTS } from '@/domain/address/entities/AddressDefaults'

interface Props {
  initialValues?: Partial<OnboardingAddressValues>
}

const props = defineProps<Props>()
const emit = defineEmits<{ next: [values: OnboardingAddressValues]; back: []; update: [values: Partial<OnboardingAddressValues>] }>()

const { t } = useTranslation()
const { isLoading: isCepLoading, lookup: lookupCep, reset: resetCep } = useCepLookup()
const numeroRef = ref<HTMLDivElement | null>(null)

const maskedInitialCep = props.initialValues?.cep
  ? applyCepMask(props.initialValues.cep)
  : ''

// If cached address fields exist, restore them directly — no CEP lookup needed.
const hasCachedAddress = !!(
  props.initialValues?.logradouro ||
  props.initialValues?.cidade ||
  props.initialValues?.uf
)

const { handleSubmit, meta, values, setFieldValue } = useForm<OnboardingAddressValues>({
  validationSchema: onboardingAddressSchema,
  initialValues: {
    cep:         maskedInitialCep,
    logradouro:  props.initialValues?.logradouro  ?? ADDRESS_DEFAULTS.logradouro,
    numero:      props.initialValues?.numero      ?? ADDRESS_DEFAULTS.numero,
    complemento: props.initialValues?.complemento ?? ADDRESS_DEFAULTS.complemento,
    bairro:      props.initialValues?.bairro      ?? ADDRESS_DEFAULTS.bairro,
    cidade:      props.initialValues?.cidade      ?? ADDRESS_DEFAULTS.localidade,
    uf:          props.initialValues?.uf          ?? ADDRESS_DEFAULTS.uf,
  },
  validateOnMount: false,
})

// Only auto-run CEP lookup on mount when there are no cached address fields.
onMounted(async () => {
  if (hasCachedAddress) return
  const sanitized = sanitizeCep(maskedInitialCep)
  if (sanitized.length === 8) {
    await nextTick()
    await runCepLookup(sanitized)
  }
})

// Watch for manual CEP changes typed by the user
watch(
  () => values.cep,
  async (newCep) => {
    const sanitized = sanitizeCep(newCep)
    resetCep()
    if (sanitized.length === 8) {
      await runCepLookup(sanitized)
    }
  },
)

// Persist all address fields to store as user types
watch(values, (v) => emit('update', { ...v }), { deep: true })

async function runCepLookup(sanitizedCep: string) {
  const info = await lookupCep(sanitizedCep)
  if (info) {
    setFieldValue('logradouro', info.logradouro || '')
    setFieldValue('bairro',     info.bairro     || '')
    setFieldValue('cidade',     info.localidade  || '')
    setFieldValue('uf',         info.uf          || '')
    await nextTick()
    numeroRef.value?.querySelector('input')?.focus()
  }
}

const submit = handleSubmit((vals) => emit('next', vals))
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.steps.address.title')"
      :description="t('onboarding.steps.address.description')"
    />

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-4">
        <FormInputField
          name="cep"
          :label="t('onboarding.cep')"
          :placeholder="t('onboarding.placeholders.cep')"
          inputmode="numeric"
          mask="cep"
        >
          <template #below>
            <span v-if="isCepLoading" class="small text-primary pulse">{{ t('onboarding.searching') }}</span>
          </template>
        </FormInputField>
      </div>
      <div class="col-12 col-md-8">
        <FormInputField name="logradouro" :label="t('onboarding.street')" :placeholder="t('onboarding.placeholders.street')" />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div ref="numeroRef" class="col-12 col-md-4">
        <FormInputField name="numero" :label="t('onboarding.number')" :placeholder="t('onboarding.placeholders.number')" />
      </div>
      <div class="col-12 col-md-8">
        <FormInputField name="complemento" :label="t('onboarding.complement')" :placeholder="t('onboarding.placeholders.complement')" />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-5">
        <FormInputField name="bairro" :label="t('onboarding.neighborhood')" :placeholder="t('onboarding.placeholders.neighborhood')" />
      </div>
      <div class="col-12 col-md-5">
        <FormInputField name="cidade" :label="t('onboarding.city')" :placeholder="t('onboarding.placeholders.city')" />
      </div>
      <div class="col-12 col-md-2">
        <FormInputField name="uf" :label="t('onboarding.state')" :placeholder="t('onboarding.placeholders.state')" maxlength="2" />
      </div>
    </div>

    <FormNavigation :show-back="true" :next-disabled="!meta.valid" @back="$emit('back')" @next="submit" />
  </form>
</template>
