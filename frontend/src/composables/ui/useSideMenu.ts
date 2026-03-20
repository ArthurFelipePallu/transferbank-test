import { ref, watch, onUnmounted } from 'vue'

/**
 * Composable: useSideMenu
 * UI Layer — Single Responsibility
 *
 * Owns open/close state, body-scroll lock, and ESC key handling
 * for any side-panel / drawer component.
 * Components stay declarative — zero DOM side-effects in templates.
 */
export function useSideMenu(initialOpen = false) {
  const isOpen = ref(initialOpen)

  const lockScroll  = () => { document.body.style.overflow = 'hidden' }
  const unlockScroll = () => { document.body.style.overflow = '' }

  const open  = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  const toggle = () => { isOpen.value ? close() : open() }

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  watch(isOpen, (val) => {
    if (val) {
      lockScroll()
      window.addEventListener('keydown', onKeydown)
    } else {
      unlockScroll()
      window.removeEventListener('keydown', onKeydown)
    }
  })

  onUnmounted(() => {
    unlockScroll()
    window.removeEventListener('keydown', onKeydown)
  })

  return { isOpen, open, close, toggle }
}
