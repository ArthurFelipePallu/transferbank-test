# International Phone Input Feature

## Overview
Implemented international phone input with country selector dropdown using `vue3-country-intl` library. The component allows users to select their country from a dropdown, which automatically sets the correct area code (dial code) for phone number input.

## Implementation Details

### Component: PhoneInputField.vue
**Location**: `frontend/src/components/Form/PhoneInputField.vue`

**Features**:
- Country flag button INSIDE the phone input field on the LEFT (shows only flag, no text)
- Clicking flag opens dropdown with:
  - Country flag
  - Country name
  - Area code (dial code)
- Area code displayed next to flag (locked, non-editable, gray text)
- Phone number input takes remaining space on the RIGHT
- Area code only changeable by selecting different country in dropdown
- Single unified input field appearance with internal sections
- Integrated with vee-validate for form validation
- Bootstrap 5 styling with TransferBank color scheme

**Visual Layout**:
```
┌─────────────────────────────────────────┐
│ 🇧🇷 │ +55 │ (11) 99999-9999          │
│ flag  code   phone number input        │
└─────────────────────────────────────────┘
```

### Architecture

#### Domain Layer
- `BrazilianState.ts` - Entity for Brazilian states with DDD mapping (created for potential future feature)
- Contains state codes, names, area codes, flags, and regions
- Provides utility functions: `getStateByDDD()`, `extractDDD()`, `isValidDDD()`

#### Presentation Layer
- `PhoneInputField.vue` - Main component with country selector
- `usePhoneState.ts` - Composable for Brazilian state detection (not currently used, available for future enhancement)

### Component Props
```typescript
interface Props {
  name: string           // Field name for vee-validate
  label: string          // Label text
  placeholder?: string   // Placeholder for phone input
  defaultCountry?: string // Default country ISO code (default: 'BR')
}
```

### Data Flow
1. User clicks country flag button (inside input field on left)
2. Dropdown opens with searchable country list
3. User selects country
4. `handleCountryChange()` updates `currentDialCode`
5. Area code displayed next to flag (gray text, non-editable)
6. Phone number stored as: `{dialCode} {phoneNumber}` (e.g., "+55 11999999999")
7. Display shows only phone number without dial code in input field

### Styling
- Unified input wrapper: Single border with focus state
- Flag button: Transparent background, hover effect, shows only flag emoji/icon
- Area code display: Gray text, separated by subtle border
- Phone input: Borderless, takes remaining space
- Focus state: Teal border and shadow on entire wrapper
- Dropdown: Custom styled with TransferBank colors
  - Hover: Light gray background
  - Selected: Teal background (rgba(28, 156, 140, 0.1))
  - Search box: Sticky at top with light background
- Mobile responsive: Adjusted spacing and font sizes

### Integration
Used in `ContactInfoSection.vue`:
```vue
<PhoneInputField 
  name="phone" 
  :label="t('onboardingForm.phone')" 
  placeholder="(11) 99999-9999" 
/>
```

## Library: vue3-country-intl

**Version**: ^2.0.11

**Features Used**:
- Country selection with flags
- Dial code display
- Search functionality
- Phone type mode

**Type Definitions**: Created custom type declarations at `frontend/src/types/vue3-country-intl.d.ts`

## Future Enhancements

### Brazilian State Detection (Already Implemented, Not Used)
The domain layer includes Brazilian state detection from DDD (area codes):
- `BrazilianState` entity with all 27 states
- DDD to state mapping
- State flags (emojis representing each state)
- `usePhoneState` composable

**Potential Use Cases**:
1. Show Brazilian state flag next to phone input when Brazil is selected
2. Validate DDD for Brazilian phone numbers
3. Auto-suggest state based on area code
4. Display state name for better UX

**Example Usage** (if enabled):
```vue
<script setup>
import { usePhoneState } from '@/composables/usePhoneState'
import { ref } from 'vue'

const phone = ref('')
const { stateFlag, stateName, stateCode } = usePhoneState(phone)
</script>

<template>
  <div>
    <PhoneInputField v-model="phone" />
    <span v-if="stateFlag">{{ stateFlag }} {{ stateName }}</span>
  </div>
</template>
```

## Testing Checklist

- [x] Component renders without errors
- [x] TypeScript compilation successful
- [x] Hot module replacement working
- [x] No diagnostic errors
- [x] Phone validation updated for international format
- [x] Type declarations created for vue3-country-intl
- [ ] Country selector opens dropdown on click (needs manual browser testing)
- [ ] Search functionality works in dropdown (needs manual browser testing)
- [ ] Selecting country updates dial code (needs manual browser testing)
- [ ] Dial code is locked (non-editable) (needs manual browser testing)
- [ ] Phone number input accepts numbers (needs manual browser testing)
- [ ] Form validation works correctly (needs manual browser testing)
- [ ] Value stored in correct format: "+XX XXXXXXXXX" (needs manual browser testing)
- [ ] Works on mobile devices (needs manual browser testing)
- [ ] Responsive design (mobile-first) (needs manual browser testing)
- [ ] Accessibility (keyboard navigation, screen readers) (needs manual browser testing)

## Files Modified/Created

### Created:
- `frontend/src/components/Form/PhoneInputField.vue`
- `frontend/src/types/vue3-country-intl.d.ts`
- `frontend/src/domain/phone/entities/BrazilianState.ts`
- `frontend/src/composables/usePhoneState.ts`
- `INTERNATIONAL_PHONE_INPUT_FEATURE.md`

### Modified:
- `frontend/src/components/Form/Onboarding/ContactInfoSection.vue`

### Dependencies Added:
- `vue3-country-intl: ^2.0.11` (already in package.json)

## Notes

1. The area code is stored WITH the phone number in the format: `+XX XXXXXXXXX`
2. The input field only shows the phone number part (without dial code)
3. The dial code is displayed separately in a locked input-group-text element
4. Brazilian state detection is implemented but not currently active (can be enabled later)
5. Component follows DDD and SOLID principles with clear separation of concerns
6. Bootstrap 5 styling throughout with custom TransferBank theme

## Known Issues

None currently. Component compiles and hot-reloads successfully.

## Next Steps

1. Manual testing in browser
2. Test country selection and dial code updates
3. Test form submission with phone validation
4. Consider enabling Brazilian state detection feature
5. Add unit tests for component
6. Test accessibility features
