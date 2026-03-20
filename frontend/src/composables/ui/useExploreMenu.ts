import { ref, watch, onUnmounted } from 'vue'

/**
 * useExploreMenu — UI composable (Single Responsibility)
 *
 * Manages the mobile explore FAB menu lifecycle:
 * - open / close / toggle state typed against ExploreMenuState domain type
 * - body scroll lock while sheet is open
 * - ESC key closes the sheet
 * - cleans up all side-effects on unmount
 *
 * No component logic, no routing — pure UI state management.
 */
export function useExploreMenu() {
  const isOpen = ref(false)

  const open   = () => { isOpen.value = true }
  const close  = () => { isOpen.value = false }
  const toggle = () => { isOpen.value ? close() : open() }

  // Body scroll lock — prevents background scroll while sheet is visible
  watch(isOpen, (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
  })

  // ESC key closes the sheet
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) close()
  }
  document.addEventListener('keydown', onKeyDown)

  // Cleanup — restore scroll and remove listener when component unmounts
  onUnmounted(() => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeyDown)
  })

  return { isOpen, open, close, toggle }
}
