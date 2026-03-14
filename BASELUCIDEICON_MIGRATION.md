# BaseLucideIcon Migration

## Overview

Migrated `PriceChangeIndicator` and `InfoTooltip` components to use the centralized `BaseLucideIcon` component instead of importing icons directly from `lucide-vue-next`.

---

## Benefits

### 1. Centralized Icon Management ✅

All icons are now managed in one place (`LucideIconMap.ts`), making it easier to:
- Add new icons
- Update icon versions
- Track which icons are used
- Maintain consistency

### 2. Type Safety ✅

The `IconName` type ensures only registered icons can be used:

```typescript
// ✅ Valid - icon is registered
<BaseLucideIcon name="TrendingUp" :size="16" />

// ❌ Invalid - TypeScript error
<BaseLucideIcon name="NonExistentIcon" :size="16" />
```

### 3. Consistent API ✅

All components use the same icon API:

```vue
<BaseLucideIcon 
  name="IconName" 
  :size="20" 
  :stroke_width="2" 
/>
```

### 4. Easier Refactoring ✅

If we need to change icon library or customize icons, we only update one file.

---

## Changes Made

### 1. Updated LucideIconMap.ts

Added new icons required by the components:

```typescript
import {
  // ... existing imports
  Info,        // For InfoTooltip
  Minus,       // For PriceChangeIndicator (neutral)
  TrendingDown,// For PriceChangeIndicator (down)
  TrendingUp,  // For PriceChangeIndicator (up)
} from 'lucide-vue-next'

export const iconMap = {
  // ... existing icons
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
} as const
```

### 2. Updated PriceChangeIndicator.vue

**Before:**
```vue
<script setup>
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
</script>

<template>
  <TrendingUp v-if="direction === 'up'" :size="iconSize" />
  <TrendingDown v-if="direction === 'down'" :size="iconSize" />
  <Minus v-if="direction === 'neutral'" :size="iconSize" />
</template>
```

**After:**
```vue
<script setup>
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { IconName } from '@/utils/LucideIconMap'

const iconName = computed<IconName>(() => {
  if (direction.value === 'up') return 'TrendingUp'
  if (direction.value === 'down') return 'TrendingDown'
  return 'Minus'
})
</script>

<template>
  <BaseLucideIcon :name="iconName" :size="iconSize" />
</template>
```

### 3. Updated InfoTooltip.vue

**Before:**
```vue
<script setup>
import { Info } from 'lucide-vue-next'
</script>

<template>
  <Info :size="iconSize" />
</template>
```

**After:**
```vue
<script setup>
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
</script>

<template>
  <BaseLucideIcon name="Info" :size="iconSize" />
</template>
```

---

## Icon Registry

Current icons in `LucideIconMap.ts`:

| Icon Name | Usage | Component |
|-----------|-------|-----------|
| `ArrowLeft` | Navigation | Various |
| `ArrowRight` | Navigation | Various |
| `Bitcoin` | Cryptocurrency | CryptoCurrencySelector |
| `CheckCircle` | Success states | Various |
| `CircleQuestionMark` | Help/Info | Various |
| `CloudUpload` | Upload actions | Various |
| `Contact` | Contact info | Various |
| `Copyright` | Footer | AppFooter |
| `Eye` | Show password | PasswordSection |
| `EyeOff` | Hide password | PasswordSection |
| `Hotel` | Company info | Various |
| `Info` | Information tooltip | InfoTooltip |
| `KeyRound` | Authentication | Various |
| `Landmark` | Banking | Various |
| `Lock` | Security | Various |
| `Mail` | Email | Various |
| `Menu` | Mobile menu | AppHeader |
| `Minus` | Neutral change | PriceChangeIndicator |
| `Save` | Save actions | Various |
| `ShieldUser` | Security | Various |
| `Trash` | Delete actions | Various |
| `TrendingDown` | Price decrease | PriceChangeIndicator |
| `TrendingUp` | Price increase | PriceChangeIndicator |
| `TriangleAlert` | Warnings | Various |
| `X` | Close/Cancel | Various |
| `Zap` | Quick actions | Various |

---

## Adding New Icons

To add a new icon to the project:

### Step 1: Import the icon

```typescript
// frontend/src/utils/LucideIconMap.ts
import {
  // ... existing imports
  NewIcon,
} from 'lucide-vue-next'
```

### Step 2: Add to iconMap

```typescript
export const iconMap = {
  // ... existing icons
  NewIcon,
} as const
```

### Step 3: Use in components

```vue
<BaseLucideIcon name="NewIcon" :size="20" />
```

That's it! TypeScript will automatically include the new icon in the `IconName` type.

---

## Usage Examples

### Basic Usage

```vue
<BaseLucideIcon name="Info" :size="16" />
```

### With Custom Stroke Width

```vue
<BaseLucideIcon 
  name="TrendingUp" 
  :size="20" 
  :stroke_width="3" 
/>
```

### Dynamic Icon Name

