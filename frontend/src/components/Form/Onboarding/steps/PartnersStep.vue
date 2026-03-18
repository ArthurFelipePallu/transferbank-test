<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { UserPlus, CheckCircle, Users } from 'lucide-vue-next'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useTranslation } from '@/composables/useTranslation'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import ShareholdingProgress from '@/components/UI/ShareholdingProgress.vue'
import PartnerCard from '@/components/Form/Onboarding/PartnerCard.vue'
import PartnerAddForm from '@/components/Form/Onboarding/PartnerAddForm.vue'

const emit = defineEmits<{ next: []; back: [] }>()

const { t } = useTranslation()
const store = useOnboardingStore()
const {
  onboardingPartners,
  totalOnboardingShareholding,
  remainingOnboardingShareholding,
  isPartnersStepComplete,
} = storeToRefs(store)

onMounted(() => store.ensureShareholdingDistributed())

// ── UI state (presentation layer only) ───────────────────────────────────────
const showForm = ref(false)

const openForm  = () => { showForm.value = true }
const closeForm = () => { showForm.value = false }

// ── Derived presentation state (domain-driven, no raw logic in template) ─────

/** True when partners were pre-loaded from CNPJ lookup — domain fact, not UI state */
const wasPrefilled = computed(() => onboardingPartners.value.length > 0)

/** Controls add-button visibility: step not done AND form not already open */
const canAddPartner = computed(() => !isPartnersStepComplete.value && !showForm.value)
</script>

<template>
  <div class="partners-step">

    <div class="partners-layout" :class="{ 'has-form': showForm }">

      <!-- List panel: full width by default, shrinks to 1/3 when form opens -->
      <div class="list-panel">

        <div class="panel-header">
          <div>
            <h5 class="panel-title">{{ t('onboarding.partnersStep.title') }}</h5>
            <p class="panel-subtitle text-muted small mb-0">{{ t('onboarding.partnersStep.description') }}</p>
          </div>
        </div>

        <AlertCard v-if="wasPrefilled && !showForm" variant="info" class="mb-3">
          {{ t('onboarding.partnersStep.prefilled') }}
        </AlertCard>

        <div class="mb-3">
          <ShareholdingProgress
            :total="totalOnboardingShareholding"
            :remaining="remainingOnboardingShareholding"
          />
        </div>

        <div class="d-flex flex-column gap-2">
          <PartnerCard
            v-for="partner in onboardingPartners"
            :key="partner.tempId"
            :partner="partner"
            @remove="store.removeOnboardingPartner($event)"
          />

          <div v-if="onboardingPartners.length === 0" class="empty-state">
            <Users :size="28" class="mb-2 opacity-40" />
            <p class="small mb-0">{{ t('onboarding.partnersStep.noPartners') }}</p>
          </div>

          <button
            v-if="canAddPartner"
            type="button"
            class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 w-100 mt-1"
            @click="openForm"
          >
            <UserPlus :size="15" />
            {{ t('onboarding.partnersStep.addPartner') }}
          </button>

          <div v-if="isPartnersStepComplete" class="d-flex align-items-center gap-2 text-success small mt-1">
            <CheckCircle :size="15" />
            {{ t('onboarding.partnersStep.shareholdingFull') }}
          </div>
        </div>
      </div>

      <!-- Form panel: slides in from the right on desktop, fades in below on mobile -->
      <Transition name="form-slide">
        <div v-if="showForm" class="form-panel">
          <PartnerAddForm @close="closeForm" />
        </div>
      </Transition>

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
.partners-step {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Layout container ─────────────────────────────────────────────────────── */
.partners-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── List panel ───────────────────────────────────────────────────────────── */
.list-panel {
  width: 100%;
  /* Smooth width transition when the form opens/closes */
  transition: flex 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Form panel ───────────────────────────────────────────────────────────── */
.form-panel {
  /* Ensure it doesn't collapse before the transition finishes */
  min-width: 0;
}

/* ── Desktop two-column layout ────────────────────────────────────────────── */
@media (min-width: 768px) {
  .partners-layout {
    flex-direction: row;
    align-items: flex-start;
  }

  /* Default: list takes full row */
  .list-panel {
    flex: 1 1 100%;
    max-width: 100%;
  }

  /* When form is open: list shrinks to 1/3, form takes 2/3 */
  .partners-layout.has-form .list-panel {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }

  .partners-layout.has-form .form-panel {
    flex: 1 1 0;
  }
}

/* ── Panel chrome ─────────────────────────────────────────────────────────── */
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.panel-title   { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
.panel-subtitle { font-size: 0.78rem; }

/* ── Empty state ──────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border: 1px dashed var(--bs-border-color);
  border-radius: var(--border-radius-md);
  color: var(--bs-secondary-color);
  text-align: center;
}

/* ── Form slide-in transition ─────────────────────────────────────────────── */
.form-slide-enter-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.form-slide-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 1, 1),
              transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.form-slide-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.form-slide-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

/* On mobile the form stacks below — fade only, no horizontal slide */
@media (max-width: 767px) {
  .form-slide-enter-from,
  .form-slide-leave-to {
    transform: translateY(8px);
  }
}
</style>
