import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CookieChoice } from '@/domain/cookieConsent/interfaces/cookieConsentInterface'
import { loadConsent, saveConsent } from '@/application/cookieConsent/cookieConsentUseCases'
import { localStorageCookieConsentRepository } from '@/infrastructure/cookieConsent/LocalStorageCookieConsentRepository'

export type { CookieChoice }

const BANNER_DELAY_MS = 600
const repository = localStorageCookieConsentRepository

export const useCookieConsentStore = defineStore('cookieConsent', () => {
  const stored = loadConsent(repository)

  const choice = ref<CookieChoice | null>(stored?.choice ?? null)
  const visible = ref(false)

  const hasDecided = computed(() => choice.value !== null)

  function init() {
    if (!hasDecided.value) {
      setTimeout(() => { visible.value = true }, BANNER_DELAY_MS)
    }
  }

  function setChoice(value: CookieChoice) {
    const consent = saveConsent(repository, value)
    choice.value = consent.choice
    visible.value = false
  }

  return { choice, hasDecided, visible, init, setChoice }
})
