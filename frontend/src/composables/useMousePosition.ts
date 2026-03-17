import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Tracks mouse position on desktop; returns viewport center on touch devices.
 * Attaches/detaches the event listener automatically with the component lifecycle.
 */
export function useMousePosition() {
  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches

  const position = ref({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const onMouseMove = (e: MouseEvent) => {
    position.value = { x: e.clientX, y: e.clientY }
  }

  onMounted(() => {
    if (!isTouchDevice()) window.addEventListener('mousemove', onMouseMove)
  })

  onUnmounted(() => {
    if (!isTouchDevice()) window.removeEventListener('mousemove', onMouseMove)
  })

  const cssPosition = computed(() => `${position.value.x}px ${position.value.y}px`)

  return { position, cssPosition }
}
