<template>
  <div class="card h-100 company-card" @click="$emit('click')">
    <div class="card-header border-bottom-2 pb-3">
      <h3 class="h5 fw-bold mb-0">{{ displayName }}</h3>
    </div>

    <div class="card-body d-flex flex-column gap-3">
      <div class="info-row">
        <span class="text-uppercase small fw-semibold text-muted d-block mb-1">{{ t('company.cnpj') }}</span>
        <span class="fw-medium">{{ formattedCnpj }}</span>
      </div>

      <div class="info-row">
        <span class="text-uppercase small fw-semibold text-muted d-block mb-1">{{ t('company.cryptocurrencies') }}</span>
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="crypto in company.cryptoCurrencies"
            :key="crypto"
            class="badge rounded-pill crypto-badge"
          >
            {{ formatAlias(crypto) }}
          </span>
        </div>
      </div>

      <div class="info-row">
        <span class="text-uppercase small fw-semibold text-muted d-block mb-1">{{ t('company.partners') }}</span>
        <span class="fw-semibold partner-count">
          {{ partnerCount }} {{ partnerLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { CompanyListItem } from '@/domain/company/interfaces/companyInterface'
import { formatCnpj } from '@/utils/formatters'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { useCryptoCurrencies } from '@/composables/domain/useCryptoCurrencies'

interface Props {
  company: CompanyListItem
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

const { t } = useTranslation()
const { loadCurrencies, formatAlias } = useCryptoCurrencies()

onMounted(loadCurrencies)

const displayName = computed(() => props.company.fantasyName || props.company.companyName || t('company.unnamedCompany'))
const partnerCount = computed(() => props.company.partnerCount || 0)
const formattedCnpj = computed(() => formatCnpj(props.company.cnpj))
const partnerLabel = computed(() => partnerCount.value === 1 ? t('company.partner') : t('company.partners'))
</script>

<style scoped>
.company-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid var(--bs-border-color);
  box-shadow: 0 2px 4px var(--color-black-alpha-10);
}

.company-card:hover {
  border-color: var(--color-primary-teal);
  box-shadow: 0 8px 16px var(--color-black-alpha-10);
  transform: translateY(-4px);
}

.card-header {
  border-bottom-width: 2px !important;
}

.crypto-badge {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px var(--color-teal-alpha-20);
}

.partner-count {
  color: var(--color-primary-teal);
}

@media (max-width: 640px) {
  .card-body {
    padding: 1rem;
  }
}
</style>
