<script setup lang="ts">
import type { CryptoCurrencyEnum } from '@/api/backendApi';
import type { CryptoCurrencyOption } from '@/domain/currency/interfaces/currencyInterface';


const props = defineProps<{
    isActive: boolean,
    currencyModel: CryptoCurrencyOption

}>()
const emit = defineEmits<{
    (e: 'clicked', currency: CryptoCurrencyEnum): void
}>()

function handleButtonClick() {
    emit('clicked', props.currencyModel.currency)
}

</script>



<template>
    <button 
        type="button" 
        class="btn btn-sm rounded-pill crypto-chip" 
        :class="{ 'active': props.isActive }" 
        @click="handleButtonClick()"
    >
        {{ props.currencyModel.alias }}
    </button>
</template>

<style scoped>
.crypto-chip {
    padding: 0.55rem 1rem;
    border: 1px solid var(--bs-border-color);
    background: var(--bs-light);
    color: var(--bs-body-color);
    font-size: 0.85rem;
    transition: all 0.15s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px;
}

.crypto-chip.active {
    background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
    border-color: transparent;
    color: white;
    transform: translateY(-1px);
}

.crypto-chip:hover:not(.active) {
    background: var(--bs-secondary-bg);
    border-color: var(--color-primary-teal);
}

@media (min-width: 640px) {
    .crypto-chip {
        padding: 0.4rem 0.9rem;
        font-size: 0.8rem;
        min-height: auto;
    }
}
</style>