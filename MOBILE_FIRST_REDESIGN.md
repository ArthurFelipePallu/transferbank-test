# Mobile-First Redesign - Bootstrap 5 Approach

## Bootstrap 5 is Already Mobile-First! 🎉

Bootstrap 5 uses mobile-first breakpoints by default:
- `xs`: < 576px (default, no class needed)
- `sm`: ≥ 576px
- `md`: ≥ 768px
- `lg`: ≥ 992px
- `xl`: ≥ 1200px
- `xxl`: ≥ 1400px

## Our Custom Breakpoints (aligned with Bootstrap)
- Mobile: 360px - 575px (Bootstrap xs)
- Small Tablet: 576px - 767px (Bootstrap sm)
- Tablet: 768px - 991px (Bootstrap md)
- Laptop: 992px - 1199px (Bootstrap lg)
- Desktop: 1200px - 1399px (Bootstrap xl)
- Large Desktop: 1400px+ (Bootstrap xxl)

## Strategy: Leverage Bootstrap 5 + Custom Variables

### Use Bootstrap 5 For:
1. ✅ Grid system (container, row, col-*)
2. ✅ Spacing utilities (m-*, p-*, g-*)
3. ✅ Typography (h1-h6, text-*, fs-*)
4. ✅ Buttons (btn, btn-primary, btn-lg)
5. ✅ Forms (form-control, form-label, input-group)
6. ✅ Cards (card, card-body, card-header)
7. ✅ Navigation (navbar, nav, offcanvas for mobile menu)
8. ✅ Utilities (d-*, flex-*, align-*, justify-*)

### Custom Variables For:
1. ✅ Brand colors (--color-primary-teal)
2. ✅ Touch targets (--touch-target-min: 44px)
3. ✅ Custom shadows
4. ✅ Brand-specific spacing

## Implementation Plan (Revised)

### Phase 1: Bootstrap Configuration ✅
- [x] Update bootstrap-custom.scss with mobile-first overrides
- [x] Set custom breakpoints if needed
- [x] Override Bootstrap variables with our brand colors

### Phase 2: Components (Use Bootstrap Classes)
- [ ] AppHeader - Use Bootstrap navbar with offcanvas
- [ ] AppFooter - Use Bootstrap grid
- [ ] Forms - Use Bootstrap form-control (already 44px+ on mobile)
- [ ] Buttons - Use Bootstrap btn classes
- [ ] Cards - Use Bootstrap card classes

### Phase 3: Views (Use Bootstrap Layout)
- [ ] Use Bootstrap container/container-fluid
- [ ] Use Bootstrap row/col-* for responsive layouts
- [ ] Use Bootstrap spacing utilities (mt-*, mb-*, etc.)

### Phase 4: Mobile Navigation
- [ ] Implement Bootstrap offcanvas for mobile menu
- [ ] Use Bootstrap navbar-toggler
- [ ] Add bottom navigation for mobile (custom)

## Bootstrap 5 Touch-Friendly Defaults

Bootstrap 5 already provides:
- ✅ 44px+ height on form controls
- ✅ Large touch targets on buttons
- ✅ Mobile-first responsive grid
- ✅ Responsive typography
- ✅ Mobile-optimized components

## Quick Wins with Bootstrap 5

1. **Replace custom CSS with Bootstrap utilities**
   ```vue
   <!-- Before -->
   <div class="custom-spacing">
   
   <!-- After -->
   <div class="mt-3 mb-4 px-3">
   ```

2. **Use Bootstrap responsive classes**
   ```vue
   <!-- Mobile: full width, Desktop: 50% -->
   <div class="col-12 col-lg-6">
   ```

3. **Use Bootstrap form components**
   ```vue
   <!-- Already touch-friendly -->
   <input class="form-control form-control-lg">
   ```

4. **Use Bootstrap navigation**
   ```vue
   <!-- Mobile hamburger menu -->
   <nav class="navbar navbar-expand-lg">
     <button class="navbar-toggler">
     <div class="offcanvas offcanvas-start">
   ```

## Files to Update (Bootstrap-First Approach)

### Priority 1: Navigation
- [ ] AppHeader.vue - Add Bootstrap offcanvas
- [ ] Create MobileNav.vue component

### Priority 2: Forms (mostly done, just verify)
- [ ] Ensure all inputs use form-control
- [ ] Ensure all buttons use btn classes
- [ ] Use input-group for compound inputs

### Priority 3: Layout
- [ ] Ensure all views use Bootstrap grid
- [ ] Replace custom spacing with Bootstrap utilities
- [ ] Use Bootstrap responsive utilities

### Priority 4: Components
- [ ] Replace custom card CSS with Bootstrap cards
- [ ] Use Bootstrap modals
- [ ] Use Bootstrap alerts/toasts

## Next Steps

1. Update bootstrap-custom.scss with our brand colors
2. Audit components for Bootstrap class usage
3. Replace custom CSS with Bootstrap utilities where possible
4. Add mobile navigation (offcanvas)
5. Test on all breakpoints
