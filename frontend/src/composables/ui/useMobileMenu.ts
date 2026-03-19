import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Composable for mobile menu state management
 * Following DDD/SOLID principles - Single Responsibility
 * Handles: menu state, body scroll prevention, route change detection
 */
export function useMobileMenu() {
  const router = useRouter()
  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  // Close menu on route change
  router.afterEach(() => {
    close()
  })

  // Prevent body scroll when menu is open
  watch(isOpen, (menuIsOpen) => {
    if (menuIsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
