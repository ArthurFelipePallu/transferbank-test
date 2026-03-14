# CNPJ Lookup Improvements

## Summary
Enhanced the CNPJ lookup functionality with color-coded user feedback and testing capabilities.

## Changes Made

### 1. Test CNPJ Support
**File:** `frontend/src/composables/useCnpjLookup.ts`

Added a helper function to detect test CNPJs (all digits are the same):
```typescript
function isTestCnpj(cnpj: string): boolean {
  const sanitized = cnpj.replace(/\D/g, '')
  if (sanitized.length !== 14) return false
  
  const firstDigit = sanitized[0]
  return sanitized.split('').every(digit => digit === firstDigit)
}
```

**Behavior:**
- CNPJs like `11.111.111/1111-11`, `22.222.222/2222-22`, etc. are considered test CNPJs
- API lookup is skipped for test CNPJs
- Shows **orange warning** message: "⚠️ Test CNPJ detected. This is for testing purposes only."
- Form validation still works normally
- Users can manually fill in company details

**Why:** Allows testing the form without making API calls or needing real CNPJs.

### 2. CNPJ Not Found Message (RED)
**File:** `frontend/src/components/Form/Onboarding/CompanyInfoSection.vue`

Added visual feedback when CNPJ is not found in the database:
- Shows a **red error** message below the CNPJ field
- Message appears in the FormInputField's `#below` slot
- Uses danger/red color (❌) to indicate the error
- Message: "❌ CNPJ not found in the database. Please verify the number."
- Message is cleared when CNPJ changes

### 3. Test CNPJ Warning (ORANGE)
Shows an **orange warning** message for test CNPJs:
- Uses warning/orange color (⚠️)
- Message: "⚠️ Test CNPJ detected. This is for testing purposes only."
- Indicates the CNPJ is accepted but only for testing

**UI States:**
1. **Searching:** Shows "Searching..." with pulsing animation (blue)
2. **Test CNPJ:** Shows "⚠️ Test CNPJ detected..." (orange/warning)
3. **Not Found:** Shows "❌ CNPJ not found..." (red/danger)
4. **Found:** Auto-fills company data (no message)
5. **Status Error:** Shows error alert (inactive company)

### 4. Translation Support
**Files:** 
- `frontend/src/infrastructure/i18n/translations/en.ts`
- `frontend/src/infrastructure/i18n/translations/pt-BR.ts`

Added new translation keys:
```typescript
// English
cnpjNotFound: 'CNPJ not found in the database. Please verify the number.'
testCnpjWarning: 'Test CNPJ detected. This is for testing purposes only.'

// Portuguese
cnpjNotFound: 'CNPJ não encontrado na base de dados. Por favor, verifique o número.'
testCnpjWarning: 'CNPJ de teste detectado. Apenas para fins de teste.'
```

## User Experience Flow

### Scenario 1: Valid CNPJ
1. User enters CNPJ: `12.345.678/0001-90`
2. Shows "Searching..." indicator (blue)
3. Company data auto-fills
4. No message shown
5. User continues with form

### Scenario 2: CNPJ Not Found (RED)
1. User enters CNPJ: `99.999.999/9999-99`
2. Shows "Searching..." indicator (blue)
3. Shows **red error**: "❌ CNPJ not found in the database..."
4. User can manually fill company details
5. Form validation still works

### Scenario 3: Test CNPJ (ORANGE)
1. User enters CNPJ: `11.111.111/1111-11`
2. API lookup is skipped (no "Searching..." indicator)
3. Shows **orange warning**: "⚠️ Test CNPJ detected..."
4. User manually fills company details
5. Form validation works normally

### Scenario 4: Inactive Company
1. User enters CNPJ of inactive company
2. Shows "Searching..." indicator (blue)
3. Shows error alert with status explanation
4. Form submission is blocked
5. User must use a different CNPJ

## Color Coding

| State | Color | Icon | Message |
|-------|-------|------|---------|
| Searching | Blue (Primary) | - | "Searching..." |
| Test CNPJ | Orange (Warning) | ⚠️ | "Test CNPJ detected..." |
| Not Found | Red (Danger) | ❌ | "CNPJ not found..." |
| Found | - | - | (Auto-fills data) |
| Inactive | Red (Danger) | - | Status error alert |

## Testing

### Test CNPJs (All Same Digits - Shows Orange Warning):
- `00.000.000/0000-00`
- `11.111.111/1111-11`
- `22.222.222/2222-22`
- `33.333.333/3333-33`
- `44.444.444/4444-44`
- `55.555.555/5555-55`
- `66.666.666/6666-66`
- `77.777.777/7777-77`
- `88.888.888/8888-88`
- `99.999.999/9999-99`

### Real CNPJ Testing:
Use the CNPJ.ws API with real CNPJs to test:
- Valid active companies (auto-fill works, no message)
- Invalid CNPJs (shows red "not found" message)
- Inactive companies (shows status error alert)

## Benefits

1. **Clear Visual Feedback:** Color-coded messages (red for errors, orange for warnings)
2. **Better UX:** Users immediately understand the CNPJ status
3. **Testing Support:** Developers can test without real CNPJs
4. **Flexibility:** Users can proceed even if CNPJ is not found
5. **Clarity:** Clear distinction between "not found", "test", and "inactive"
6. **Bilingual:** Works in both English and Portuguese
7. **Accessibility:** Uses both color and icons for better accessibility

## Technical Details

- Uses FormInputField's `#below` slot for messages
- Reactive state management with Vue refs
- Proper cleanup when CNPJ changes
- No breaking changes to existing functionality
- Maintains DDD/SOLID principles
- Uses Bootstrap color variables (--bs-danger, --bs-warning)
