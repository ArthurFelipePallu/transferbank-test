<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import FormInputField from './FormInputField.vue'
import { loginSchema, type LoginFormValues } from '@/domain/onboarding/login.schema'
import BaseLucideIcon from '../BaseLucideIcon.vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTranslation } from '@/composables/useTranslation'

const props = withDefaults(
    defineProps<{
        submitLabel?: string
    }>(),
    {
        submitLabel: undefined,
    },
)

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { t } = useTranslation()

const { handleSubmit, meta } = useForm<LoginFormValues>({
    validationSchema: loginSchema,
    initialValues: {
        email: '',
        password: '',
    },
})

const submit = handleSubmit(async (values) => {
    try {
        uiStore.startLoading('Signing in...')
        
        const success = await authStore.login(values.email, values.password)
        
        if (success) {
            uiStore.showSuccess('Welcome back!')
            // Check if there's a redirect query parameter
            const redirect = router.currentRoute.value.query.redirect as string
            router.push(redirect || { name: 'dashboard' })
        } else {
            uiStore.showError(authStore.error || 'Login failed')
        }
    } catch (error) {
        console.error('Login error:', error)
        uiStore.showError('An unexpected error occurred. Please try again.')
    } finally {
        uiStore.stopLoading()
    }
})
</script>

<template>
    <form class="form" @submit.prevent="submit">

        <div class="field">
            <FormInputField name="email" :label="t('login.email')" type="email" placeholder="you@company.com" autocomplete="email">
                <template #icon>
                    <BaseLucideIcon name="Mail" :size="18" />
                </template>
            </FormInputField>
        </div>

        <FormInputField name="password" :label="t('login.password')" type="password" autocomplete="new-password"
            placeholder="******">
            <template #icon>
                <BaseLucideIcon name="KeyRound" :size="18" />
            </template>

        </FormInputField>

        <RouterLink class="forgot-password" :to="{ name: 'recover-password' }">{{ t('login.forgotPassword') }}</RouterLink>
        <button class="submit" type="submit" :disabled="!meta.valid">
            {{ props.submitLabel || t('login.submit') }}
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
    border-radius: 0.75rem;
    border: none;
    padding: 1rem 1.2rem;
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
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
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
    line-height: 1.5;
}

@media (min-width: 640px) {
    .field-row {
        flex-direction: row;
    }
}
</style>
