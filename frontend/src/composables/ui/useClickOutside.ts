import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Composable: useClickOutside
 * UI Layer — Single Responsibility
 *
 * Accepts either a CSS selector string or a template ref.
 * Calls the callback when a click occurs outside the target.
 */
export function useClickOutside(
  target: string | Ref<HTMLElement | null>,
  onClickOutside: () => void,
  options: { enabled?: Ref<boolean>; delay?: number } = {}
) {
  const { enabled = ref(true), delay = 0 } = options
  const isEnabled = ref(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (!enabled.value || !isEnabled.value) return

    const el = event.target as HTMLElement
    const isOutside = typeof target === 'string'
      ? !el.closest(target)
      : !!target.value && !target.value.contains(el)

    if (isOutside) onClickOutside()
  }

  const enable = () => {
    if (delay > 0) {
      setTimeout(() => { isEnabled.value = true }, delay)
    } else {
      isEnabled.value = true
    }
  }

  const disable = () => { isEnabled.value = false }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    enable()
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })

  return { enable, disable, isEnabled }
}
