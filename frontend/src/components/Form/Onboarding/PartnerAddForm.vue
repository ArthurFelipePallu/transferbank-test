<script setup lang="ts">
import { ref, computed } from "vue"
import { useForm } from "vee-validate"
import { X } from "lucide-vue-next"
import { storeToRefs } from "pinia"
import { useOnboardingStore } from "@/stores/useOnboardingStore"
import { useUiStore } from "@/stores/useUiStore"
import { useTranslation } from "@/composables/useTranslation"
import { usePartnerFormValidation } from "@/composables/usePartnerFormValidation"
import { createOnboardingPartnerSchema, type OnboardingPartnerValues } from "@/domain/onboarding/onboarding.schema"
import type { PartnerDocument } from "@/domain/partner/partner.types"
import FormInputField from "@/components/Form/FormInputField.vue"
import PepCheckbox from "@/components/Form/PepCheckbox.vue"
import FieldWarning from "@/components/UI/FieldWarning.vue"
import DocumentsRequiredInfo from "@/components/UI/DocumentsRequiredInfo.vue"
import FileUpload from "@/components/Partner/FileUpload.vue"
import { ONBOARDING_PARTNER_DEFAULTS } from "@/domain/onboarding/entities/OnboardingDefaults"

const emit = defineEmits<{ close: [] }>()

const { t } = useTranslation()
const store = useOnboardingStore()
const uiStore = useUiStore()
const { remainingOnboardingShareholding } = storeToRefs(store)

const documents = ref<PartnerDocument[]>([])

const validationSchema = computed(() =>
  createOnboardingPartnerSchema(remainingOnboardingShareholding.value),
)

const { handleSubmit, meta, resetForm, values, setFieldValue, errors } =
  useForm<OnboardingPartnerValues>({
    validationSchema,
    initialValues: {
      fullName:     ONBOARDING_PARTNER_DEFAULTS.fullName,
      cpf:          ONBOARDING_PARTNER_DEFAULTS.cpf,
      nationality:  ONBOARDING_PARTNER_DEFAULTS.nationality,
      shareholding: undefined as unknown as number,
      isPep:        ONBOARDING_PARTNER_DEFAULTS.isPep,
      documents:    ONBOARDING_PARTNER_DEFAULTS.documents,
    },
  })

const shareholdingRef = computed(() => values.shareholding)
const fullNameRef     = computed(() => values.fullName)
const cpfRef          = computed(() => values.cpf)

const { shareholdingWarning, duplicateNameWarning, duplicateCpfWarning } =
  usePartnerFormValidation(fullNameRef, cpfRef, shareholdingRef, (v) => setFieldValue("shareholding", v))

const updateDocuments = (files: PartnerDocument[]) => {
  documents.value = files
  setFieldValue("documents", files)
}

const close = () => {
  resetForm()
  documents.value = []
  emit("close")
}

const save = handleSubmit(async (vals) => {
  uiStore.startLoading(t("onboarding.partnersStep.saving"))
  await new Promise((r) => setTimeout(r, 120))
  try {
    const result = store.addOnboardingPartner({ ...vals, documents: vals.documents ?? [] })
    if (result === "duplicate_cpf")  { uiStore.showWarning(t("onboarding.partnersStep.duplicateCpf"));  return }
    if (result === "duplicate_name") { uiStore.showWarning(t("onboarding.partnersStep.duplicateName")); return }
    close()
  } finally {
    uiStore.stopLoading()
  }
})
</script>

<template>
  <div class="add-form">
    <!-- Header -->
    <div class="form-header">
      <div>
        <h5 class="form-title">{{ t("onboarding.partnersStep.addPartnerTitle") }}</h5>
        <p class="form-subtitle text-muted small mb-0">{{ t("onboarding.partnersStep.formSubtitle") }}</p>
      </div>
      <button type="button" class="btn-close-form" @click="close" :aria-label="t('common.close')">
        <X :size="16" />
      </button>
    </div>

    <form @submit.prevent="save" novalidate>
      <div class="row g-2">

        <div class="col-12">
          <FormInputField name="fullName" :label="t('onboarding.partnersStep.fullName')" :placeholder="t('onboarding.partnersStep.placeholders.fullName')">
            <template #below><FieldWarning :message="duplicateNameWarning" /></template>
          </FormInputField>
        </div>

        <div class="col-12">
          <FormInputField name="cpf" :label="t('onboarding.partnersStep.cpf')" :placeholder="t('onboarding.partnersStep.placeholders.cpf')" inputmode="numeric" mask="cpf">
            <template #below><FieldWarning :message="duplicateCpfWarning" /></template>
          </FormInputField>
        </div>

        <div class="col-12 col-md-6">
          <FormInputField name="nationality" :label="t('onboarding.partnersStep.nationality')" :placeholder="t('onboarding.partnersStep.placeholders.nationality')" />
        </div>

        <div class="col-12 col-md-6">
          <FormInputField name="shareholding" :label="t('onboarding.partnersStep.shareholding')" :placeholder="t('onboarding.partnersStep.placeholders.shareholding')" type="number" inputmode="decimal">
            <template #below><FieldWarning :message="shareholdingWarning" /></template>
          </FormInputField>
        </div>

        <div class="col-12">
          <PepCheckbox
            :model-value="values.isPep"
            input-id="onboarding-isPep"
            @update:model-value="setFieldValue('isPep', $event)"
          />
        </div>

        <div class="col-12">
          <FileUpload
            :model-value="documents"
            :label="t('partner.registration.documents.uploadLabel')"
            :error="errors.documents as string | undefined"
            @update:model-value="updateDocuments"
          />
          <div class="mt-2">
            <DocumentsRequiredInfo />
          </div>
        </div>

      </div>

      <div class="d-flex gap-2 mt-3">
        <button type="button" class="btn btn-outline-secondary flex-fill" @click="close">
          {{ t("onboarding.partnersStep.cancel") }}
        </button>
        <button type="submit" class="btn btn-primary flex-fill" :disabled="!meta.valid">
          {{ t("onboarding.partnersStep.save") }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-form {
  padding: 1rem;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--border-radius-lg);
  background: var(--bs-body-bg);
}

.form-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.form-title   { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
.form-subtitle { font-size: 0.78rem; }

.btn-close-form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  min-height: unset;
  padding: 0;
  border-radius: var(--border-radius-sm);
  color: var(--bs-secondary-color);
  background: transparent;
  border: 1px solid var(--bs-border-color);
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.btn-close-form:hover {
  background: var(--color-danger-alpha-15);
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  color: white;
}
.btn-primary:hover:not(:disabled) { opacity: 0.9; }
</style>
