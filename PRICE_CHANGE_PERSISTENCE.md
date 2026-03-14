# Price Change Persistence Feature

## Overview

The price change indicator now persists the last significant change even when subsequent updates show zero or minimal change. This provides a better user experience by always showing meaningful price movement information.

---

## Behavior

### Scenario 1: Significant Change

When the price changes by more than 0.01%:

```
T=0s:  Price = R$ 522.68, Previous = null        → No indicator
T=5s:  Price = R$ 524.15, Previous = R$ 522.68   → ↗ 0.28% (significant)
       Store: lastSignificantChange = { current: 524.15, previous: 522.68 }
```

### Scenario 2: Zero/Minimal Change

When the price changes by 0.01% or less:

```
T=10s: Price = R$ 524.15, Previous = R$ 524.15   → Change = 0%
       Display: ↗ 0.28% (shows last significant change from T=5s)
```

### Scenario 3: New Significant Change

When a new significant change occurs:

```
T=15s: Price = R$ 523.50, Previous = R$ 524.15   → ↘ 0.12% (significant)
       Store: lastSignificantChange = { current: 523.50, previous: 524.15 }
       Display: ↘ 0.12% (new change)
```

### Scenario 4: Another Zero Change

```
T=20s: Price = R$ 523.50, Previous = R$ 523.50   → Change = 0%
       Display: ↘ 0.12% (shows last significant change from T=15s)
```

---

## Implementation

### Composable Logic

The `useAccountSetupCost` composable tracks:

1. **currentPrice**: The latest price from API
2. **previousPrice**: The price from the previous update
3. **lastSignificantChange**: The last change that exceeded 0.01%

```typescript
const lastSignificantChange = ref<{ current: number; previous: number } | null>(null)

const updateCost = async () => {
  const newPriceData = await priceService.getCurrentPrice()
  
  if (priceData.value !== null) {
    previousPrice.value = priceData.value.priceBRL
    
    // Check if this is a significant change
    const difference = Math.abs(newPriceData.priceBRL - priceData.value.priceBRL)
    const percentageChange = (difference / priceData.value.priceBRL) * 100
    
    // If change is significant (> 0.01%), store it
    if (percentageChange > 0.01) {
      lastSignificantChange.value = {
        current: newPriceData.priceBRL,
        previous: priceData.value.priceBRL
      }
    }
  }
  
  priceData.value = newPriceData
}
```

### Display Values

Computed properties determine what to display:

```typescript
const displayCurrentValue = computed(() => {
  if (currentPrice.value === null) return null
  
  if (previousPrice.value !== null) {
    const difference = Math.abs(currentPrice.value - previousPrice.value)
    const percentageChange = (difference / previousPrice.value) * 100
    
    // If change is significant, use current values
    if (percentageChange > 0.01) {
      return currentPrice.value
    }
    
    // If change is minimal, use last significant change
    if (lastSignificantChange.value !== null) {
      return lastSignificantChange.value.current
    }
  }
  
  return currentPrice.value
})

const displayPreviousValue = computed(() => {
  // Similar logic for previous value
})
```

---

## Example Timeline

### Complete Update Cycle

```
┌─────────────────────────────────────────────────────────────┐
│  T = 0s (Initial Load)                                      │
├─────────────────────────────────────────────────────────────┤
│  Price: R$ 522.68                                           │
│  Display: R$ 522.68 (no indicator)                          │
│  lastSignificantChange: null                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 5s (First Significant Change)                          │
├─────────────────────────────────────────────────────────────┤
│  Price: R$ 524.15                                           │
│  Previous: R$ 522.68                                        │
│  Change: +1.47 BRL (+0.28%)                                 │
│  Display: R$ 524.15 ↗ 0.28%                                 │
│  lastSignificantChange: { current: 524.15, previous: 522.68 }│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 10s (No Change)                                        │
├─────────────────────────────────────────────────────────────┤
│  Price: R$ 524.15                                           │
│  Previous: R$ 524.15                                        │
│  Change: 0.00 BRL (0.00%)                                   │
│  Display: R$ 524.15 ↗ 0.28% ← Shows last significant!      │
│  lastSignificantChange: { current: 524.15, previous: 522.68 }│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 15s (Minimal Change)                                   │
├─────────────────────────────────────────────────────────────┤
│  Price: R$ 524.16                                           │
│  Previous: R$ 524.15                                        │
│  Change: +0.01 BRL (+0.002%)                                │
│  Display: R$ 524.16 ↗ 0.28% ← Still shows last significant!│
│  lastSignificantChange: { current: 524.15, previous: 522.68 }│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 20s (New Significant Change)                           │
├─────────────────────────────────────────────────────────────┤
│  Price: R$ 523.50                                           │
│  Previous: R$ 524.16                                        │
│  Change: -0.66 BRL (-0.13%)                                 │
│  Display: R$ 523.50 ↘ 0.13% ← New change!                  │
│  lastSignificantChange: { current: 523.50, previous: 524.16 }│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 25s (No Change Again)                                  │
├─────────────────────────────────────────────────────────────┤
│  Price: R$ 523.50                                           │
│  Previous: R$ 523.50                                        │
│  Change: 0.00 BRL (0.00%)                                   │
│  Display: R$ 523.50 ↘ 0.13% ← Shows last significant!      │
│  lastSignificantChange: { current: 523.50, previous: 524.16 }│
└─────────────────────────────────────────────────────────────┘
```

