# Reusable Components Documentation

## Overview

Two new reusable components have been created to improve code modularity and reusability:

1. **PriceChangeIndicator** - Displays price change with direction and percentage
2. **InfoTooltip** - Displays an info icon with hover tooltip

---

## PriceChangeIndicator Component

### Location
`frontend/src/components/PriceChangeIndicator.vue`

### Purpose
A pure presentation component that receives two numeric values, calculates the percentage difference, and displays it with visual indicators. Completely independent of domain entities.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentValue` | `number \| null` | Yes | - | The current value to compare |
| `previousValue` | `number \| null` | Yes | - | The previous value to compare against |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant for the indicator |
| `decimals` | `number` | No | `2` | Number of decimal places for percentage |
| `minimumChangeThreshold` | `number` | No | `0.01` | Minimum change to show direction (prevents noise) |

### Features

- ✅ Pure presentation component (no domain dependencies)
- ✅ Calculates percentage change internally
- ✅ Determines direction automatically (up/down/neutral)
- ✅ Shows direction indicator:
  - ↗ (TrendingUp) for increases
  - ↘ (TrendingDown) for decreases
  - — (Minus) for neutral changes
- ✅ Color-coded backgrounds:
  - Green for increases
  - Red for decreases
  - Gray for neutral
- ✅ Three size variants (sm, md, lg)
- ✅ Animated entrance (slide-in effect)
- ✅ Always visible when both values are provided
- ✅ Configurable decimal precision
- ✅ Configurable minimum change threshold

### Calculation Logic

The component internally calculates:

```typescript
// Percentage change
const absoluteChange = Math.abs(currentValue - previousValue)
const percentageChange = (absoluteChange / previousValue) * 100

// Direction
const difference = currentValue - previousValue
if (difference > minimumChangeThreshold) {
  direction = 'up'
} else if (difference < -minimumChangeThreshold) {
  direction = 'down'
} else {
  direction = 'neutral'
}
```

### Usage Examples

```vue
<script setup>
import PriceChangeIndicator from '@/components/PriceChangeIndicator.vue'
import { ref } from 'vue'

const currentPrice = ref(524.15)
const previousPrice = ref(522.68)
</script>

<template>
  <!-- Basic usage -->
  <PriceChangeIndicator 
    :current-value="currentPrice" 
    :previous-value="previousPrice" 
  />
  
  <!-- With custom size -->
  <PriceChangeIndicator 
    :current-value="100" 
    :previous-value="95" 
    size="lg" 
  />
  
  <!-- With custom decimals -->
  <PriceChangeIndicator 
    :current-value="1.2345" 
    :previous-value="1.2300" 
    :decimals="4" 
  />
  
  <!-- With custom threshold (more sensitive) -->
  <PriceChangeIndicator 
    :current-value="100.005" 
    :previous-value="100.000" 
    :minimum-change-threshold="0.001" 
  />
  
  <!-- Stock price example -->
  <PriceChangeIndicator 
    :current-value="stockPrice" 
    :previous-value="previousStockPrice" 
    size="sm" 
  />
  
  <!-- Cryptocurrency example -->
  <PriceChangeIndicator 
    :current-value="btcPrice" 
    :previous-value="previousBtcPrice" 
    :decimals="2" 
  />
  
  <!-- Temperature change example -->
  <PriceChangeIndicator 
    :current-value="currentTemp" 
    :previous-value="yesterdayTemp" 
    size="md" 
  />
</template>
```

### Real-World Examples

#### Price Tracking
```vue
<script setup>
import { ref, watch } from 'vue'
import PriceChangeIndicator from '@/components/PriceChangeIndicator.vue'

const currentPrice = ref(null)
const previousPrice = ref(null)

// Simulate price updates
setInterval(() => {
  previousPrice.value = currentPrice.value
  currentPrice.value = Math.random() * 1000
}, 5000)
</script>

<template>
  <div>
    <span>Price: ${{ currentPrice?.toFixed(2) }}</span>
    <PriceChangeIndicator 
      :current-value="currentPrice" 
      :previous-value="previousPrice" 
    />
  </div>
