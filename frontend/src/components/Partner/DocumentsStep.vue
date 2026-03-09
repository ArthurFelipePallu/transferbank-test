<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import FileUpload from './FileUpload.vue'
import { partnerDocumentsSchema, type PartnerDocumentsFormValues } from '@/domain/partner/partner.schema'
import type { PartnerDocument } from '@/domain/partner/partner.types'

const props = defineProps<{
  initialValues?: Partial<PartnerDocumentsFormValues>
}>()

const emit = defineEmits<{
  next: [values: PartnerDocumentsFormValues]
  back: []
}>()

const { handleSubmit, meta, setFieldValue, errors } = useForm<PartnerDocumentsFormValues>({
  validationSchema: partnerDocumentsSchema,
  initialValues: props.initialValues || {
    documents: [],
  },
})

const documents = ref<PartnerDocument[]>(props.initialValues?.documents || [])

const updateDocuments = (files: PartnerDocument[]) => {
  documents.value = files
  setFieldValue('documents', files)
}

const submit = handleSubmit((values) => {
  emit('next', values)
})
</script>

<template>
  <form class="step-form" @submit.prevent="submit">
    <h2 class="form-title">Documents</h2>
    <p class="form-description">Upload identification documents</p>

    <div class="form-fields">
      <FileUpload
        :model-value="documents"
        label="Upload Documents"
        :error="errors.documents"
        @update:model-value="updateDocuments"
      />

      <div class="info-message">
        <p class="info-title">📄 Required Documents:</p>
        <ul class="info-list">
          <li>ID Card (front and back)</li>
          <li>Driver's License (front and back)</li>
          <li>Proof of Address</li>
        </ul>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn--secondary" @click="$emit('back')">
        Back
      </button>
      <button type="submit" class="btn btn--primary" :disabled="!meta.valid">
        Review & Submit
      </button>
    </div>
  </form>
</template>

<style scoped>
.step-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
}

.form-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: -0.75rem 0 0;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-message {
  padding: 1.25rem;
  background: rgba(28, 156, 140, 0.05);
  border: 1px solid var(--color-primary-teal);
  border-radius: 0.75rem;
}

.info-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 0.75rem;
}

.info-list {
  margin: 0;
  padding-left: 1.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.8;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  flex: 1;
}

.btn--secondary {
  background: var(--color-chip-bg);
  color: var(--color-text-main);
  border: 1px solid var(--color-chip-border);
}

.btn--secondary:hover {
  background: var(--color-surface);
}

.btn--secondary:active {
  transform: translateY(1px);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  box-shadow: var(--shadow-button-primary);
}

.btn--primary:hover:not(:disabled) {
  box-shadow: var(--shadow-button-primary-active);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(1px);
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

@media (min-width: 640px) {
  .form-title {
    font-size: 1.6rem;
  }

  .form-actions {
    justify-content: flex-end;
  }

  .btn {
    flex: 0;
    min-width: 150px;
  }
}
</style>
