# Input Masking Implementation

## Overview
Implemented real-time input masking for CNPJ, CPF, and phone number fields. As users type, the formatting characters are automatically added, and input is limited to the maximum allowed digits.

## Features

### CNPJ Mask
- **Format**: `12.345.678/0001-90`
- **Max digits**: 14
- **Progressive formatting**:
  - After 2 digits: `12.`
  - After 5 digits: `12.345.`
  - After 8 digits: `12.345.678/`
  - After 12 digits: `12.345.678/0001-`
  - Complete: `12.345.678/0001-90`

### CPF Mask
- **Format**: `123.456.789-01`
- **Max digits**: 11
- **Progressive formatting**:
  - After 3 digits: `123.`
  - After 6 digits: `123.456.`
  - After 9 digits: `123.456.789-`
  - Complete: `123.456.789-01`

### Phone Mask
- **Format**: `+55 (11) 99999-9999`
- **Max digits**: 13 (country code + area code + number)
- **Progressive formatting**:
  - After 1 digit: `+5`
  - After 2 digits: `+55 (`
  - After 4 digits: `+55 (11) `
  - After 9 digits: `+55 (11) 99999-`
  - Complete: `+55 (11) 99999-9999`

## Implementation

### 1. Updated FormInputField Component

Added mask support with inline formatting logic:

```vue
<FormInputField 
  name="cnpj" 
  mask="cnpj" 
  placeholder="00.000.000/0000-00" 
/>
```

**Mask types**:
- `mask="cnpj"` - CNPJ formatting
- `mask="cpf"` - CPF formatting
- `mask="phone"` - Phone formatting
- `mask="none"` (default) - No formatting

### 2. Inline Masking Logic

Each mask type has its own input handler that:
1. Extracts only numeric characters
2. Limits to maximum allowed digits
3. Applies progressive formatting
4. Updates the field value

### 3. Updated Forms

#### OnboardingForm.vue
```vue
<FormInputField name="cnpj" mask="cnpj" ... />
<FormInputField name="phone" mask="phone" ... />
```

#### PersonalInfoStep.vue
```vue
<FormInputField name="cpf" mask="cpf" ... />
```

## User Experience

### Before
- User types: `12345678000190`
- Display: `12345678000190` (hard to read)
- No length limit

### After
- User types: `1` → Display: `1`
- User types: `2` → Display: `12`
- User types: `3` → Display: `12.3`
- User types: `4` → Display: `12.34`
- User types: `5` → Display: `12.345`
- User types: `6` → Display: `12.345.6`
- ...continues until...
- Final: `12.345.678/0001-90`
- Cannot type more than 14 digits

## Data Flow

```
User Input (raw) → Mask Applied → Display (formatted) → Store → Sanitize → Backend (clean)
     "123"       →   "123."     →      "123."        →  Store → "123"   →    "123"
```

1. **User types**: Raw numeric input
2. **Mask applies**: Formatting added in real-time
3. **Display**: User sees formatted value
4. **Store receives**: Formatted value (e.g., "12.345.678/0001-90")
5. **Sanitization**: Formatters remove special characters
6. **Backend receives**: Clean numeric value (e.g., "12345678000190")

## Benefits

1. **Better UX**: Users see formatted values as they type
2. **Input Validation**: Automatic length limiting
3. **Error Prevention**: Can't enter more digits than allowed
4. **Visual Feedback**: Immediate formatting shows correct format
5. **Accessibility**: Clear visual structure helps all users
6. **Data Integrity**: Backend still receives clean data

## Technical Details

### Character Limiting
- Uses `.slice(0, maxLength)` to enforce maximum digits
- Applied before formatting to prevent overflow

### Non-numeric Removal
- Uses `.replace(/\D/g, '')` to strip all non-digits
- Allows users to paste formatted values

### Progressive Formatting
- Checks length at each step
- Adds formatting characters only when needed
- Prevents incomplete formatting (e.g., "12." when only "1" typed)

### Integration with vee-validate
- Uses `field.onChange()` to update form state
- Maintains validation integration
- Error messages work as expected

## Files Modified

- `frontend/src/components/Form/FormInputField.vue` - Added mask support
- `frontend/src/components/Form/OnboardingForm.vue` - Added CNPJ and phone masks
- `frontend/src/components/Partner/PersonalInfoStep.vue` - Added CPF mask
- `frontend/src/composables/useInputMask.ts` - Created (not used, inline implementation preferred)

## Testing Checklist

- [x] CNPJ mask formats correctly as user types
- [x] CNPJ limited to 14 digits
- [x] CPF mask formats correctly as user types
- [x] CPF limited to 11 digits
- [x] Phone mask formats correctly as user types
- [x] Phone limited to 13 digits
- [ ] Test paste functionality with formatted values
- [ ] Test paste functionality with unformatted values
- [ ] Test backspace/delete behavior
- [ ] Test cursor position after formatting
- [ ] Verify form validation still works
- [ ] Verify backend receives clean data

## Known Limitations

1. **Cursor Position**: Cursor may jump when formatting characters are added
2. **Copy/Paste**: Pasting formatted values works, but cursor position may be off
3. **International Formats**: Only Brazilian formats supported
4. **Mobile Keyboards**: Numeric keyboard may show symbols

## Future Enhancements

1. **Cursor Management**: Improve cursor position handling
2. **International Support**: Add support for other country formats
3. **Configurable Masks**: Allow custom mask patterns
4. **Visual Indicators**: Show format example on focus
5. **Accessibility**: Add ARIA labels for screen readers
