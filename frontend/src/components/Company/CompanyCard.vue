<template>
  <div class="company-card" @click="$emit('click')">
    <!-- Fantasy Name (Top) -->
    <div class="card-header">
      <h3 class="fantasy-name">{{ displayName }}</h3>
    </div>

    <div class="card-body">
      <!-- CNPJ -->
      <div class="info-row">
        <span class="label">{{ t('companyCard.cnpj') }}</span>
        <span class="value">{{ formattedCnpj }}</span>
      </div>

      <!-- Cryptocurrencies -->
      <div class="info-row">
        <span class="label">{{ t('companyCard.cryptocurrencies') }}</span>
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

      <!-- Partner Count -->
      <div class="info-row">
        <span class="label">{{ t('companyCard.partners') }}</span>
        <span class="value partner-value">
          {{ partnerCount }} {{ partnerLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyListItem } from '@/domain/company/interfaces/companyInterface'
import { formatCnpj } from '@/utils/formatters'
import { useTranslation } from '@/composables/useTranslation'

interface Props {
  company: CompanyListItem
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

const { t } = useTranslation()

const displayName = computed(() => props.company.fantasyName || props.company.companyName || t('companyCard.unnamedCompany'))

const partnerCount = computed(() => props.company.partnerCount || 0)

const formattedCnpj = computed(() => formatCnpj(props.company.cnpj))

const partnerLabel = computed(() => {
  return partnerCount.value === 1 ? t('companyCard.partner') : t('companyCard.partners')
})

const formatCrypto = (crypto: string): string => {
  const cryptoNames: Record<string, string> = {
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Tether: 'USDT',
    USD_Coin: 'USDC',
    BinanceCoin: 'BNB',
    XRP: 'XRP',
    Cardano: 'ADA',
    Solana: 'SOL',
    Dogecoin: 'DOGE'
  }
  return cryptoNames[crypto] || crypto
}
</script>

<style scoped>
.company-card {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.company-card:hover {
  border-color: var(--color-primary-teal);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card-header {
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
}

.fantasy-name {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
  line-height: 1.3;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 1rem;
  color: var(--color-text);
  font-weight: 500;
  word-break: break-word;
}

.partner-value {
  color: var(--color-primary-teal);
  font-weight: 600;
}

.crypto-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.crypto-badge {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 4px rgba(28, 156, 140, 0.2);
}

@media (max-width: 640px) {
  .company-card {
    padding: 1.25rem;
  }

  .fantasy-name {
    font-size: 1.25rem;
  }

  .value {
    font-size: 0.9375rem;
  }
}
</style>
