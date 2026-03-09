# Form Data Caching Implementation

## Overview
Implemented automatic form data caching using Pinia persistence plugin to preserve user input across page refreshes. Follows DDD and SOLID principles with separation of concerns.

## Architecture

### 1. Persistence Plugin (Infrastructure Layer)
**File**: `frontend/src/stores/plugins/persistencePlugin.ts`

- Pinia plugin that automatically persists store state to localStorage
- Configuration-based approach for flexibility
- Supports selective path persistence (only cache specific fields)
- Provides lifecycle hooks (beforeRestore, afterRestore)

**Configuration**:
```typescript
const PERSISTENCE_CONFIG = {
  onboarding: {
    key: 'onboarding_form_cache',
    paths: ['companyData'],
  },
  partner: {
    key: 'partner_form_cache',
    paths: ['formData', 'currentStep', 'steps'],
  },
}
```

### 2. Store Updates (Application Layer)

#### Onboarding Store
- Added `clearFormCache()` method to remove cached data AND reset state
- Automatically clears cache after successful submission
- Clears cache on manual reset
- Restores cached `companyData` on page refresh
- Clears cache when returning to form after successful registration

#### Partner Store
- Added `clearFormCache()` method to remove cache AND reset state
- Automatically clears cache and resets form after successful partner registration
- Clears cache on form reset
- Restores cached `formData`, `currentStep`, and `steps` on page refresh

### 3. Form Integration (Presentation Layer)

#### OnboardingForm
- Reads cached data from `onboardingStore.companyData` on mount
- Populates form fields with cached values
- Password fields intentionally NOT cached for security

#### OnboardingView
- Clears cache on mount if user is returning after successful registration
- Ensures fresh form for new registrations

#### PartnerRegistrationView
- Already passes `formData` from store to step components
- Each step component receives cached data via `initialValues` prop
- Multi-step progress is preserved (current step and completed steps)
- Automatically resets after successful submission

## How It Works

### On Page Load
1. Pinia plugin reads from localStorage
2. Restores cached state to stores
3. Forms read initial values from stores
4. User sees their previously entered data

### During Form Interaction
1. User types in form fields
2. VeeValidate updates form state
3. On step navigation, data is saved to store
4. Pinia plugin automatically persists to localStorage

### On Successful Submission
1. Form submits to backend
2. Store calls `clearFormCache()`
3. localStorage cache is removed
4. Store state is reset to empty
5. User starts fresh on next visit

### On Page Refresh (During Form Fill)
1. Plugin restores cached data
2. Forms populate with cached values
3. User continues where they left off

### On Returning After Success
1. OnboardingView checks if registration was completed
2. Calls `clearFormCache()` to ensure clean form
3. User sees empty form for new registration

## Security Considerations

- Password fields are NOT cached
- Sensitive data (passwords) must be re-entered after refresh
- Cache is cleared after successful submission
- Cache is cleared when returning to form after success
- Cache keys are namespaced to prevent conflicts

## Benefits

✅ **User Experience**: No data loss on accidental refresh
✅ **Clean State**: Fresh form after successful submission
✅ **DDD Compliance**: Clear separation of concerns
✅ **SOLID Principles**: Single responsibility, open/closed
✅ **Maintainability**: Configuration-based, easy to extend
✅ **Type Safety**: Full TypeScript support
✅ **Automatic**: No manual localStorage calls in components

## Files Modified

1. `frontend/src/stores/plugins/persistencePlugin.ts` - Created
2. `frontend/src/main.ts` - Registered plugin
3. `frontend/src/stores/useOnboardingStore.ts` - Added clearFormCache() with state reset
4. `frontend/src/stores/usePartnerStore.ts` - Added clearFormCache() with state reset
5. `frontend/src/components/Form/OnboardingForm.vue` - Reads cached data
6. `frontend/src/views/OnboardingView.vue` - Clears cache on mount if completed

## Testing

To test the caching:

### Onboarding Form
1. Fill out onboarding form partially
2. Refresh the page (F5)
3. Verify form fields are populated with previous values
4. Complete and submit the form
5. Navigate back to /sign-up - form should be empty (cache cleared)
6. Fill form partially again
7. Refresh - data should be preserved

### Partner Registration
1. Fill out partner form partially (step 1 or 2)
2. Refresh the page (F5)
3. Verify you're on the same step with same data
4. Complete and submit the form
5. Form should automatically reset to step 1 with empty fields
6. Fill form partially again
7. Refresh - data should be preserved
