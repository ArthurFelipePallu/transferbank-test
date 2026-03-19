import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { applyCpfMask } from '@/utils/formatters'
import type { OnboardingPartner } from '@/domain/onboarding/onboarding.types'

/**
 * Composable: usePartnerFormValidation
 * Application Layer — Single Responsibility
 *
 * Owns all reactive validation warnings for the partner add/edit form.
 * Decoupled from any specific store — receives partners list and remaining
 * shareholding as refs so it works in both onboarding and live-edit contexts.
 */
export function usePartnerFormValidation(
  fullName: Ref<string | undefined>,
  cpf: Ref<string | undefined>,
  shareholding: Ref<number | undefined>,
  setShareholding: (value: number) => void,
  partners: Ref<OnboardingPartner[]>,
  remainingShareholding: Ref<number> | { value: number },
  excludeTempId?: string,
) {
  const { t } = useTranslation()

  // ── Shareholding cap ──────────────────────────────────────────────────────

  watch(shareholding, (val) => {
    const num = Number(val)
    const remaining = remainingShareholding.value
    if (remaining > 0 && !isNaN(num) && num > remaining) {
      setShareholding(remaining)
    }
  })

  const shareholdingWarning = computed<string | null>(() => {
    const num = Number(shareholding.value)
    const remaining = remainingShareholding.value
    if (!isNaN(num) && num > 0 && num > remaining && remaining > 0) {
      return t('onboarding.partnersStep.shareholdingCapped', { remaining: remaining.toFixed(2) })
    }
    return null
  })

  // ── Duplicate detection ───────────────────────────────────────────────────

  const duplicateNameWarning = computed<string | null>(() => {
    const name = (fullName.value ?? '').trim()
    if (!name) return null
    const others = partners.value.filter((p) => p.tempId !== excludeTempId)
    return others.some((p) => p.fullName.toLowerCase() === name.toLowerCase())
      ? t('onboarding.partnersStep.duplicateName')
      : null
  })

  const duplicateCpfWarning = computed<string | null>(() => {
    const raw = (cpf.value ?? '').replace(/\D/g, '')
    if (raw.length < 11) return null
    const formatted = applyCpfMask(raw)
    const others = partners.value.filter((p) => p.tempId !== excludeTempId)
    return others.some((p) => p.cpf === formatted)
      ? t('onboarding.partnersStep.duplicateCpf')
      : null
  })

  return { shareholdingWarning, duplicateNameWarning, duplicateCpfWarning }
}
