<script setup lang="ts">
defineProps<{
  count: number
  current: number
}>()

const emit = defineEmits<{ go: [index: number] }>()
</script>

<template>
  <div class="carousel-dots" role="tablist">
    <button
      v-for="i in count"
      :key="i"
      class="carousel-dots__dot"
      :class="{ 'carousel-dots__dot--active': current === i - 1 }"
      type="button"
      role="tab"
      :aria-selected="current === i - 1"
      :aria-label="`Slide ${i}`"
      @click="emit('go', i - 1)"
    />
  </div>
</template>

<style scoped>
.carousel-dots {
  display: flex;
  gap: var(--spacing-sm);
}

.carousel-dots__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-white-alpha-40);
  border: none;
  cursor: pointer;
  padding: 0;
  min-height: unset;
  transition: background 0.2s ease, transform 0.2s ease;
}

.carousel-dots__dot--active {
  background: var(--color-white);
  transform: scale(1.35);
}
</style>
