import { onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/useUiStore'

const SCROLL_THRESHOLD = 150  // px before hide kicks in
const SCROLL_DELTA = 8        // minimum scroll delta to trigger a state change

/**
 * Tracks scroll direction and updates the global header visibility state.
 * - Hides header when scrolling DOWN past the threshold
 * - Reveals header when scrolling UP (any amount)
 * - Respects reduced-motion preference by skipping the listener entirely
 *
 * Single Responsibility: only manages scroll → visibility mapping.
 * State lives in useUiStore so any component can react to it.
 */
export function useScrollVisibility() {
  const uiStore = useUiStore()
  let lastY = 0

  const onScroll = () => {
    const currentY = window.scrollY
    const delta = currentY - lastY

    if (Math.abs(delta) < SCROLL_DELTA) return

    if (delta > 0 && currentY > SCROLL_THRESHOLD) {
      uiStore.hideHeader()
    } else if (delta < 0) {
      uiStore.showHeader()
    }

    lastY = currentY
  }

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      lastY = window.scrollY
      window.addEventListener('scroll', onScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
}