</template>
```

#### Dashboard Metrics
```vue
<template>
  <div class="metrics-grid">
    <div class="metric-card">
      <h3>Revenue</h3>
      <p class="value">$125,430</p>
      <PriceChangeIndicator 
        :current-value="125430" 
        :previous-value="118200" 
        size="sm" 
      />
    </div>
    
    <div class="metric-card">
      <h3>Users</h3>
      <p class="value">8,542</p>
      <PriceChangeIndicator 
        :current-value="8542" 
        :previous-value="8100" 
        size="sm" 
      />
    </div>
  </div>
</template>
```

### Styling

The component uses scoped styles with CSS custom properties for colors:

```css
/* Green for increases */
.price-change--up {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
}

/* Red for decreases */
.price-change--down {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

/* Gray for neutral */
.price-change--neutral {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
}
```

### Size Variants

| Size | Icon Size | Font Size | Padding |
|------|-----------|-----------|---------|
| `sm` | 12px | 0.6875rem | 0.2rem 0.4rem |
| `md` | 14px | 0.75rem | 0.25rem 0.5rem |
| `lg` | 16px | 0.875rem | 0.3rem 0.6rem |

---

## InfoTooltip Component

### Location
`frontend/src/components/InfoTooltip.vue`

### Purpose
Displays an information icon that shows a tooltip on hover/focus. Fully reusable across the application.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `iconSize` | `number` | No | `16` | Size of the info icon in pixels |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | `'top'` | Tooltip position relative to icon |
| `ariaLabel` | `string` | No | `'Information'` | Accessibility label for screen readers |

### Features

- ✅ Four position options (top, bottom, left, right)
- ✅ Hover and focus interactions
- ✅ Smooth fade-in/fade-out transitions
- ✅ Responsive design (adjusts on mobile)
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Slot-based content (fully customizable)
- ✅ Automatic arrow positioning
- ✅ Shadow and border styling

### Usage Examples

```vue
<script setup>
import InfoTooltip from '@/components/InfoTooltip.vue'
</script>

<template>
  <!-- Basic usage (top position) -->
  <InfoTooltip>
    <p>This is helpful information!</p>
  </InfoTooltip>
  
  <!-- Custom icon size and position -->
  <InfoTooltip :icon-size="20" position="bottom" aria-label="Help information">
    <p><strong>Title:</strong> Description</p>
    <p>More details here...</p>
  </InfoTooltip>
  
  <!-- Left position -->
  <InfoTooltip position="left">
    <ul>
      <li>Point 1</li>
      <li>Point 2</li>
      <li>Point 3</li>
    </ul>
  </InfoTooltip>
  
  <!-- Right position -->
  <InfoTooltip position="right">
    <div class="custom-content">
      <h4>Custom Content</h4>
      <p>Any HTML content works!</p>
    </div>
  </InfoTooltip>
</template>
```

### Slot Content

The component uses a default slot for tooltip content. You can pass any HTML:

```vue
<InfoTooltip>
  <!-- Simple text -->
  <p>Simple tooltip text</p>
</InfoTooltip>

<InfoTooltip>
  <!-- Formatted content -->
  <p class="mb-2"><strong>Label:</strong> Value</p>
  <p class="mb-0"><strong>Another:</strong> Value</p>
</InfoTooltip>

<InfoTooltip>
  <!-- Complex content -->
  <div>
    <h5>Title</h5>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    <button>Action</button>
  </div>
</InfoTooltip>
```

### Position Variants

The tooltip automatically positions itself and its arrow based on the `position` prop:

| Position | Tooltip Location | Arrow Location |
|----------|------------------|----------------|
| `top` | Above icon | Bottom of tooltip, right side |
| `bottom` | Below icon | Top of tooltip, right side |
| `left` | Left of icon | Right side of tooltip, centered |
| `right` | Right of icon | Left side of tooltip, centered |

### Responsive Behavior

On mobile devices (≤480px):
- Top/bottom positioned tooltips align to the left
- Arrow adjusts to left side
- Minimum width reduces to 240px

### Accessibility

- ✅ Keyboard accessible (Tab to focus, Esc to close)
- ✅ ARIA label for screen readers
- ✅ Focus visible styles
- ✅ Semantic button element

---

## Integration Example: AccountSetupCost

Here's how these components are used together in `AccountSetupCost.vue`:

```vue
<script setup lang="ts">
import { useAccountSetupCost } from '@/composables/useAccountSetupCost'
import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import PriceChangeIndicator from '@/components/PriceChangeIndicator.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

const { priceData, currentPrice, previousPrice, isLoading, error, formattedCost } = useAccountSetupCost()

const getCurrencyLabel = (source: CurrencyCode) => {
  switch (source) {
    case CurrencyCode.USD:
      return '$100 USD'
    case CurrencyCode.BTC:
      return '0.00153 BTC'
    case CurrencyCode.ETH:
      return '0.521 ETH'
  }
}
</script>

<template>
  <div class="account-cost-compact">
    <div v-else-if="priceData" class="cost-display">
      <span class="cost-label">Account Setup Cost:</span>
      
      <div class="cost-value-wrapper">
        <div class="cost-value">
          {{ formattedCost() }}
        </div>
        
        <!-- Price Change Indicator Component -->
        <!-- Pure presentation: just pass current and previous values -->
        <PriceChangeIndicator 
          :current-value="currentPrice" 
          :previous-value="previousPrice" 
          size="md" 
        />
      </div>
      
      <!-- Info Tooltip Component -->
      <InfoTooltip :icon-size="16" position="top" aria-label="Cost information">
        <p class="tooltip-item">
          <strong>Based on:</strong> {{ getCurrencyLabel(priceData.selectedCurrency) }}
        </p>
        <p class="tooltip-item">
          <strong>Fees:</strong> 1% spread + 3.5% IOF
        </p>
        <p class="tooltip-item mb-0">
          <strong>Updates:</strong> Every 5 seconds
        </p>
      </InfoTooltip>
    </div>
  </div>
</template>
```

### Composable (useAccountSetupCost)

The composable tracks current and previous prices:

```typescript
export function useAccountSetupCost() {
  const priceData = ref<AccountSetupPriceResult | null>(null)
  const previousPrice = ref<number | null>(null)
  
  const currentPrice = computed(() => priceData.value?.priceBRL ?? null)
  
  const updateCost = async () => {
    const newPriceData = await priceService.getCurrentPrice()
    
    // Store previous price before updating
    if (priceData.value !== null) {
      previousPrice.value = priceData.value.priceBRL
    }
    
    priceData.value = newPriceData
  }
  
  return {
    priceData,
    currentPrice,
    previousPrice,
    // ...
  }
}
```

---

## Benefits of Reusable Components

### 1. Code Reusability ✅

Both components can be used anywhere in the application:

```vue
<!-- In a dashboard -->
<PriceChangeIndicator :price-change="stockChange" size="lg" />

<!-- In a settings page -->
<InfoTooltip position="right">
  <p>This setting controls...</p>
</InfoTooltip>

<!-- In a product card -->
<PriceChangeIndicator :price-change="productPriceChange" size="sm" />
```

### 2. Consistency ✅

- Same visual style across the application
- Consistent behavior and interactions
- Unified accessibility standards

### 3. Maintainability ✅

- Single source of truth for styling
- Easy to update globally
- Reduced code duplication

### 4. Testability ✅

- Components can be tested independently
- Props and slots are well-defined
- Clear component boundaries

### 5. Flexibility ✅

- Customizable through props
- Slot-based content for InfoTooltip
- Multiple size and position variants

---

## Testing Examples

### PriceChangeIndicator Tests

```typescript
import { mount } from '@vue/test-utils'
import PriceChangeIndicator from '@/components/PriceChangeIndicator.vue'

describe('PriceChangeIndicator', () => {
  it('should display up arrow for positive change', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 105, 
        previousValue: 100 
      }
    })
    
    expect(wrapper.find('.price-change--up').exists()).toBe(true)
    expect(wrapper.text()).toContain('5.00%')
  })
  
  it('should display down arrow for negative change', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 95, 
        previousValue: 100 
      }
    })
    
    expect(wrapper.find('.price-change--down').exists()).toBe(true)
    expect(wrapper.text()).toContain('5.00%')
  })
  
  it('should display neutral for minimal change', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 100.005, 
        previousValue: 100.000 
      }
    })
    
    expect(wrapper.find('.price-change--neutral').exists()).toBe(true)
  })
  
  it('should not render when values are null', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: null, 
        previousValue: null 
      }
    })
    
    expect(wrapper.find('.price-change').exists()).toBe(false)
  })
  
  it('should apply correct size class', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 105, 
        previousValue: 100, 
        size: 'lg' 
      }
    })
    
    expect(wrapper.find('.price-change--lg').exists()).toBe(true)
  })
  
  it('should format with custom decimals', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 100.12345, 
        previousValue: 100.00000,
        decimals: 4
      }
    })
    
    expect(wrapper.text()).toContain('0.1235%')
  })
  
  it('should respect custom threshold', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 100.005, 
        previousValue: 100.000,
        minimumChangeThreshold: 0.001
      }
    })
    
    // With threshold 0.001, change of 0.005 should show as 'up'
    expect(wrapper.find('.price-change--up').exists()).toBe(true)
  })
  
  it('should calculate percentage correctly', () => {
    const wrapper = mount(PriceChangeIndicator, {
      props: { 
        currentValue: 110, 
        previousValue: 100 
      }
    })
    
    // (110 - 100) / 100 * 100 = 10%
    expect(wrapper.text()).toContain('10.00%')
  })
})
```

### InfoTooltip Tests

```typescript
import { mount } from '@vue/test-utils'
import InfoTooltip from '@/components/InfoTooltip.vue'

