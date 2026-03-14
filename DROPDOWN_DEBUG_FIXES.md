# Dropdown Menu Debug Fixes

## Issues Identified and Fixed

### 1. Missing Z-Index
**Problem**: The dropdown menu was rendering behind page content.

**Fix**: Added explicit z-index values:
- `UserDropdownMenu`: `z-index: 1000`
- `user-menu-container`: `z-index: 1001`
- `LanguageSwitcher dropdown`: `z-index: 1000`

### 2. Overflow Hidden
**Problem**: Parent containers might be clipping the dropdown.

**Fix**: Added `overflow: visible` to:
- `.authenticated-header`
- `.authenticated-header-inner`

### 3. Click Event Propagation
**Problem**: Click events might be getting blocked or not propagating correctly.

**Fix**: 
- Removed `@mousedown.prevent` from dropdown menu
- Added `event.stopPropagation()` to toggle handler
- Created dedicated `handleToggle` function

### 4. Click Outside Detection
**Problem**: Click outside handler might be closing dropdown immediately.

**Fix**: Ensured click outside handler checks for `.user-menu-container` class before closing.

## Changes Made

### File: `frontend/src/components/Navigation/UserDropdownMenu.vue`
```css
.dropdown-menu {
  z-index: 1000; /* Added */
}
```
```html
<!-- Removed @mousedown.prevent -->
<div v-if="isVisible" class="dropdown-menu">
```

### File: `frontend/src/components/Navigation/AuthenticatedDesktopNav.vue`
```css
.user-menu-container {
  position: relative;
  z-index: 1001; /* Added */
}
```
```typescript
const handleToggle = (event: Event) => {
  event.stopPropagation()
  toggleDropdown()
}
```

### File: `frontend/src/components/Layout/AuthenticatedHeader.vue`
```css
.authenticated-header {
  overflow: visible; /* Added */
}

.authenticated-header-inner {
  overflow: visible; /* Added */
}
```

## Testing Checklist

### Desktop Dropdown Visibility
- [ ] Click user menu button - dropdown should appear
- [ ] Dropdown appears below button (not behind content)
- [ ] Dropdown has proper shadow and styling
- [ ] Click outside closes dropdown
- [ ] Click on dropdown items works
- [ ] Hover over Services shows submenu
- [ ] Hover over Support shows submenu
- [ ] Logout button works

### Z-Index Stacking
- [ ] Dropdown appears above page content
- [ ] Dropdown appears above cards
- [ ] Dropdown appears above other UI elements
- [ ] Submenus appear above dropdown menu
- [ ] Language switcher dropdown doesn't interfere

### Click Behavior
- [ ] First click opens dropdown
- [ ] Second click closes dropdown
- [ ] Click outside closes dropdown
- [ ] Click on menu items navigates correctly
- [ ] Click on logout works

## Debugging Steps if Still Not Working

### 1. Check Browser DevTools
Open browser console and check:
```javascript
// Check if dropdown is being rendered
document.querySelector('.dropdown-menu')

// Check computed styles
const dropdown = document.querySelector('.dropdown-menu')
if (dropdown) {
  console.log(window.getComputedStyle(dropdown).zIndex)
  console.log(window.getComputedStyle(dropdown).position)
  console.log(window.getComputedStyle(dropdown).display)
}

// Check if isDropdownOpen is changing
// Add this to AuthenticatedDesktopNav.vue temporarily:
watch(isDropdownOpen, (value) => {
  console.log('Dropdown open state:', value)
})
```

### 2. Check Element Inspector
- Inspect the user menu button
- Check if `.user-menu-container` exists
- Check if `.dropdown-menu` is in the DOM when clicked
- Check computed styles for z-index, position, display
- Check if any parent has `overflow: hidden`

### 3. Check Click Events
Add temporary logging:
```typescript
const handleToggle = (event: Event) => {
  console.log('Toggle clicked!')
  event.stopPropagation()
  toggleDropdown()
}

const toggleDropdown = () => {
  console.log('Before toggle:', isDropdownOpen.value)
  isDropdownOpen.value = !isDropdownOpen.value
  console.log('After toggle:', isDropdownOpen.value)
}
```

### 4. Check CSS Conflicts
Look for:
- Global styles overriding z-index
- Bootstrap classes affecting positioning
- Other components with higher z-index
- Stacking context issues

### 5. Verify Component Mounting
```typescript
onMounted(() => {
  console.log('AuthenticatedDesktopNav mounted')
  console.log('Company name:', props.companyName)
  console.log('Services:', props.services)
  console.log('Support:', props.support)
})
```

## Common Issues and Solutions

### Issue: Dropdown appears but immediately closes
**Solution**: Check if click outside handler is firing too early. The `event.stopPropagation()` should prevent this.

### Issue: Dropdown doesn't appear at all
**Solution**: 
1. Check if `isDropdownOpen` is changing (add console.log)
2. Check if component is rendering (inspect DOM)
3. Check if CSS is hiding it (display: none, opacity: 0)

### Issue: Dropdown appears behind content
**Solution**: Increase z-index values or check for stacking context issues.

### Issue: Click on dropdown items doesn't work
**Solution**: Check if event handlers are properly connected and events are emitting correctly.

## Z-Index Hierarchy

Current z-index values in the app:
```
1001 - user-menu-container (highest)
1000 - dropdown-menu, language-dropdown
300  - mobile-menu
200  - mobile-menu-overlay
100  - authenticated-header, app-header
10   - submenu (relative to dropdown)
```

## Additional Notes

### Stacking Context
The `user-menu-container` creates a new stacking context with `position: relative` and `z-index: 1001`. This ensures the dropdown menu (child element) appears above other content.

### Overflow Visible
Setting `overflow: visible` on parent containers ensures the dropdown isn't clipped. This is crucial for absolutely positioned elements that extend beyond their parent's bounds.

### Event Handling
The `event.stopPropagation()` in the toggle handler prevents the click from bubbling up to the document, which would trigger the click-outside handler immediately.

### Transition
The dropdown uses Vue's `<Transition>` component with fade + slide animation. If the dropdown appears but without animation, check if the transition classes are being applied.

## Next Steps if Issue Persists

1. Add temporary border to dropdown: `border: 3px solid red !important`
2. Add temporary background: `background: red !important`
3. Check if dropdown is rendering off-screen (check position values)
4. Verify viewport isn't cutting off dropdown
5. Check if any JavaScript errors are preventing rendering
6. Try removing the Transition component temporarily
7. Check if v-if condition is working correctly

## Success Criteria

The dropdown should:
- ✅ Appear on first click
- ✅ Be visible above all content
- ✅ Have proper styling and shadow
- ✅ Close on second click
- ✅ Close when clicking outside
- ✅ Show submenus on hover
- ✅ Navigate correctly when items clicked
- ✅ Work on all screen sizes (768px+)
