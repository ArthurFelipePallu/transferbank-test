import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useTranslation } from '@/composables/useTranslation'

/**
 * Composable: usePartnerFormValidation
 *
 * Single Responsibility: owns all reactive validation warnings for the
 * onboarding partner form. Keeps the component free of business logic.
 *
 * Depends on:
 *  - useOnboardingStore  (domain state + checkPartnerDuplicate query)
 *  - useTranslation      (i18n — no raw strings here)
 *
 * Returns computed warnings (null = no warning) and a clamp side-effect
 * that prevents the shareholding field from exceeding the remaining cap.
 */
export function usePartnerFormValidation(
  fullName: Ref<string | undefined>,
  cpf: Ref<string | undefined>,
  shareholding: Ref<number | undefined>,
  setShareholding: (value: number) => void,
) {
  const store = useOnboardingStore()
  const { t } = useTranslation()

  // ── Shareholding cap ──────────────────────────────────────────────────────

  /**
   * Clamp: if the user types a value above the remaining cap, snap it back.
   * This is a UX guard — the schema's dynamic max is the authoritative rule.
   */
  watch(shareholding, (val) => {
    const num = Number(val)
    const remaining = store.remainingOnboardingShareholding
    if (!isNaN(num) && num > remaining && remaining > 0) {
      setShareholding(remaining)
    }
  })

  /** Inline warning shown below the shareholding field when value hits the cap. */
  const shareholdingWarning = computed<string | null>(() => {
    const num = Number(shareholding.value)
    const remaining = store.remainingOnboardingShareholding
    if (!isNaN(num) && num > 0 && num >= remaining && !store.isPartnersStepComplete) {
      return t('onboarding.partnersStep.shareholdingCapped', {
        remaining: remaining.toFixed(2),
      })
    }
    return null
  })

  // ── Duplicate detection ───────────────────────────────────────────────────

  /**
   * Inline warning shown below the name field when a duplicate is detected.
   * Delegates to store.checkPartnerDuplicate — single source of truth.
   */
  const duplicateNameWarning = computed<string | null>(() => {
    const name = (fullName.value ?? '').trim()
    if (!name) return null
    const result = store.checkPartnerDuplicate(name, '')
    return result === 'duplicate_name'
      ? t('onboarding.partnersStep.duplicateName')
      : null
  })

  /**
   * Inline warning shown below the CPF field when a duplicate is detected.
   * Only activates once a full 11-digit CPF has been entered.
   */
  const duplicateCpfWarning = computed<string | null>(() => {
    const raw = (cpf.value ?? '').replace(/\D/g, '')
    if (raw.length < 11) return null
    const result = store.checkPartnerDuplicate('', raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))
    return result === 'duplicate_cpf'
      ? t('onboarding.partnersStep.duplicateCpf')
      : null
  })

  return {
    shareholdingWarning,
    duplicateNameWarning,
    duplicateCpfWarning,
  }
}
