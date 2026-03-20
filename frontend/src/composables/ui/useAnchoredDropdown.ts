import { ref, nextTick } from 'vue'

export interface AnchoredDropdownPosition {
  top: string
  right: string
}

/**
 * Composable: useAnchoredDropdown
 * UI Layer — Single Responsibility
 *
 * Owns open/close state and computes a fixed-position style object
 * anchored to a trigger element's bounding rect.
 * Components stay declarative — zero DOM math in templates or script setup.
 */
export function useAnchoredDropdown(gap = 8) {
  const isOpen = ref(false)
  const position = ref<AnchoredDropdownPosition>({ top: '0px', right: '0px' })

  const updatePosition = (trigger: HTMLElement) => {
    const rect = trigger.getBoundingClientRect()
    position.value = {
      top: `${rect.bottom + gap}px`,
      right: `${window.innerWidth - rect.right}px`,
    }
  }

  const open = async (trigger: HTMLElement) => {
    isOpen.value = true
    await nextTick()
    updatePosition(trigger)
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = (trigger: HTMLElement) => {
    isOpen.value ? close() : open(trigger)
  }

  return { isOpen, position, open, close, toggle }
}
