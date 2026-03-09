<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Users } from 'lucide-vue-next'
import type { PartnersCollection } from '@/domain/partner/entities/PartnerSummary'
import PartnerListItem from './PartnerListItem.vue'
import { useTranslation } from '@/composables/useTranslation'

defineProps<{
  collection: PartnersCollection
  isLoading?: boolean
}>()

const { t } = useTranslation()

const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="partners-card">
    <!-- Header - Always Visible -->
    <button class="partners-header" @click="toggleExpanded" :disabled="isLoading">
      <div class="header-icon">
        <Users :size="24" />
      </div>
      
      <div class="header-content">
        <h3 class="header-title">{{ t('partnersList.companyPartners') }}</h3>
        <p class="header-subtitle">
          {{ collection.totalCount }} 
          {{ collection.totalCount === 1 ? t('partnersList.partner') : t('partnersList.partners') }}
          • {{ collection.totalShareholding.toFixed(2) }}% {{ t('partnersList.allocated') }}
        </p>
      </div>

      <ChevronDown 
        :size="20" 
        class="expand-icon"
        :class="{ 'expanded': isExpanded }"
      />
    </button>

    <!-- Partners List - Expandable -->
    <Transition name="expand">
      <div v-if="isExpanded" class="partners-list">
        <div v-if="collection.totalCount === 0" class="empty-state">
          <p>{{ t('partnersList.noPartnersYet') }}</p>
        </div>
        
        <div v-else class="partners-grid">
          <PartnerListItem 
            v-for="partner in collection.partners" 
            :key="partner.id"
            :partner="partner"
          />
        </div>

        
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.partners-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
}

/* Header */
.partners-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
}

.partners-header:hover {
  background: var(--color-background-soft);
}

.partners-header:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border-radius: 0.75rem;
  color: white;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.25rem 0;
}

.header-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.expand-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Partners List */
.partners-list {
  padding: 0 1.5rem 1.5rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.partners-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Shareholding Summary */
.shareholding-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.summary-value.allocated {
  color: var(--color-primary-teal);
}

.summary-value.remaining {
  color: var(--color-warning);
}

.summary-value.remaining.complete {
  color: var(--color-primary-teal);
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
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

/* Tablet and up */
@media (min-width: 640px) {
  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }
}
</style>
