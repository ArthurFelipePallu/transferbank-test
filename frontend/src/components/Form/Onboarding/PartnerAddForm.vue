<script setup lang="ts">
import { ref, computed, isRef } from "vue"
import { useForm } from "vee-validate"
import { X } from "lucide-vue-next"
import { useUiStore } from "@/stores/useUiStore"
import { useTranslation } from "@/composables/useTranslation"
import { usePartnerFormValidation } from "@/composables/usePartnerFormValidation"
import { createOnboardingPartnerSchema, type OnboardingPartnerValues } from "@/domain/onboarding/onboarding.schema"
import type { PartnerDocument } from "@/domain/partner/partner.types"
import type { OnboardingPartner } from "@/domain/onboarding/onboarding.types"
import { AddPartnerResult } from "@/domain/onboarding/onboarding.types"
import { ONBOARDING_PARTNER_DEFAULTS } from "@/domain/onboarding/entities/OnboardingDefaults"
import type { PartnerPanelStore } from "@/composables/usePartnerPanel"
import FormInputField from "@/components/Form/FormInputField.vue"
import PepCheckbox from "@/components/Form/PepCheckbox.vue"
import FieldWarning from "@/components/UI/FieldWarning.vue"
import DocumentsRequiredInfo from "@/components/UI/DocumentsRequiredInfo.vue"
import FileUpload from "@/components/Partner/FileUpload.vue"

interface Props {
  store: PartnerPanelStore
  editingPartner?: OnboardingPartner | null
}

const props = withDefaults(defineProps<Props>(), { editingPartner: null })
const emit = defineEmits<{ close: [] }>()

const { t } = useTranslation()
const uiStore = useUiStore()

const isEditMode = computed(() => props.editingPartner !== null)

const documents = ref<PartnerDocument[]>(
  (props.editingPartner?.documents as PartnerDocument[] | undefined) ?? [],
)

// Normalize — Pinia store properties are reactive but not wrapped in Ref when accessed directly
const unwrap = <T>(v: T | { value: T }): T => (isRef(v) ? (v as { value: T }).value : v as T)

// Snapshot cap at mount — prevents schema from shifting while form is open
const snapshotRemaining = unwrap<number>(props.store.remainingShareholding as number)
const snapshotCap = isEditMode.value && props.editingPartner
  ? snapshotRemaining + props.editingPartner.shareholding
  : snapshotRemaining

const { handleSubmit, meta, resetForm, values, setFieldValue, errors } =
  useForm<OnboardingPartnerValues>({
    validationSchema: createOnboardingPartnerSchema(snapshotCap),
    initialValues: props.editingPartner
      ? {
          fullName:     props.editingPartner.fullName,
          cpf:          props.editingPartner.cpf,
          nationality:  props.editingPartner.nationality,
          shareholding: props.editingPartner.shareholding,
          isPep:        props.editingPartner.isPep,
          documents:    (props.editingPartner.documents as PartnerDocument[]) ?? [],
        }
      : {
          fullName:     ONBOARDING_PARTNER_DEFAULTS.fullName,
          cpf:          ONBOARDING_PARTNER_DEFAULTS.cpf,
          nationality:  ONBOARDING_PARTNER_DEFAULTS.nationality,
          shareholding: undefined as unknown as number,
          isPep:        ONBOARDING_PARTNER_DEFAULTS.isPep,
          documents:    ONBOARDING_PARTNER_DEFAULTS.documents,
        },
    validateOnMount: true,
  })

const { shareholdingWarning, duplicateNameWarning, duplicateCpfWarning } =
  usePartnerFormValidation(
    computed(() => values.fullName),
    computed(() => values.cpf),
    computed(() => values.shareholding),
    (v) => setFieldValue("shareholding", v),
    computed(() => unwrap<OnboardingPartner[]>(props.store.partners as OnboardingPartner[])),
    computed(() => unwrap<number>(props.store.remainingShareholding as number)),
    props.editingPartner?.tempId,
  )

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
  try {
    if (isEditMode.value && props.editingPartner) {
      await props.store.updatePartner(props.editingPartner.tempId, {
        fullName:     vals.fullName,
        nationality:  vals.nationality,
        shareholding: Number(vals.shareholding),
        isPep:        vals.isPep,
        documents:    vals.documents ?? [],
      })
      close()
      return
    }

    const result = await props.store.addPartner({
      tempId:       crypto.randomUUID(),
      fullName:     vals.fullName,
      cpf:          vals.cpf,
      nationality:  vals.nationality,
      shareholding: Number(vals.shareholding),
      isPep:        vals.isPep,
      documents:    vals.documents ?? [],
    })
    if (result === AddPartnerResult.DuplicateCpf)  { uiStore.showWarning(t("onboarding.partnersStep.duplicateCpf"));  return }
    if (result === AddPartnerResult.DuplicateName) { uiStore.showWarning(t("onboarding.partnersStep.duplicateName")); return }
    close()
  } finally {
    uiStore.stopLoading()
  }
})
</script>

<template>
  <div class="p-3 border rounded-3 bg-body">
    <div class="d-flex align-items-start justify-content-between gap-2 mb-3 pb-3 border-bottom">
      <div>
        <h5 class="fw-semibold mb-1" style="font-size: 0.95rem">
          {{ isEditMode ? t("onboarding.partnersStep.editPartnerTitle") : t("onboarding.partnersStep.addPartnerTitle") }}
        </h5>
        <p class="text-muted small mb-0" style="font-size: var(--font-size-xs)">
          {{ isEditMode ? t("onboarding.partnersStep.editFormSubtitle") : t("onboarding.partnersStep.formSubtitle") }}
        </p>
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
          <FormInputField name="cpf" :label="t('onboarding.partnersStep.cpf')" :placeholder="t('onboarding.partnersStep.placeholders.cpf')" inputmode="numeric" mask="cpf" :disabled="isEditMode">
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
          <PepCheckbox :model-value="values.isPep" input-id="partner-isPep" @update:model-value="setFieldValue('isPep', $event)" />
        </div>

        <div class="col-12">
          <FileUpload :model-value="documents" :label="t('partner.registration.documents.uploadLabel')" :error="errors.documents as string | undefined" @update:model-value="updateDocuments" />
          <div class="mt-2"><DocumentsRequiredInfo /></div>
        </div>
      </div>

      <div class="d-flex gap-2 mt-3">
        <button type="button" class="btn btn-outline-secondary flex-fill" @click="close">
          {{ t("onboarding.partnersStep.cancel") }}
        </button>
        <button type="submit" class="btn btn-gradient-primary flex-fill" :disabled="!meta.valid">
          {{ isEditMode ? t("onboarding.partnersStep.update") : t("onboarding.partnersStep.save") }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.btn-close-form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
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
</style>
