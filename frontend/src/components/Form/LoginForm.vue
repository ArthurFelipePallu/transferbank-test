<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import FormInputField from './FormInputField.vue'
import { type OnboardingFormValues, onboardingSchema } from '@/domain/onboarding/onboarding.schema'
import BaseLucideIcon from '../BaseLucideIcon.vue';
import { RouterLink } from 'vue-router';

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

        <div class="field">
            <FormInputField name="email" label="Email" type="email" placeholder="you@company.com" autocomplete="email">
                <template #icon>
                    <BaseLucideIcon name="Mail" :size="18" />
                </template>
            </FormInputField>
        </div>

        <FormInputField name="password" label="Password" type="password" autocomplete="new-password"
            placeholder="******">
            <template #icon>
                <BaseLucideIcon name="KeyRound" :size="18" />
            </template>

        </FormInputField>

        <RouterLink class="forgot-password" :to="{ name: 'recover-password' }">Forgot Password?</RouterLink>
        <button class="submit" type="submit" :disabled="!meta.valid">
            {{ props.submitLabel }}
        </button>
    </form>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.forgot-password {
    text-align: end;
    font-size: 10px;
    font-weight: 600;
    text-decoration: none;
    color: var(--color-primary-teal);

    transition:
        color 0.2s ease,
        text-shadow 0.2s ease,
        transform 0.15s ease;
}

.forgot-password:hover {
    text-shadow: var(--shadow-input-focus);
    transform: translateY(-1px);
}

.forgot-password:active {
    transform: translateY(0);
    text-shadow: var(--shadow-button-primary);
}

.forgot-password:focus-visible {
    outline: 2px solid var(--color-primary-teal);
    outline-offset: 2px;
    border-radius: 4px;
}

.error {
    font-size: 0.75rem;
    color: var(--color-error);
}

.submit {
    margin-top: 0.5rem;
    border-radius: 0.5rem;
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
</style>
