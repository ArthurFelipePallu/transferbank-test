<!-- <script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import FormInputField from './FormInputField.vue'
import { type OnboardingFormValues, onboardingSchema } from '@/domain/onboarding/onboarding.schema'
import BaseLucideIcon from '../BaseLucideIcon.vue';


const props = withDefaults(
    defineProps<{
        submitLabel?: string
    }>(),
    {
        submitLabel: 'Log in account',
    },
)

const emit = defineEmits<{
    submit: [values: OnboardingFormValues]
}>()

const validationSchema = toTypedSchema(onboardingSchema)

const { handleSubmit, meta } = useForm<OnboardingFormValues>({
    validationSchema,
    initialValues: {
        cnpj: '',
        companyName: '',
        fullName: '',
        cryptoCurrencies: [],
        phone: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    },
})






const submit = handleSubmit((values) => {
    emit('submit', values)
})
</script>

<template>
    <form class="form" @submit.prevent="submit">


        <FormInputField name="email" label="Email" type="email" placeholder="you@company.com" autocomplete="email">
            <template>
                <BaseLucideIcon name="Mail" :size="18" />
            </template>
        </FormInputField>
        <FormInputField name="password" label="Password" type="password" autocomplete="new-password"
            placeholder="******" />

        <button class="submit" type="submit" :disabled="!meta.valid">
            {{ props.submitLabel }}
        </button>

    </form>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.field-row {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.field-row>* {
    flex: 1 1 0;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.inline-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-main);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}



.password-strength {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.3rem;
}

.password-strength-bar {
    flex: 1;
    height: 0.35rem;
    border-radius: 999px;
    background: var(--color-surface-border);
    overflow: hidden;
}

.password-strength-bar-fill {
    height: 100%;
    width: 0;
    transition:
        width 0.2s ease,
        background 0.2s ease;
}

.strength-empty {
    background: transparent;
}

.strength-weak {
    background: var(--color-error);
}

.strength-medium {
    background: var(--color-warning);
}

.strength-strong {
    background: var(--color-primary-teal-light);
}

.password-strength-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    min-width: 4.5rem;
}

.password-hints {
    margin: 0.35rem 0 0;
    padding-left: 1.2rem;
    font-size: 0.72rem;
    color: var(--color-text-muted);
}

.password-hints li+li {
    margin-top: 0.1rem;
}

.error {
    font-size: 0.75rem;
    color: var(--color-error);
}

.submit {
    margin-top: 0.5rem;
    border-radius: 999px;
    border: none;
    padding: 0.85rem 1.2rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
    color: var(--color-white);
    box-shadow: var(--shadow-button-primary);
    transition:
        transform 0.08s ease,
        box-shadow 0.08s ease,
        opacity 0.15s ease;
    width: 100%;
}

.submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
}

.submit:not(:disabled):active {
    transform: translateY(1px);
    box-shadow: var(--shadow-button-primary-active);
}

.hint {
    margin-top: 0.6rem;
    font-size: 0.78rem;
    color: var(--color-text-muted);
    text-align: center;
}

@media (min-width: 720px) {
    .field-row {
        flex-direction: row;
    }
}
</style> -->