```vue
<script setup>
import { computed } from 'vue'
import type { IconName } from '@/utils/LucideIconMap'

const iconName = computed<IconName>(() => {
  return isSuccess ? 'CheckCircle' : 'TriangleAlert'
})
</script>

<template>
  <BaseLucideIcon :name="iconName" :size="24" />
</template>
```

### In Buttons

```vue
<button class="btn btn-primary">
  <BaseLucideIcon name="Save" :size="16" />
  Save Changes
</button>
```

### In Lists

```vue
<ul>
  <li>
    <BaseLucideIcon name="CheckCircle" :size="16" />
    Feature 1
  </li>
  <li>
    <BaseLucideIcon name="CheckCircle" :size="16" />
    Feature 2
  </li>
</ul>
```

---

## Migration Checklist

When migrating a component to use `BaseLucideIcon`:

- [ ] Check if icon is in `LucideIconMap.ts`
- [ ] If not, add icon to `LucideIconMap.ts`
- [ ] Replace direct lucide import with `BaseLucideIcon` import
- [ ] Add `IconName` type import if using dynamic icons
- [ ] Update template to use `<BaseLucideIcon name="..." />`
- [ ] Remove unused lucide imports
- [ ] Test component functionality
- [ ] Run diagnostics to check for errors

---

## Best Practices

### 1. Always Use Type-Safe Icon Names

```typescript
// ✅ Good - type-safe
const iconName = computed<IconName>(() => {
  return condition ? 'CheckCircle' : 'X'
})

// ❌ Bad - no type safety
const iconName = computed(() => {
  return condition ? 'CheckCircle' : 'X'
})
```

### 2. Use Computed for Dynamic Icons

```typescript
// ✅ Good - reactive
const iconName = computed<IconName>(() => {
  if (status === 'success') return 'CheckCircle'
  if (status === 'error') return 'TriangleAlert'
  return 'Info'
})

// ❌ Bad - not reactive
const iconName = status === 'success' ? 'CheckCircle' : 'Info'
```

### 3. Provide Meaningful Sizes

```vue
<!-- ✅ Good - appropriate sizes -->
<BaseLucideIcon name="Info" :size="16" />  <!-- Small inline icon -->
<BaseLucideIcon name="Logo" :size="32" />  <!-- Medium icon -->
<BaseLucideIcon name="Hero" :size="64" />  <!-- Large icon -->

<!-- ❌ Bad - inconsistent sizes -->
<BaseLucideIcon name="Info" :size="13" />
<BaseLucideIcon name="Logo" :size="27" />
```

### 4. Keep Icon Map Organized

```typescript
// ✅ Good - alphabetically sorted
export const iconMap = {
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  CheckCircle,
  // ...
} as const

// ❌ Bad - random order
export const iconMap = {
  Bitcoin,
  ArrowLeft,
  CheckCircle,
  ArrowRight,
  // ...
} as const
```

---

## Troubleshooting

### Icon Not Found Error

**Error:** `Type '"MyIcon"' is not assignable to type 'IconName'`

**Solution:** Add the icon to `LucideIconMap.ts`:

```typescript
import { MyIcon } from 'lucide-vue-next'

export const iconMap = {
  // ... existing icons
  MyIcon,
} as const
```

### Icon Not Displaying

**Check:**
1. Icon is imported in `LucideIconMap.ts`
2. Icon is added to `iconMap` object
3. Icon name matches exactly (case-sensitive)
4. Component is using correct prop name: `name` not `icon`

### Size Not Working

**Check:**
1. Using `:size` (with colon for binding)
2. Passing a number, not a string
3. Size is reasonable (typically 12-64)

---

## Performance

### Bundle Size Impact

Using `BaseLucideIcon` with centralized imports:
- ✅ Tree-shaking still works
- ✅ Only imported icons are bundled
- ✅ No duplicate icon code
- ✅ Smaller bundle size overall

### Runtime Performance

- ✅ Minimal overhead (one component lookup)
- ✅ Icons are cached by Vue
- ✅ No performance difference vs direct imports

---

## Future Enhancements

### Potential Improvements

1. **Icon Variants**
   ```vue
   <BaseLucideIcon name="Info" variant="filled" />
   ```

2. **Color Props**
   ```vue
   <BaseLucideIcon name="CheckCircle" color="success" />
   ```

3. **Animation Support**
   ```vue
   <BaseLucideIcon name="Loader" :spin="true" />
   ```

4. **Icon Aliases**
   ```typescript
   export const iconAliases = {
     'success': 'CheckCircle',
     'error': 'TriangleAlert',
     'info': 'Info',
   }
   ```

---

## Conclusion

The migration to `BaseLucideIcon` provides:

✅ **Centralized Management**: All icons in one place  
✅ **Type Safety**: TypeScript ensures valid icon names  
✅ **Consistency**: Same API across all components  
✅ **Maintainability**: Easy to update and refactor  
✅ **Performance**: No bundle size increase  

All components now use the centralized icon system, making the codebase more maintainable and consistent.

---

**Date**: March 11, 2026  
**Status**: ✅ Complete  
**Components Updated**: PriceChangeIndicator, InfoTooltip  
**Icons Added**: Info, Minus, TrendingDown, TrendingUp
