import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/**
 * Generic carousel composable.
 * Handles auto-advance, pause-on-hover, and keyboard navigation.
 * Completely decoupled from any domain — accepts only a count.
 */
export function useCarousel(count: number, intervalMs = 5000) {
  const current = ref(0)
  const isPaused = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const prev = () => {
    current.value = (current.value - 1 + count) % count
  }

  const next = () => {
    current.value = (current.value + 1) % count
  }

  const goTo = (index: number) => {
    current.value = index
  }

  const pause = () => { isPaused.value = true }
  const resume = () => { isPaused.value = false }

  const isActive = computed(() => (index: number) => index === current.value)

  function startTimer() {
    timer = setInterval(() => {
      if (!isPaused.value) next()
    }, intervalMs)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(startTimer)
  onBeforeUnmount(stopTimer)

  return { current, isActive, prev, next, goTo, pause, resume }
}
