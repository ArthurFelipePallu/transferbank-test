import { ref, computed, isRef } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { OnboardingPartner } from '@/domain/onboarding/onboarding.types'
import { AddPartnerResult } from '@/domain/onboarding/onboarding.types'

/**
 * Domain Port: PartnerPanelStore
 *
 * The minimal interface any store must satisfy to power the partner panel UI.
 * Accepts both raw reactive values (from Pinia stores passed directly) and
 * wrapped Ref/ComputedRef values — both are valid Vue reactive primitives.
 */
export interface PartnerPanelStore {
  partners: Ref<OnboardingPartner[]> | ComputedRef<OnboardingPartner[]> | OnboardingPartner[]
  remainingShareholding: ComputedRef<number> | Ref<number> | number
  totalShareholding: ComputedRef<number> | Ref<number> | number
  canAddPartner: ComputedRef<boolean> | Ref<boolean> | boolean
  isPartnersStepComplete: ComputedRef<boolean> | Ref<boolean> | boolean
  addPartner: (p: OnboardingPartner) => AddPartnerResult | Promise<AddPartnerResult>
  updatePartner: (tempId: string, data: Partial<Omit<OnboardingPartner, 'tempId' | 'cpf'>>) => void | Promise<void>
  removePartner: (tempId: string) => void | Promise<void>
}

/** Unwrap a value that may or may not be a Ref */
function unwrap<T>(v: Ref<T> | ComputedRef<T> | T): T {
  return isRef(v) ? v.value : v
}

/**
 * Composable: usePartnerPanel
 * Application Layer — Single Responsibility
 *
 * Owns all UI state for the partner list + form panel.
 * Receives a PartnerPanelStore (injected dependency) so it works with any
 * backing store — onboarding (local) or live (API-backed).
 *
 * Components consume this composable only — zero direct store imports.
 */
export function usePartnerPanel(store: PartnerPanelStore) {
  const showForm       = ref(false)
  const formLeaving    = ref(false)
  const editingPartner = ref<OnboardingPartner | null>(null)

  const canAddPartner = computed(() => unwrap(store.canAddPartner) && !showForm.value)

  const openAddForm = () => {
    editingPartner.value = null
    showForm.value = true
  }

  const openEditForm = (tempId: string) => {
    editingPartner.value = unwrap(store.partners).find((p) => p.tempId === tempId) ?? null
    showForm.value = true
  }

  const closeForm = () => {
    showForm.value = false
    formLeaving.value = true
    editingPartner.value = null
  }

  const onFormAfterLeave = () => { formLeaving.value = false }

  const removePartner = (tempId: string) => store.removePartner(tempId)

  return {
    showForm,
    formLeaving,
    editingPartner,
    canAddPartner,
    openAddForm,
    openEditForm,
    closeForm,
    onFormAfterLeave,
    removePartner,
  }
}