---

## Benefits

### 1. Better User Experience ✅

Users always see meaningful price movement information, even during periods of price stability.

### 2. Reduced Noise ✅

Minimal changes (< 0.01%) don't cause the indicator to flicker or show "0.00%".

### 3. Context Preservation ✅

Users can see the last significant price movement, providing context for the current price.

### 4. Smooth Updates ✅

The indicator doesn't disappear and reappear, creating a smoother visual experience.

---

## Configuration

The threshold for "significant change" is configurable:

```typescript
// In useAccountSetupCost.ts
const SIGNIFICANT_CHANGE_THRESHOLD = 0.01 // 0.01% = 1 basis point

// Check if change is significant
if (percentageChange > SIGNIFICANT_CHANGE_THRESHOLD) {
  lastSignificantChange.value = { current, previous }
}
```

You can adjust this threshold based on:
- Asset volatility (crypto vs. fiat)
- User preferences
- Display requirements

---

## Edge Cases

### Case 1: First Update (No Previous Price)

```typescript
if (previousPrice.value === null) {
  // No indicator shown
  return currentPrice.value
}
```

### Case 2: All Changes Are Minimal

```typescript
if (lastSignificantChange.value === null) {
  // Fall back to current values
  return currentPrice.value
}
```

### Case 3: Price Returns to Previous Value

```
T=0s:  R$ 522.68
T=5s:  R$ 524.15 → ↗ 0.28% (stored)
T=10s: R$ 522.68 → ↘ 0.28% (new significant change, stored)
T=15s: R$ 522.68 → ↘ 0.28% (shows last significant)
```

---

## Testing

### Test Scenarios

```typescript
describe('Price Change Persistence', () => {
  it('should show last significant change when current change is zero', () => {
    // Setup: significant change
    updatePrice(524.15) // from 522.68
    expect(displayIndicator()).toBe('↗ 0.28%')
    
    // No change
    updatePrice(524.15) // from 524.15
    expect(displayIndicator()).toBe('↗ 0.28%') // Still shows last!
  })
  
  it('should update when new significant change occurs', () => {
    // Setup: significant change
    updatePrice(524.15) // from 522.68
    expect(displayIndicator()).toBe('↗ 0.28%')
    
    // New significant change
    updatePrice(523.50) // from 524.15
    expect(displayIndicator()).toBe('↘ 0.12%') // New change!
  })
  
  it('should not show indicator on first update', () => {
    updatePrice(522.68) // first update
    expect(displayIndicator()).toBe(null)
  })
  
  it('should handle minimal changes correctly', () => {
    // Setup: significant change
    updatePrice(524.15) // from 522.68
    expect(displayIndicator()).toBe('↗ 0.28%')
    
    // Minimal change (0.002%)
    updatePrice(524.16) // from 524.15
    expect(displayIndicator()).toBe('↗ 0.28%') // Shows last significant
  })
})
```

---

## Comparison: Before vs After

### Before (No Persistence)

```
T=0s:  R$ 522.68 (no indicator)
T=5s:  R$ 524.15 ↗ 0.28%
T=10s: R$ 524.15 (no indicator) ❌ Indicator disappears!
T=15s: R$ 524.16 ↗ 0.002% ❌ Shows meaningless change!
```

### After (With Persistence)

```
T=0s:  R$ 522.68 (no indicator)
T=5s:  R$ 524.15 ↗ 0.28%
T=10s: R$ 524.15 ↗ 0.28% ✅ Indicator persists!
T=15s: R$ 524.16 ↗ 0.28% ✅ Shows last significant change!
```

---

## API

### Composable Return Values

```typescript
return {
  priceData,              // Full price data
  currentPrice,           // Actual current price
  previousPrice,          // Actual previous price
  displayCurrentValue,    // Value to display (may be from last significant change)
  displayPreviousValue,   // Value to display (may be from last significant change)
  isLoading,
  error,
  formattedCost,
  updateCost,
}
```

### Component Usage

```vue
<PriceChangeIndicator 
  :current-value="displayCurrentValue"    ← Use display values
  :previous-value="displayPreviousValue"  ← Not raw values
  size="md" 
/>
```

---

## Conclusion

The price change persistence feature ensures users always see meaningful price movement information, even during periods of price stability. This creates a better user experience by:

✅ Eliminating indicator flicker  
✅ Reducing visual noise from minimal changes  
✅ Providing context for current prices  
✅ Maintaining smooth, consistent updates  

The implementation is clean, testable, and configurable, with a sensible default threshold of 0.01%.

---

**Date**: March 11, 2026  
**Status**: ✅ Implemented  
**Threshold**: 0.01% (configurable)
