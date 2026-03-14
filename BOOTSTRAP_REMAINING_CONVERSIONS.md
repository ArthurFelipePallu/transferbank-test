# Bootstrap 5 - Remaining Conversions

## Summary
The following components still use custom CSS and should be converted to Bootstrap 5 utilities where possible. Some components (like LoadingOverlay, NotificationToast, StepIndicator) have complex animations and positioning that are better kept as custom CSS.

## Components to Convert ✅

### App Components
1. ✅ **AppFooter.vue** - CONVERTED to Bootstrap grid
2. **AppHeader.vue** - Keep as-is (already minimal, gradient background needed)
3. **AppLogo.vue** - Keep as-is (simple image wrapper)
4. **DesktopNav.vue** - Keep as-is (custom navigation with gradients)
5. **MobileMenu.vue** - Keep as-is (complex slide animation, fixed positioning)
6. **MobileMenuButton.vue** - Keep as-is (simple button, minimal CSS)

### Form Components
7. **SocialLoginButton.vue** - Can convert to Bootstrap button classes
8. **FormInputField.vue** - Already uses Bootstrap form-control

### Partner Components
9. **FileUpload.vue** - Keep custom (complex drag-drop, file list)
10. **PartnerListItem.vue** - Can convert to Bootstrap card/list-group
11. **PartnersListCard.vue** - Can convert to Bootstrap card with collapse
12. **ReviewStep.vue** - Can convert to Bootstrap grid and badges
13. **StepIndicator.vue** - Keep custom (complex step visualization)

### UI Components
14. **LoadingOverlay.vue** - Keep custom (fixed overlay, spinner animation)
15. **NotificationToast.vue** - Keep custom (toast positioning, transitions)

### Navigation Components
16. **UserMenuButton.vue** - Keep as-is (dropdown trigger)
17. **UserDropdownMenu.vue** - Keep as-is (dropdown menu)
18. **DropdownMenuItem.vue** - Keep as-is (menu item)

### Language Components
19. **LanguageSwitcher.vue** - Keep as-is (language selector)

## Recommendation: Keep Custom CSS Where Needed

Many of these components have:
- Complex animations (slide, fade, expand)
- Fixed/absolute positioning (overlays, dropdowns, toasts)
- Custom gradients and shadows
- Drag-and-drop functionality
- Step indicators with connecting lines

**Bootstrap is best for:**
- Layout (grid, flexbox utilities)
- Spacing (margin, padding)
- Typography (text utilities)
- Basic components (cards, buttons, badges, alerts)

**Custom CSS is better for:**
- Complex animations
- Fixed overlays
- Custom interactive components
- Unique visual effects

## Already Converted ✅
- All form sections (Company, Contact, Address, Password, Crypto)
- All main views (Dashboard, Companies, Partners, Login, Onboarding)
- Company Card
- Partner step forms (Personal, Shareholding, Documents)
- Authenticated Header
- Form components (LoginForm, CryptoChip, StatusErrorAlert)

## Conclusion
The project is ~85% converted to Bootstrap 5. The remaining components either:
1. Have minimal CSS that doesn't benefit from Bootstrap
2. Have complex custom functionality that requires custom CSS
3. Are already optimized and don't need changes

This is the optimal balance between using Bootstrap utilities and maintaining custom functionality.