describe('InfoTooltip', () => {
  it('should render info icon', () => {
    const wrapper = mount(InfoTooltip)
    expect(wrapper.find('.info-button').exists()).toBe(true)
  })
  
  it('should show tooltip on hover', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: '<p>Tooltip content</p>'
      }
    })
    
    await wrapper.find('.info-button').trigger('mouseenter')
    expect(wrapper.find('.info-tooltip').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tooltip content')
  })
  
  it('should hide tooltip on mouse leave', async () => {
    const wrapper = mount(InfoTooltip)
    
    await wrapper.find('.info-button').trigger('mouseenter')
    expect(wrapper.find('.info-tooltip').exists()).toBe(true)
    
    await wrapper.find('.info-button').trigger('mouseleave')
    expect(wrapper.find('.info-tooltip').exists()).toBe(false)
  })
  
  it('should apply correct position class', () => {
    const wrapper = mount(InfoTooltip, {
      props: { position: 'bottom' }
    })
    
    wrapper.find('.info-button').trigger('mouseenter')
    expect(wrapper.find('.info-tooltip--bottom').exists()).toBe(true)
  })
  
  it('should have correct aria-label', () => {
    const wrapper = mount(InfoTooltip, {
      props: { ariaLabel: 'Custom help text' }
    })
    
    expect(wrapper.find('.info-button').attributes('aria-label')).toBe('Custom help text')
  })
})
```

---

## Future Enhancements

### PriceChangeIndicator

- [ ] Add animation options (bounce, pulse, etc.)
- [ ] Support custom colors via props
- [ ] Add tooltip showing absolute change value
- [ ] Support different number formats (currency, percentage, etc.)

### InfoTooltip

- [ ] Add click-to-toggle mode (in addition to hover)
- [ ] Support custom icon (not just Info icon)
- [ ] Add max-width prop for content control
- [ ] Support dark mode variant
- [ ] Add close button for mobile

---

## Migration Guide

If you have existing code using inline price change or tooltip logic, here's how to migrate:

### Before (Inline Logic)

```vue
<template>
  <div v-if="priceChange && priceChange.hasSignificantChange()">
    <TrendingUp v-if="priceChange.direction === 'up'" />
    <span>{{ priceChange.formatPercentage() }}%</span>
  </div>
  
  <div class="info-wrapper">
    <button @mouseenter="show = true" @mouseleave="show = false">
      <Info />
    </button>
    <div v-if="show" class="tooltip">
      <p>Tooltip content</p>
    </div>
  </div>
</template>
```

### After (Reusable Components)

```vue
<script setup>
import PriceChangeIndicator from '@/components/PriceChangeIndicator.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

const currentPrice = ref(524.15)
const previousPrice = ref(522.68)
</script>

<template>
  <!-- Pure presentation: just pass the values -->
  <PriceChangeIndicator 
    :current-value="currentPrice" 
    :previous-value="previousPrice" 
  />
  
  <InfoTooltip>
    <p>Tooltip content</p>
  </InfoTooltip>
</template>
```

---

## Conclusion

These reusable components improve code quality by:

1. ✅ Reducing duplication
2. ✅ Improving consistency
3. ✅ Enhancing maintainability
4. ✅ Simplifying testing
5. ✅ Enabling rapid development

Both components follow Vue 3 best practices and are ready for production use.

---

**Created**: March 11, 2026  
**Status**: ✅ Production Ready  
**Components**: PriceChangeIndicator, InfoTooltip
