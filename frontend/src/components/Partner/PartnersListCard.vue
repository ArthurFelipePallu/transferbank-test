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
  <div class="card mb-4">
    <!-- Header - Always Visible -->
    <button 
      class="btn w-100 text-start d-flex align-items-center gap-3 p-4 border-0 rounded-0 partners-header" 
      @click="toggleExpanded" 
      :disabled="isLoading"
    >
      <div class="d-flex align-items-center justify-content-center flex-shrink-0 header-icon">
        <Users :size="24" />
      </div>
      
      <div class="flex-grow-1 min-w-0">
        <h3 class="h5 fw-semibold mb-1">{{ t('partner.companyPartners') }}</h3>
        <p class="small text-muted mb-0">
          {{ collection.totalCount }} 
          {{ collection.totalCount === 1 ? t('partner.partner') : t('partner.partners') }}
          • {{ collection.totalShareholding.toFixed(2) }}% {{ t('partner.allocated') }}
        </p>
      </div>

      <ChevronDown 
        :size="20" 
        class="flex-shrink-0 text-muted expand-icon"
        :class="{ 'expanded': isExpanded }"
      />
    </button>

    <!-- Partners List - Expandable -->
    <Transition name="expand">
      <div v-if="isExpanded" class="card-body pt-0 px-4 pb-4">
        <div v-if="collection.totalCount === 0" class="text-center py-5">
          <p class="text-muted mb-0">{{ t('partner.noPartnersYet') }}</p>
        </div>
        
        <div v-else class="d-flex flex-column gap-3">
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
.partners-header {
  background: transparent;
  transition: background-color 0.2s ease;
}

.partners-header:hover:not(:disabled) {
  background: var(--bs-light);
}

.partners-header:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border-radius: 0.75rem;
  color: white;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
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
</style>
