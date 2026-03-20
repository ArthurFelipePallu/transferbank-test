<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { PartnersCollection } from '@/domain/partner/entities/PartnerSummary'
import PartnerListItem from './PartnerListItem.vue'
import PartnerListHeader from './PartnerListHeader.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'

defineProps<{
  collection: PartnersCollection
  isLoading?: boolean
}>()

const { t } = useTranslation()

const isExpanded = ref(false)
const toggleExpanded = () => { isExpanded.value = !isExpanded.value }

// Hide header below 500px — v-if is the only reliable way to hide a child component
// since scoped CSS cannot pierce into child component roots
const showHeader = ref(true)

function updateHeaderVisibility() {
  showHeader.value = window.innerWidth >= 500
}

onMounted(() => {
  updateHeaderVisibility()
  window.addEventListener('resize', updateHeaderVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderVisibility)
})
</script>

<template>
  <div class="card mb-4">
    <!-- Header toggle -->
    <button
      class="btn w-100 text-start d-flex align-items-center gap-3 p-4 border-0 rounded-0 partners-toggle"
      type="button"
      :disabled="isLoading"
      @click="toggleExpanded"
    >
      <div class="d-flex align-items-center justify-content-center flex-shrink-0 header-icon gradient-teal">
        <BaseLucideIcon name="Users" :size="24" />
      </div>

      <div class="flex-grow-1 min-w-0">
        <h3 class="h5 fw-semibold mb-1">{{ t('partner.companyPartners') }}</h3>
        <p class="small text-muted mb-0">
          {{ collection.totalCount }}
          {{ collection.totalCount === 1 ? t('partner.partner') : t('partner.partners') }}
          &bull; {{ collection.totalShareholding.toFixed(2) }}% {{ t('partner.allocated') }}
        </p>
      </div>

      <BaseLucideIcon
        name="ChevronDown"
        :size="20"
        class="flex-shrink-0 text-muted expand-icon"
        :class="{ 'expanded': isExpanded }"
      />
    </button>

    <!-- Expandable list -->
    <Transition name="expand">
      <div v-if="isExpanded" class="partners-body px-4 pb-4 pt-0">
        <div v-if="collection.totalCount === 0" class="text-center py-5">
          <p class="text-muted mb-0">{{ t('partner.noPartnersYet') }}</p>
        </div>

        <div v-else class="partners-list">
          <!-- Column header — hidden below 500px via v-if (scoped CSS can't pierce child roots) -->
          <PartnerListHeader v-if="showHeader" />

          <!-- Rows -->
          <div class="d-flex flex-column gap-2">
            <PartnerListItem
              v-for="partner in collection.partners"
              :key="partner.id"
              :partner="partner"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Shared column template — inherited by both PartnerListHeader and PartnerListItem */
.partners-list {
  --partner-row-cols: minmax(0, 2fr) minmax(0, 1.5fr) 5rem;
}

.partners-toggle {
  background: transparent;
  transition: background-color 0.2s ease;
}

.partners-toggle:hover:not(:disabled) {
  background: var(--bs-light);
}

.partners-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-white);
  flex-shrink: 0;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.25s ease, max-height 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
