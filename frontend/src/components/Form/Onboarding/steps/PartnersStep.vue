<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { UserPlus, Trash2, Users, CheckCircle } from 'lucide-vue-next'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/useTranslation'
import { usePartnerFormValidation } from '@/composables/usePartnerFormValidation'
import { createOnboardingPartnerSchema, type OnboardingPartnerValues } from '@/domain/onboarding/onboarding.schema'
import type { PartnerDocument } from '@/domain/partner/partner.types'
import FormInputField from '@/components/Form/FormInputField.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import FileUpload from '@/components/Partner/FileUpload.vue'
import { applyCpfMask, formatCpfDisplay } from '@/utils/formatters'
import { ONBOARDING_PARTNER_DEFAULTS } from '@/domain/onboarding/entities/OnboardingDefaults'

const emit = defineEmits<{ next: []; back: [] }>()

const { t } = useTranslation()
const store = useOnboardingStore()
const uiStore = useUiStore()
const {
  onboardingPartners,
  totalOnboardingShareholding,
  remainingOnboardingShareholding,
  isPartnersStepComplete,
} = storeToRefs(store)

// Delegate to the store — domain logic stays out of the presentation layer.
// Handles partners prefilled from CNPJ API with 0% shareholding.
onMounted(() => store.ensureShareholdingDistributed())

const showForm = ref(false)
const documents = ref<PartnerDocument[]>([])

const wasPrefilled = computed(
  () => onboardingPartners.value.length > 0 && !showForm.value,
)

const progressPercent = computed(() => Math.min(100, totalOnboardingShareholding.value))
const progressVariant = computed(() => {
  if (isPartnersStepComplete.value) return 'bg-success'
  if (totalOnboardingShareholding.value > 100) return 'bg-danger'
  return 'bg-primary'
})

// ─── Dynamic schema — cap is the remaining shareholding ───────────────────────
// Recomputed each time the form opens so the cap reflects the current state.
const validationSchema = computed(() =>
  createOnboardingPartnerSchema(remainingOnboardingShareholding.value),
)

const { handleSubmit, meta, resetForm, values, setFieldValue, errors } =
  useForm<OnboardingPartnerValues>({
    validationSchema,
    initialValues: {
      fullName: ONBOARDING_PARTNER_DEFAULTS.fullName,
      cpf: ONBOARDING_PARTNER_DEFAULTS.cpf,
      nationality: ONBOARDING_PARTNER_DEFAULTS.nationality,
      shareholding: undefined as unknown as number,
      isPep: ONBOARDING_PARTNER_DEFAULTS.isPep,
      documents: ONBOARDING_PARTNER_DEFAULTS.documents,
    },
  })

// ─── Validation warnings — all logic lives in the composable ─────────────────
const shareholdingRef = computed(() => values.shareholding)
const fullNameRef = computed(() => values.fullName)
const cpfRef = computed(() => values.cpf)

const { shareholdingWarning, duplicateNameWarning, duplicateCpfWarning } =
  usePartnerFormValidation(
    fullNameRef,
    cpfRef,
    shareholdingRef,
    (val) => setFieldValue('shareholding', val),
  )

// ─── Form actions ─────────────────────────────────────────────────────────────

const openForm = () => {
  resetForm()
  documents.value = []
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  resetForm()
  documents.value = []
}

const updateDocuments = (files: PartnerDocument[]) => {
  documents.value = files
  setFieldValue('documents', files)
}

const savePartner = handleSubmit(async (vals) => {
  uiStore.startLoading(t('onboarding.partnersStep.saving'))
  await new Promise((resolve) => setTimeout(resolve, 120))

  try {
    const result = store.addOnboardingPartner({ ...vals, documents: vals.documents ?? [] })

    if (result === 'duplicate_cpf') {
      uiStore.showWarning(t('onboarding.partnersStep.duplicateCpf'))
      return
    }
    if (result === 'duplicate_name') {
      uiStore.showWarning(t('onboarding.partnersStep.duplicateName'))
      return
    }

    closeForm()
  } finally {
    uiStore.stopLoading()
  }
})

const removePartner = (tempId: string) => store.removeOnboardingPartner(tempId)
</script>

