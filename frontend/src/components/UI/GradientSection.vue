<script setup lang="ts">
import { useMousePosition } from '@/composables/useMousePosition'

withDefaults(
  defineProps<{
    ariaLabel?: string
    ariaLabelledby?: string
    contentClass?: string
  }>(),
  { contentClass: '' }
)

const { cssPosition } = useMousePosition()
</script>

<template>
  <section
    class="gradient-section section-spacing"
    :style="{ '--gpos': cssPosition }"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
  >
    <div :class="['standard-container px-3 px-lg-0', contentClass]">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.gradient-section {
  background:
    radial-gradient(
      circle at var(--gpos, 50% 50%),
      var(--color-white-alpha-8) 0%,
      transparent 55%
    ),
    linear-gradient(
      135deg,
      var(--color-primary-bg-start) 0%,
      var(--color-primary-bg-mid)   50%,
      var(--color-primary-bg-end)   100%
    );
}
</style>
