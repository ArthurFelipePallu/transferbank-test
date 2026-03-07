<script setup lang="ts">
import type { CryptoCurrencyEnum } from '@/api/backendApi';
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface';


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
    <button type="button" class="chip" :class="{ 'chip--active': props.isActive }" @click="handleButtonClick()">
        {{ props.currencyModel.alias }}
    </button>
</template>

<style scoped>
.chip {
    padding: 0.55rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--color-chip-border);
    background: var(--color-chip-bg);
    color: var(--color-text-main);
    font-size: 0.85rem;
    cursor: pointer;
    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease,
        transform 0.05s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.chip--active {
    background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
    border-color: transparent;
    color: var(--color-white);
    transform: translateY(-1px);
}

.chip:focus-visible {
    outline: 2px solid var(--color-primary-teal-alt);
    outline-offset: 2px;
}

@media (min-width: 640px) {
    .chip {
        padding: 0.4rem 0.9rem;
        font-size: 0.8rem;
        min-height: auto;
    }
}
</style>