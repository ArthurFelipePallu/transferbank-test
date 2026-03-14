import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Composable for handling click-outside detection
 * Following DDD/SOLID principles - Single Responsibility
 */
export function useClickOutside(
  targetSelector: string,
  onClickOutside: () => void,
  options: { enabled?: Ref<boolean>; delay?: number } = {}
) {
  const { enabled = ref(true), delay = 0 } = options
  const isEnabled = ref(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (!enabled.value || !isEnabled.value) return

    const target = event.target as HTMLElement
    if (!target.closest(targetSelector)) {
      onClickOutside()
    }
  }

  const enable = () => {
    if (delay > 0) {
      setTimeout(() => {
        isEnabled.value = true
      }, delay)
    } else {
      isEnabled.value = true
    }
  }

  const disable = () => {
    isEnabled.value = false
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    enable,
    disable,
    isEnabled,
  }
}
