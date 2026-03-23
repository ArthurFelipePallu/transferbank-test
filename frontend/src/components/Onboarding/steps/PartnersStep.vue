<script setup lang="ts">
import { computed, isRef } from 'vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { useScrollToTop } from '@/composables/ui/useScrollToTop'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { usePartnerPanel } from '@/composables/form/usePartnerPanel'
import type { PartnerPanelStore } from '@/composables/form/usePartnerPanel'
import type { OnboardingPartner } from '@/domain/onboarding/onboarding.types'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import ShareholdingProgress from '@/components/UI/ShareholdingProgress.vue'
import PartnerCard from '@/components/Partner/PartnerCard.vue'
import PartnerAddForm from '@/components/Partner/PartnerAddForm.vue'

interface Props {
  store: PartnerPanelStore
  showNavigation?: boolean
  showPrefillAlert?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNavigation: true,
  showPrefillAlert: false,
})
const emit = defineEmits<{ next: []; back: [] }>()

const { t } = useTranslation()
const { scrollToTop } = useScrollToTop()

const {
  showForm,
  formLeaving,
  editingPartner,
  canAddPartner,
  openAddForm,
  openEditForm,
  closeForm,
  onFormAfterLeave,
  removePartner,
} = usePartnerPanel(props.store)

// Normalize store values — Pinia stores expose reactive properties directly (not as Refs)
// so we use computed wrappers to ensure consistent .value access in the template
const unwrap = <T>(v: T | { value: T }): T => (isRef(v) ? (v as { value: T }).value : v as T)

const partnersList      = computed(() => unwrap<OnboardingPartner[]>(props.store.partners as OnboardingPartner[]))
const totalShareholding = computed(() => unwrap<number>(props.store.totalShareholding as number))
const remaining         = computed(() => unwrap<number>(props.store.remainingShareholding as number))
const isComplete        = computed(() => unwrap<boolean>(props.store.isPartnersStepComplete as boolean))

const handleOpenEdit = (tempId: string) => { openEditForm(tempId); scrollToTop() }
const handleClose    = () => { closeForm(); scrollToTop() }

const hasForm = computed(() => showForm.value || formLeaving.value)
</script>

<template>
  <div class="d-flex flex-column gap-4">

    <div class="partners-layout" :class="{ 'has-form': hasForm }">

      <!-- List panel -->
      <div class="list-panel">
        <div class="d-flex align-items-start justify-content-between pb-3 mb-3 border-bottom">
          <div>
            <h5 class="fw-semibold mb-1" style="font-size: 0.95rem">{{ t('onboarding.partnersStep.title') }}</h5>
            <p class="text-muted small mb-0">{{ t('onboarding.partnersStep.description') }}</p>
          </div>
        </div>

        <AlertCard v-if="showPrefillAlert && !showForm" variant="info" class="mb-3">
          {{ t('onboarding.partnersStep.prefilled') }}
        </AlertCard>

        <div class="mb-3">
          <ShareholdingProgress
            :total="totalShareholding"
            :remaining="remaining"
          />
        </div>

        <div class="d-flex flex-column gap-2">
          <PartnerCard
            v-for="partner in partnersList"
            :key="partner.tempId"
            :partner="partner"
            @remove="removePartner($event)"
            @edit="handleOpenEdit($event)"
          />

          <div
            v-if="partnersList.length === 0"
            class="d-flex flex-column align-items-center justify-content-center gap-1 p-4 border border-dashed rounded-3 text-secondary text-center"
          >
            <BaseLucideIcon name="Users" :size="28" class="opacity-50" />
            <p class="small mb-0">{{ t('onboarding.partnersStep.noPartners') }}</p>
          </div>

          <button
            v-if="canAddPartner"
            type="button"
            class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 w-100 mt-1"
            @click="openAddForm"
          >
            <BaseLucideIcon name="UserPlus" :size="15" />
            {{ t('onboarding.partnersStep.addPartner') }}
          </button>

          <div v-if="isComplete" class="d-flex align-items-center gap-2 text-success small mt-1">
            <BaseLucideIcon name="CheckCircle" :size="15" />
            {{ t('onboarding.partnersStep.shareholdingFull') }}
          </div>
        </div>
      </div>

      <!-- Form panel -->
      <Transition name="form-slide" @after-leave="onFormAfterLeave">
        <div v-if="showForm" class="form-panel">
          <PartnerAddForm :store="store" :editing-partner="editingPartner" @close="handleClose" />
        </div>
      </Transition>

    </div>

    <FormNavigation
      v-if="showNavigation"
      next-type="button"
      :next-label="t('common.next')"
      :next-disabled="!isComplete"
      @next="emit('next')"
      @back="emit('back')"
    />
  </div>
</template>

<style scoped>
.partners-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.list-panel {
  width: 100%;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-panel {
  min-width: 0;
  flex: 1 1 0;
}

@media (min-width: 768px) {
  .partners-layout {
    flex-direction: row;
    align-items: flex-start;
    overflow: hidden;
  }
  .list-panel {
    flex: 0 0 auto;
    width: 100%;
    max-width: 100%;
  }
  .partners-layout.has-form .list-panel {
    width: 33.333%;
    max-width: 33.333%;
  }
}

.form-slide-enter-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.form-slide-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 1, 1),
              transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.form-slide-enter-from { opacity: 0; transform: translateX(16px); }
.form-slide-leave-to   { opacity: 0; transform: translateX(8px); }

@media (max-width: 767px) {
  .form-slide-enter-from,
  .form-slide-leave-to { transform: translateY(8px); }
}
</style>
