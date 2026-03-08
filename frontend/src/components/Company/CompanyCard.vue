<template>
  <div class="company-card" @click="$emit('click')">
    <div class="card-header">
      <h3 class="company-name">{{ company.companyName }}</h3>
      <span class="partner-count">{{ partnerCount }} {{ partnerCount === 1 ? 'Partner' : 'Partners' }}</span>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">Full Name:</span>
        <span class="value">{{ company.fullName }}</span>
      </div>

      <div class="info-row">
        <span class="label">CNPJ:</span>
        <span class="value">{{ formatCnpj(company.cnpj) }}</span>
      </div>

      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">{{ company.email }}</span>
      </div>

      <div class="info-row">
        <span class="label">Cryptocurrencies:</span>
        <div class="crypto-badges">
          <span
            v-for="crypto in company.cryptoCurrencies"
            :key="crypto"
            class="crypto-badge"
          >
            {{ formatCrypto(crypto) }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <span class="created-date">Created {{ formatDate(company.createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyListItem } from '@/domain/company/interfaces/companyInterface'

interface Props {
  company: CompanyListItem
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

const partnerCount = computed(() => props.company.partnerCount || 0)

const formatCnpj = (cnpj: string): string => {
  if (!cnpj) return ''
  // Format: 12.345.678/0001-90
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

const formatCrypto = (crypto: string): string => {
  const cryptoNames: Record<string, string> = {
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Litecoin: 'LTC',
    Ripple: 'XRP',
    Cardano: 'ADA',
    Polkadot: 'DOT',
    Solana: 'SOL',
    Dogecoin: 'DOGE'
  }
  return cryptoNames[crypto] || crypto
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return date.toLocaleDateString()
}
</script>

<style scoped>
.company-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.company-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.company-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
  flex: 1;
}

.partner-count {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 0.9375rem;
  color: var(--color-text);
  word-break: break-word;
}

.crypto-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.crypto-badge {
  background: var(--color-background-soft);
  color: var(--color-text);
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
}

.card-footer {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.created-date {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .company-card {
    padding: 1.25rem;
  }

  .company-name {
    font-size: 1.125rem;
  }

  .card-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .partner-count {
    align-self: flex-start;
  }
}
</style>
