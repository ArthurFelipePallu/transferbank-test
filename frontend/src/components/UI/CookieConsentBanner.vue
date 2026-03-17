<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCookieConsentStore } from '@/stores/useCookieConsentStore'
import { useTranslation } from '@/composables/useTranslation'
import CookieConsentActions from './CookieConsentActions.vue'
import CookieConsentLinks from './CookieConsentLinks.vue'

const store = useCookieConsentStore()
const { t } = useTranslation()
const bannerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  store.init()
})

// Trap focus inside banner while visible; Escape = decline
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    store.setChoice('declined')
    return
  }
  if (e.key !== 'Tab') return

  const focusable = bannerRef.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])',
  )
  if (!focusable || focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (!first || !last) return

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <Transition name="cookie-banner">
    <div
      v-if="store.visible"
      ref="bannerRef"
      class="cookie-banner bg-white border-top shadow-sm py-3"
      role="dialog"
      aria-modal="false"
      aria-live="polite"
      :aria-label="t('cookies.title')"
      tabindex="-1"
      @keydown="onKeydown"
    >
      <div class="cookie-inner d-flex flex-row align-items-center justify-content-between gap-3 mx-auto px-3 px-lg-0">

        <!-- Text + policy links -->
        <div class="d-flex flex-column gap-1 flex-grow-1">
          <strong class="small text-dark">{{ t('cookies.title') }}</strong>
          <p class="mb-1 text-muted" style="font-size: 0.8rem; line-height: 1.4">
            {{ t('cookies.description') }}
          </p>
          <CookieConsentLinks />
        </div>

        <!-- Action buttons -->
        <CookieConsentActions class="flex-shrink-0" @choose="store.setChoice" />

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1050;
}

.cookie-inner {
  max-width: 1536px;
  width: 100%;
}

@media (min-width: 992px) {
  .cookie-inner {
    width: 80%;
  }
}

.cookie-banner-enter-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.cookie-banner-leave-active {
  transition: transform 0.25s ease-in, opacity 0.2s ease;
}

.cookie-banner-enter-from,
.cookie-banner-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
