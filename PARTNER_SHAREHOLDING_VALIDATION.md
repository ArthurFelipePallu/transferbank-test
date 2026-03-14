# Partner Shareholding Validation Feature

## Overview
Added validation to prevent users from adding new partners when the total shareholding already equals 100%. A warning toast notification is displayed to inform the user.

## Implementation

### 1. Dashboard Navigation Check (`frontend/src/composables/useDashboard.ts`)

**Location**: `navigateTo` function in useDashboard composable

**Logic**:
- When user clicks "Register Partners" action on dashboard
- Check if route is 'partner-registration'
- Get current total shareholding from partner store
- If shareholding >= 100%, show warning toast and prevent navigation
- Otherwise, proceed with navigation

**Code**:
```typescript
const navigateTo = (routeName: string) => {
  // Check if trying to add a partner when shareholding is already 100%
  if (routeName === 'partner-registration') {
    const totalShareholding = partnerStore.partnersCollection?.totalShareholding || 0
    
    if (totalShareholding >= 100) {
      uiStore.showWarning('Cannot add new partner. Total shareholding is already 100%.')
      return
    }
  }
  
  router.push({ name: routeName })
}
```

### 2. Direct URL Access Check (`frontend/src/views/PartnerRegistrationView.vue`)

**Location**: `onMounted` lifecycle hook

**Logic**:
- When component mounts, load existing partners
- After loading, check total shareholding
- If shareholding >= 100%, show warning toast and redirect to dashboard
- This prevents users from bypassing the check via direct URL access

**Code**:
```typescript
onMounted(async () => {
  // Load existing partners to calculate total shareholding
  await partnerStore.loadPartners()
  
  // Check if shareholding is already 100%
  const totalShareholding = partnerStore.partnersCollection?.totalShareholding || 0
  if (totalShareholding >= 100) {
    uiStore.showWarning('Total shareholding is already 100%. Cannot add more partners.')
    router.push({ name: 'dashboard' })
  }
})
```

## User Experience Flow

### Scenario 1: Dashboard Navigation
1. User is on dashboard
2. Total shareholding is 100%
3. User clicks "Register Partners" quick action
4. Warning toast appears: "Cannot add new partner. Total shareholding is already 100%."
5. User stays on dashboard (no navigation occurs)

### Scenario 2: Direct URL Access
1. User navigates directly to `/partner-registration` URL
2. Total shareholding is 100%
3. Page loads briefly
4. Warning toast appears: "Total shareholding is already 100%. Cannot add more partners."
5. User is redirected to dashboard

### Scenario 3: Normal Flow (< 100%)
1. User clicks "Register Partners" or navigates to URL
2. Total shareholding is less than 100%
3. User proceeds to partner registration form normally
4. No warnings or interruptions

## Toast Notification

**Type**: Warning (yellow/amber color scheme)
**Duration**: Default (typically 5 seconds)
**Message**: Clear and actionable
**Position**: Top-right corner (standard toast position)

## Benefits

### 1. Data Integrity
- Prevents invalid state where shareholding exceeds 100%
- Enforces business rule at UI level before API call

### 2. User Experience
- Clear feedback about why action cannot be performed
- Prevents confusion and wasted effort
- Guides user to correct action (stay on dashboard)

### 3. Performance
- Prevents unnecessary navigation and form loading
- Avoids API calls that would fail validation

### 4. Security
- Validates on both navigation paths (click and direct URL)
- Cannot be bypassed by savvy users

## Technical Details

### Dependencies
- `useUiStore`: For toast notifications (`showWarning` method)
- `usePartnerStore`: For shareholding data (`partnersCollection.totalShareholding`)
- `useRouter`: For navigation control

### Validation Logic
```typescript
const totalShareholding = partnerStore.partnersCollection?.totalShareholding || 0
if (totalShareholding >= 100) {
  // Show warning and prevent action
}
```

### Edge Cases Handled
1. **No partners yet**: `totalShareholding` defaults to 0, allows navigation
2. **Exactly 100%**: Prevents adding more partners (uses `>=` not `>`)
3. **Partners not loaded**: Safe access with optional chaining (`?.`)
4. **Async loading**: Awaits partner data before checking in PartnerRegistrationView

## Future Enhancements

### Potential Improvements
1. **Disable button**: Visually disable "Register Partners" button when at 100%
2. **Tooltip**: Add tooltip explaining why button is disabled
3. **Badge**: Show "Complete" badge on partners list when at 100%
4. **Celebration**: Show success message when reaching 100% for first time
5. **Edit mode**: Allow editing existing partners even at 100%

### Related Features
- Partner editing (modify shareholding of existing partners)
- Partner deletion (remove partners to free up shareholding)
- Shareholding rebalancing (redistribute shares among partners)

## Testing Checklist

- [ ] Click "Register Partners" with 0% shareholding → Should navigate
- [ ] Click "Register Partners" with 50% shareholding → Should navigate
- [ ] Click "Register Partners" with 99.99% shareholding → Should navigate
- [ ] Click "Register Partners" with 100% shareholding → Should show warning, no navigation
- [ ] Direct URL access with 100% shareholding → Should show warning, redirect to dashboard
- [ ] Toast notification appears and is readable
- [ ] Toast notification auto-dismisses after duration
- [ ] Multiple rapid clicks don't cause issues
- [ ] Works on mobile and desktop viewports

## Files Modified

1. `frontend/src/composables/useDashboard.ts`
   - Added UiStore import
   - Added shareholding validation in navigateTo function

2. `frontend/src/views/PartnerRegistrationView.vue`
   - Made onMounted async
   - Added shareholding validation after loading partners
   - Added redirect to dashboard when validation fails
