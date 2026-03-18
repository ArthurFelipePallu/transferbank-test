<script setup lang="ts">
/**
 * ReviewSection — a titled card section with an optional edit button.
 * Used in ReviewStep to avoid repeating the header+border pattern.
 */
import { Edit2 } from 'lucide-vue-next'

defineProps<{
  title: string
  editLabel?: string
}>()

const emit = defineEmits<{ edit: [] }>()
</script>

<template>
  <div class="review-section mb-3">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="fw-semibold mb-0 text-muted small text-uppercase">{{ title }}</h6>
      <button
        v-if="editLabel"
        type="button"
        class="btn btn-link btn-sm p-0 text-primary"
        @click="emit('edit')"
      >
        <Edit2 :size="14" class="me-1" />{{ editLabel }}
      </button>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.review-section {
  padding: 1rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
}
</style>
