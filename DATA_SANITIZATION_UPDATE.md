# Data Sanitization Update

## Problem
Form inputs for CNPJ, CPF, and phone numbers include formatting characters (dots, dashes, slashes, parentheses) to improve user experience. However, these formatted values were being sent directly to the backend, which expects clean numeric data.

## Solution
Created utility functions to sanitize formatted inputs before sending to the backend, while maintaining the formatted display for users.

## Changes Made

### 1. Created Formatters Utility (`frontend/src/utils/formatters.ts`)

#### Sanitization Functions (Remove Formatting)
- `sanitizeNumeric(value)` - Removes all non-numeric characters
- `sanitizeCnpj(cnpj)` - Cleans CNPJ: "12.345.678/0001-90" → "12345678000190"
- `sanitizeCpf(cpf)` - Cleans CPF: "123.456.789-01" → "12345678901"
- `sanitizePhone(phone)` - Cleans phone: "+55 (11) 99999-9999" → "5511999999999"

#### Formatting Functions (Add Formatting)
- `formatCnpj(cnpj)` - Formats CNPJ: "12345678000190" → "12.345.678/0001-90"
- `formatCpf(cpf)` - Formats CPF: "12345678901" → "123.456.789-01"
- `formatPhone(phone)` - Formats phone: "5511999999999" → "+55 (11) 99999-9999"

### 2. Updated Stores

#### `useOnboardingStore.ts`
- **Import**: Added `sanitizeCnpj` and `sanitizePhone` from formatters
- **submitOnboarding()**: Sanitizes CNPJ and phone before sending to backend
  ```typescript
  const registration: CompanyRegistration = {
    cnpj: sanitizeCnpj(cnpj),
    phone: sanitizePhone(phone),
    // ... other fields
  }
  ```

#### `usePartnerStore.ts`
- **Import**: Added `sanitizeCpf` from formatters
- **submitPartner()**: Sanitizes CPF before sending to backend
  ```typescript
  const sanitizedCpf = sanitizeCpf(formData.value.cpf!)
  const registration: PartnerRegistration = {
    cpf: sanitizedCpf,
    // ... other fields
  }
  ```

### 3. Updated Components

#### `CompanyCard.vue`
- **Import**: Added `formatCnpj` from formatters
- **Display**: Uses formatter for consistent CNPJ display
- **Removed**: Local `formatCnpj` function (now uses centralized utility)

## Data Flow

### Before (Incorrect)
```
User Input: "12.345.678/0001-90"
    ↓
Form: "12.345.678/0001-90"
    ↓
Store: "12.345.678/0001-90" ❌
    ↓
Backend: Receives formatted string (may cause validation errors)
```

### After (Correct)
```
User Input: "12.345.678/0001-90"
    ↓
Form: "12.345.678/0001-90" (formatted for display)
    ↓
Store: sanitizeCnpj() → "12345678000190" ✓
    ↓
Backend: Receives clean numeric string
```

## Benefits

1. **User Experience**: Users see formatted, easy-to-read values
2. **Data Integrity**: Backend receives clean, consistent data
3. **Validation**: Backend validation works correctly with numeric-only values
4. **Centralized Logic**: All formatting/sanitization in one place
5. **Reusability**: Formatters can be used anywhere in the app
6. **Type Safety**: TypeScript ensures correct usage

## Testing Checklist

- [x] CNPJ sanitization in company registration
- [x] Phone sanitization in company registration
- [x] CPF sanitization in partner registration
- [x] CNPJ formatting in company card display
- [ ] Test actual form submission with formatted inputs
- [ ] Verify backend receives clean data
- [ ] Test edge cases (empty values, partial inputs)

## Future Enhancements

1. **Input Masking**: Add real-time formatting as user types
2. **Validation**: Add format validation before sanitization
3. **International Support**: Handle different phone formats
4. **Error Messages**: Show format requirements in validation errors
5. **Unit Tests**: Add tests for all formatter functions

## Files Modified

- `frontend/src/utils/formatters.ts` (created)
- `frontend/src/stores/useOnboardingStore.ts`
- `frontend/src/stores/usePartnerStore.ts`
- `frontend/src/components/Company/CompanyCard.vue`

## Notes

- The forms themselves don't need changes - they continue to work with formatted values
- Sanitization happens at the store level, just before API calls
- Display components can use formatters for consistent presentation
- All formatters handle edge cases (empty strings, invalid formats)
