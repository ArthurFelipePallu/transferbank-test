<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'

interface Props {
  objectUrl: string
  fileName: string
}

defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
const { t } = useTranslation()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      class="pdf-modal-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="t('onboarding.socialContractStep.previewTitle')"
      @click.self="emit('close')"
    >
      <div class="pdf-modal">
        <div class="pdf-modal__header d-flex align-items-center justify-content-between px-3 py-2">
          <span class="small text-muted text-truncate me-2">{{ fileName }}</span>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            @click="emit('close')"
          >
            <BaseLucideIcon name="X" :size="16" />
            {{ t('common.close') }}
          </button>
        </div>
        <div class="pdf-modal__body">
          <iframe
            :src="objectUrl"
            :title="fileName"
            class="pdf-modal__iframe"
            type="application/pdf"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.pdf-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1055;
  padding: 1rem;
}

.pdf-modal {
  background: var(--color-surface, #fff);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.pdf-modal__header {
  border-bottom: 1px solid var(--bs-border-color);
  flex-shrink: 0;
}

.pdf-modal__body {
  flex: 1 1 auto;
  overflow: hidden;
}

.pdf-modal__iframe {
  width: 100%;
  height: 75vh;
  border: none;
  display: block;
}
</style>