<template>
  <div class="partners-step">

    <!-- ── Split layout ─────────────────────────────────────────────────── -->
    <div class="split-layout">

      <!-- LEFT COLUMN: list -->
      <div class="list-col">
        <div class="col-header">
          <h5 class="col-title">{{ t('onboarding.partnersStep.title') }}</h5>
          <p class="col-subtitle text-muted small mb-0">{{ t('onboarding.partnersStep.description') }}</p>
        </div>

        <!-- Pre-fill notice -->
        <AlertCard v-if="wasPrefilled" variant="info" class="mb-3">
          {{ t('onboarding.partnersStep.prefilled') }}
        </AlertCard>

        <!-- Progress -->
        <div class="mb-3">
          <div class="d-flex justify-content-between small text-muted mb-1">
            <span>{{ t('onboarding.partnersStep.totalShareholding') }}: <strong>{{ totalOnboardingShareholding.toFixed(2) }}%</strong></span>
            <span>{{ t('onboarding.partnersStep.remaining') }}: <strong>{{ remainingOnboardingShareholding.toFixed(2) }}%</strong></span>
          </div>
          <div class="progress" style="height: 5px;">
            <div
              class="progress-bar"
              :class="progressVariant"
              :style="{ width: `${progressPercent}%` }"
              role="progressbar"
            />
          </div>
        </div>

        <!-- Partner cards -->
        <div class="d-flex flex-column gap-2">
          <div
            v-for="partner in onboardingPartners"
            :key="partner.tempId"
            class="partner-card"
          >
            <div class="partner-avatar">
              <Users :size="14" />
            </div>
            <div class="partner-info">
              <p class="partner-name">{{ partner.fullName }}</p>
              <p class="partner-cpf">{{ formatCpfDisplay(partner.cpf) }}</p>
            </div>
            <div class="partner-actions">
              <span class="partner-share">{{ partner.shareholding.toFixed(2) }}%</span>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1 flex-shrink-0"
                @click="removePartner(partner.tempId)"
                :aria-label="`Remove ${partner.fullName}`"
              >
                <Trash2 :size="13" />
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="onboardingPartners.length === 0"
            class="empty-state"
          >
            <Users :size="28" class="mb-2 opacity-40" />
            <p class="small mb-0">{{ t('onboarding.partnersStep.noPartners') }}</p>
          </div>

          <!-- Add button -->
          <button
            v-if="!isPartnersStepComplete"
            type="button"
            class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 w-100 mt-1"
            @click="openForm"
          >
            <UserPlus :size="15" />
            {{ t('onboarding.partnersStep.addPartner') }}
          </button>

          <!-- 100% badge -->
          <div v-if="isPartnersStepComplete" class="d-flex align-items-center gap-2 text-success small mt-1">
            <CheckCircle :size="15" />
            {{ t('onboarding.partnersStep.shareholdingFull') }}
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: form (always in DOM, slides in) -->
      <div class="form-col" :class="{ 'form-col--visible': showForm }">
        <div class="col-header">
          <h5 class="col-title">{{ t('onboarding.partnersStep.addPartnerTitle') }}</h5>
          <p class="col-subtitle text-muted small mb-0">{{ t('onboarding.partnersStep.formSubtitle') }}</p>
        </div>

        <form @submit.prevent="savePartner" novalidate>
          <div class="row g-2">
            <div class="col-12">
              <FormInputField
                name="fullName"
                :label="t('onboarding.partnersStep.fullName')"
                :placeholder="t('onboarding.partnersStep.placeholders.fullName')"
              >
                <template v-if="duplicateNameWarning" #below>
                  <p class="field-warning mt-1">{{ duplicateNameWarning }}</p>
                </template>
              </FormInputField>
            </div>
            <div class="col-12">
              <FormInputField
                name="cpf"
                :label="t('onboarding.partnersStep.cpf')"
                :placeholder="t('onboarding.partnersStep.placeholders.cpf')"
                inputmode="numeric"
                mask="cpf"
              >
                <template v-if="duplicateCpfWarning" #below>
                  <p class="field-warning mt-1">{{ duplicateCpfWarning }}</p>
                </template>
              </FormInputField>
            </div>
            <div class="col-12">
              <FormInputField
                name="nationality"
                :label="t('onboarding.partnersStep.nationality')"
                :placeholder="t('onboarding.partnersStep.placeholders.nationality')"
              />
            </div>
            <div class="col-12">
              <FormInputField
                name="shareholding"
                :label="t('onboarding.partnersStep.shareholding')"
                :placeholder="t('onboarding.partnersStep.placeholders.shareholding')"
                type="number"
                inputmode="decimal"
              >
                <template v-if="shareholdingWarning" #below>
                  <p class="field-warning mt-1">{{ shareholdingWarning }}</p>
                </template>
              </FormInputField>
            </div>

            <!-- PEP -->
            <div class="col-12">
              <div class="card border-primary-subtle bg-light mb-1">
                <div class="card-body py-2 px-3">
                  <div class="form-check mb-0">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="onboarding-isPep"
                      :checked="values.isPep"
                      @change="setFieldValue('isPep', !values.isPep)"
                    />
                    <label class="form-check-label small fw-medium" for="onboarding-isPep">
                      {{ t('onboarding.partnersStep.isPep') }}
                    </label>
                  </div>
                  <p class="text-muted mb-0 mt-1" style="font-size: 0.72rem;">
                    {{ t('onboarding.partnersStep.pepDescription') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div class="col-12">
              <FileUpload
                :model-value="documents"
                :label="t('partner.registration.documents.uploadLabel')"
                :error="errors.documents as string | undefined"
                @update:model-value="updateDocuments"
              />
              <div class="mt-2">
                <AlertCard variant="info">
                  <p class="fw-semibold mb-1 small">{{ t('partner.registration.documents.requiredTitle') }}</p>
                  <ul class="mb-0 ps-3 small">
                    <li>{{ t('partner.registration.documents.idCard') }}</li>
                    <li>{{ t('partner.registration.documents.driversLicense') }}</li>
                    <li>{{ t('partner.registration.documents.proofOfAddress') }}</li>
                  </ul>
                </AlertCard>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-3">
            <button type="button" class="btn btn-outline-secondary flex-fill" @click="closeForm">
              {{ t('onboarding.partnersStep.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary flex-fill" :disabled="!meta.valid">
              {{ t('onboarding.partnersStep.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <FormNavigation
      next-type="button"
      :next-label="t('common.next')"
      :next-disabled="!isPartnersStepComplete"
      @next="emit('next')"
      @back="emit('back')"
    />
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────── */
.partners-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.split-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  align-items: start;
}

/* ── Column headers ──────────────────────────────────────────────────────── */
.col-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.col-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.col-subtitle {
  font-size: 0.78rem;
}

/* ── Partner cards ───────────────────────────────────────────────────────── */
.partner-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  background: var(--bs-body-bg);
  transition: border-color 0.2s ease;
  /* Prevent any child from breaking out */
  min-width: 0;
  overflow: hidden;
}

.partner-card:hover {
  border-color: var(--color-primary-teal);
}

.partner-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--color-primary-teal);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.partner-info {
  flex: 1;
  min-width: 0; /* critical for text-overflow to work */
  overflow: hidden;
}

.partner-name {
  font-size: 0.82rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partner-cpf {
  font-size: 0.7rem;
  color: var(--bs-secondary-color);
  margin: 0;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partner-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0; /* never shrink — keeps delete button in place */
}

.partner-share {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary-teal);
  white-space: nowrap;
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border: 1px dashed var(--bs-border-color);
  border-radius: 0.5rem;
  color: var(--bs-secondary-color);
  text-align: center;
}

/* ── Right form column ───────────────────────────────────────────────────── */
.form-col {
  min-width: 0;
  opacity: 0;
  transform: translateX(20px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.form-col--visible {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* ── Shared ──────────────────────────────────────────────────────────────── */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

/* ── Inline field warnings ───────────────────────────────────────────────── */
.field-warning {
  font-size: 0.75rem;
  color: var(--color-warning-ui-text);
  background: var(--color-warning-ui-bg);
  border: 1px solid var(--color-warning-alpha-40);
  border-radius: var(--border-radius-sm);
  padding: 0.25rem 0.5rem;
  margin: 0;
  line-height: 1.4;
}

/* ── Mobile: stack ───────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .split-layout {
    grid-template-columns: 1fr;
  }

  .form-col {
    transform: translateY(12px);
  }

  .form-col--visible {
    transform: translateY(0);
  }
}
</style>
