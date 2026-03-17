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

interface Props {
  initialValues?: Partial<OnboardingAddressValues>
}

const props = defineProps<Props>()
const emit = defineEmits<{ next: [values: OnboardingAddressValues]; back: [] }>()

const { t } = useTranslation()
const { isLoading: isCepLoading, lookup: lookupCep, reset: resetCep } = useCepLookup()
const numeroRef = ref<HTMLDivElement | null>(null)

// Apply mask to raw CEP coming from CNPJ lookup (e.g. "01310100" → "01310-100")
const maskedInitialCep = props.initialValues?.cep
  ? applyCepMask(props.initialValues.cep)
  : ''

const { handleSubmit, meta, values, setFieldValue, setValues } = useForm<OnboardingAddressValues>({
  validationSchema: onboardingAddressSchema,
  initialValues: {
    cep: maskedInitialCep,
    logradouro: props.initialValues?.logradouro ?? '',
    numero: props.initialValues?.numero ?? '',
    complemento: props.initialValues?.complemento ?? '',
    bairro: props.initialValues?.bairro ?? '',
    cidade: props.initialValues?.cidade ?? '',
    uf: props.initialValues?.uf ?? '',
  },
  validateOnMount: false,
})

// If a CEP came pre-filled from the CNPJ lookup and address fields are empty,
// trigger the lookup immediately on mount so the user doesn't have to retype it.
onMounted(async () => {
  if (props.initialValues) {
    setValues({
      cep: maskedInitialCep,
      logradouro: props.initialValues.logradouro ?? '',
      numero: props.initialValues.numero ?? '',
      complemento: props.initialValues.complemento ?? '',
      bairro: props.initialValues.bairro ?? '',
      cidade: props.initialValues.cidade ?? '',
      uf: props.initialValues.uf ?? '',
    })
  }

  const sanitized = sanitizeCep(maskedInitialCep)
  const hasNoAddress = !props.initialValues?.logradouro && !props.initialValues?.bairro
  if (sanitized.length === 8 && hasNoAddress) {
    // Wait a tick so the form is fully initialized before we write to fields
    await nextTick()
    await runCepLookup(sanitized)
  }
})

// Watch for manual CEP changes typed by the user
watch(
  () => values.cep,
  async (newCep, oldCep) => {
    const sanitized = sanitizeCep(newCep)
    const oldSanitized = sanitizeCep(oldCep || '')
    resetCep()
    // Only run when the sanitized value actually changed and is complete
    if (sanitized.length === 8 && sanitized !== oldSanitized) {
      await runCepLookup(sanitized)
    }
  },
)

async function runCepLookup(sanitizedCep: string) {
  const info = await lookupCep(sanitizedCep)
  if (info) {
    // Only overwrite fields that are still empty
    if (!values.logradouro) setFieldValue('logradouro', info.logradouro || '')
    if (!values.bairro) setFieldValue('bairro', info.bairro || '')
    if (!values.cidade) setFieldValue('cidade', info.localidade || '')
    if (!values.uf) setFieldValue('uf', info.uf || '')

    // Focus the number field — it's the only one ViaCEP can't fill
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
