<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { InfoItemVariant } from '@/domain/ui/types/InfoItemVariant'

const props = defineProps<{
  label: string
  value: string
  variant?: InfoItemVariant
}>()

const { t } = useTranslation()

// Overflow detection
const valueRef = ref<HTMLElement | null>(null)
const isTruncated = ref(false)
const isPopupOpen = ref(false)

let observer: ResizeObserver | null = null

function checkOverflow() {
  const el = valueRef.value
  if (!el) return
  isTruncated.value = el.scrollWidth > el.clientWidth
}

onMounted(() => {
  checkOverflow()
  observer = new ResizeObserver(checkOverflow)
  if (valueRef.value) observer.observe(valueRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(() => props.value, () => {
  // Re-check after value changes
  setTimeout(checkOverflow, 0)
})

const openPopup = () => { isPopupOpen.value = true }
const closePopup = () => { isPopupOpen.value = false }

const variantClass = (v?: InfoItemVariant) => {
  if (v === 'success') return 'text-success fw-semibold'
  if (v === 'warning') return 'text-warning fw-semibold'
  if (v === 'danger')  return 'text-danger fw-semibold'
  return 'text-body'
}
</script>

<template>
  <div
    class="info-item"
    :class="{ 'info-item--clickable': isTruncated }"
    :title="isTruncated ? t('common.showMore') : undefined"
    @click="isTruncated ? openPopup() : undefined"
  >
    <span class="info-item__label text-uppercase small fw-semibold text-muted d-block mb-1">
      {{ label }}
    </span>

    <span
      ref="valueRef"
      class="info-item__value fw-medium d-block"
      :class="variantClass(variant)"
    >
      {{ value }}
    </span>

    <!-- Truncation hint -->
    <button
      v-if="isTruncated"
      class="info-item__expand-btn btn btn-link p-0 mt-1"
      type="button"
      @click.stop="openPopup"
    >
      <small class="text-muted">{{ t('common.showMore') }}</small>
    </button>
  </div>

  <!-- Full-value popup (teleported to body) -->
  <Teleport to="body">
    <Transition name="info-popup">
      <div
        v-if="isPopupOpen"
        class="info-popup-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        @click.self="closePopup"
      >
        <div class="info-popup-panel card shadow-lg p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <span class="text-uppercase small fw-semibold text-muted">{{ label }}</span>
            <button
              class="btn-close"
              type="button"
              :aria-label="t('common.close')"
              @click="closePopup"
            />
          </div>
          <p class="info-popup-panel__value mb-0 fw-medium" :class="variantClass(variant)">
            {{ value }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.info-item {
  border: 1px solid var(--color-surface-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-white);
  min-width: 0; /* allow flex/grid children to shrink */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.info-item--clickable {
  cursor: pointer;
}

.info-item--clickable:hover {
  border-color: var(--color-primary-teal);
  box-shadow: 0 0 0 2px var(--color-teal-alpha-10);
}

.info-item__value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.info-item__expand-btn {
  font-size: var(--font-size-xs);
  min-height: unset;
  line-height: 1;
  color: var(--color-primary-teal);
  text-decoration: none;
}

.info-item__expand-btn:hover {
  text-decoration: underline;
}

/* Popup backdrop */
.info-popup-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-black-alpha-50);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.info-popup-panel {
  width: 100%;
  max-width: 420px;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-surface-border);
}

.info-popup-panel__value {
  word-break: break-word;
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

/* Transition */
.info-popup-enter-active,
.info-popup-leave-active {
  transition: opacity 0.2s ease;
}
.info-popup-enter-from,
.info-popup-leave-to {
  opacity: 0;
}
</style>
