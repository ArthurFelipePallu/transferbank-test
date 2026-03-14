# Mobile-First Quick Reference Guide

## 🎯 Quick Start

### When Creating New Components

```vue
<template>
  <!-- Use Bootstrap grid -->
  <div class="container">
    <div class="row g-3 g-md-4">
      <!-- Mobile: full width, Tablet: 50%, Desktop: 33% -->
      <div class="col-12 col-md-6 col-lg-4">
        <!-- Use Bootstrap card -->
        <div class="card">
          <div class="card-body p-3 p-md-4">
            <!-- Content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## 📱 Responsive Breakpoints

```scss
// Mobile (default): < 576px - no class needed
// Small Tablet: ≥ 576px - use -sm- classes
// Tablet: ≥ 768px - use -md- classes
// Laptop: ≥ 992px - use -lg- classes
// Desktop: ≥ 1200px - use -xl- classes
// Large Desktop: ≥ 1400px - use -xxl- classes
```

---

## 🎨 Common Patterns

### Responsive Columns
```vue
<!-- 1 column mobile, 2 tablet, 3 desktop -->
<div class="col-12 col-md-6 col-lg-4">

<!-- 1 column mobile, 2 desktop -->
<div class="col-12 col-lg-6">

<!-- Full width mobile, auto desktop -->
<div class="col-12 col-lg-auto">
```

### Responsive Spacing
```vue
<!-- Padding: 1rem mobile, 1.5rem tablet, 2rem desktop -->
<div class="p-3 p-md-4 p-lg-5">

<!-- Margin: 1rem mobile, 2rem desktop -->
<div class="mt-3 mt-lg-5">

<!-- Gap: 0.5rem mobile, 1rem tablet, 1.5rem desktop -->
<div class="row g-2 g-md-3 g-lg-4">
```

### Responsive Display
```vue
<!-- Hide on mobile, show on tablet+ -->
<div class="d-none d-md-block">

<!-- Show on mobile, hide on tablet+ -->
<div class="d-block d-md-none">

<!-- Flex column mobile, row desktop -->
<div class="d-flex flex-column flex-lg-row">
```

### Responsive Typography
```vue
<!-- Smaller on mobile, larger on desktop -->
<h1 class="h4 h-md-3 h-lg-2">Title</h1>

<!-- Small text on mobile, normal on desktop -->
<p class="small fs-md-6">Text</p>
```

### Touch-Friendly Buttons
```vue
<!-- Full width on mobile, auto on desktop -->
<button class="btn btn-primary w-100 w-md-auto">
  Action
</button>

<!-- Bootstrap ensures 44px+ height automatically -->
<button class="btn btn-lg">Large Button</button>
```

---

## 🎯 Touch Target Guidelines

### Minimum Sizes
- **Mobile**: 44px minimum (48px preferred)
- **Tablet+**: 40px acceptable
- **Desktop**: Bootstrap defaults

### Implementation
```vue
<!-- Bootstrap handles this automatically -->
<button class="btn">Auto 44px+</button>
<input class="form-control">Auto 44px+</input>
<a class="nav-link">Auto 44px+</a>

<!-- Custom components -->
<style scoped>
.custom-button {
  min-height: 44px; /* Mobile */
}

@media (min-width: 768px) {
  .custom-button {
    min-height: auto; /* Tablet+ */
  }
}
</style>
```

---

## 🎨 Color Variables

### Primary Colors
```css
var(--color-primary-teal)        /* #1c9c8c */
var(--color-primary-teal-light)  /* #19a596 */
var(--color-accent-teal-1)       /* #21b8a6 */
```

### Bootstrap Colors
```css
var(--bs-primary)    /* #1c9c8c */
var(--bs-secondary)  /* #6c757d */
var(--bs-success)    /* #14b8a6 */
var(--bs-danger)     /* #ef4444 */
var(--bs-warning)    /* #f4c21d */
```

### Neutrals
```css
var(--color-white)           /* #ffffff */
var(--color-text-main)       /* #2b2b2b */
var(--color-text-muted)      /* #6c6c6c */
var(--color-surface)         /* #cfcfcf */
```

---

## 📏 Spacing Scale

### Bootstrap Spacing (0-5)
```vue
<!-- 0 = 0, 1 = 4px, 2 = 8px, 3 = 16px, 4 = 24px, 5 = 48px -->
<div class="p-3">  <!-- 16px padding -->
<div class="mt-4"> <!-- 24px margin-top -->
<div class="mb-5"> <!-- 48px margin-bottom -->
```

### Custom Variables
```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
var(--spacing-2xl)  /* 40px */
var(--spacing-3xl)  /* 48px */
```

---

## 🎯 Form Components

### Input Fields
```vue
<!-- Bootstrap handles sizing automatically -->
<input type="text" class="form-control" placeholder="Text">
<input type="email" class="form-control" placeholder="Email">
<select class="form-select">
  <option>Option</option>
</select>
```

### Input Groups
```vue
<div class="input-group">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control">
</div>
```

### Validation
```vue
<input class="form-control is-invalid">
<div class="invalid-feedback">Error message</div>

<input class="form-control is-valid">
<div class="valid-feedback">Success message</div>
```

---

## 🎨 Card Components

### Basic Card
```vue
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Content</p>
  </div>
</div>
```

### Card with Header/Footer
```vue
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-body">Body</div>
  <div class="card-footer">Footer</div>
</div>
```

### Responsive Card Padding
```vue
<div class="card">
  <!-- 1rem mobile, 1.5rem tablet, 2rem desktop -->
  <div class="card-body p-3 p-md-4 p-lg-5">
    Content
  </div>
</div>
```

---

## 🎯 Navigation Patterns

### Mobile Menu (Already Implemented)
```vue
<!-- AppHeader.vue -->
<MobileMenuButton @toggle="toggleMenu" />
<MobileMenu :is-open="isOpen" @close="closeMenu" />
```

### Desktop Navigation
```vue
<!-- Hidden on mobile, shown on tablet+ -->
<nav class="d-none d-md-flex">
  <RouterLink class="nav-link">Link</RouterLink>
</nav>
```

---

## 🎨 Layout Patterns

### Centered Container
```vue
<div class="container">
  <!-- Max-width with auto margins -->
</div>
```

### Full Width
```vue
<div class="container-fluid">
  <!-- 100% width -->
</div>
```

### Constrained Width
```vue
<div class="container" style="max-width: 800px;">
  <!-- Custom max-width -->
</div>
```

---

## 🎯 Accessibility

### Focus States
```css
/* Bootstrap handles this, but for custom: */
.custom-element:focus-visible {
  outline: 2px solid var(--color-primary-teal);
  outline-offset: 2px;
  border-radius: 0.25rem;
}
```

### ARIA Labels
```vue
<button aria-label="Close menu">
  <X :size="24" />
</button>

<nav aria-label="Main navigation">
  <!-- Nav content -->
</nav>
```

### Semantic HTML
```vue
<!-- Use proper HTML5 elements -->
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
```

---

## 🚀 Performance Tips

### 1. Use Bootstrap Utilities
```vue
<!-- ✅ Good: Bootstrap utility -->
<div class="d-flex justify-content-between">

<!-- ❌ Bad: Custom CSS -->
<div class="custom-flex-container">
```

### 2. Avoid Custom CSS
```vue
<!-- ✅ Good: Bootstrap classes -->
<div class="p-3 mb-4 bg-light rounded">

<!-- ❌ Bad: Inline styles -->
<div style="padding: 1rem; margin-bottom: 1.5rem;">
```

### 3. Use Responsive Classes
```vue
<!-- ✅ Good: Responsive -->
<div class="col-12 col-md-6">

<!-- ❌ Bad: Fixed width -->
<div style="width: 50%">
```

---

## 🎯 Common Mistakes to Avoid

### ❌ Don't Use Fixed Pixels
```css
/* Bad */
.element {
  width: 300px;
  padding: 20px;
}

/* Good */
.element {
  width: 100%;
  max-width: 18.75rem; /* 300px */
  padding: var(--spacing-lg);
}
```

### ❌ Don't Start with Desktop
```css
/* Bad - Desktop first */
.element {
  width: 50%;
}
@media (max-width: 768px) {
  .element {
    width: 100%;
  }
}

/* Good - Mobile first */
.element {
  width: 100%;
}
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}
```

### ❌ Don't Ignore Touch Targets
```css
/* Bad */
.button {
  height: 30px;
}

/* Good */
.button {
  min-height: 44px;
}
```

---

## 📚 Resources

### Bootstrap 5
- [Grid System](https://getbootstrap.com/docs/5.3/layout/grid/)
- [Utilities](https://getbootstrap.com/docs/5.3/utilities/spacing/)
- [Components](https://getbootstrap.com/docs/5.3/components/)

### Mobile-First
- [Mobile-First Design](https://www.lukew.com/ff/entry.asp?933)
- [Touch Targets](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

---

## 🎯 Checklist for New Components

- [ ] Use Bootstrap grid system
- [ ] Use Bootstrap utilities for spacing
- [ ] Ensure 44px+ touch targets on mobile
- [ ] Test on all breakpoints (360px - 1920px)
- [ ] Add proper focus states
- [ ] Use semantic HTML
- [ ] Add ARIA labels where needed
- [ ] Avoid custom CSS (use Bootstrap)
- [ ] Use CSS variables for colors
- [ ] Test keyboard navigation

---

## 💡 Pro Tips

1. **Start Mobile**: Design for 360px first, then enhance
2. **Use Bootstrap**: 90% of styling should be Bootstrap classes
3. **Touch Targets**: Always 44px+ on mobile
4. **Test Real Devices**: Emulators aren't enough
5. **Accessibility**: Focus states, ARIA labels, semantic HTML
6. **Performance**: Minimize custom CSS, use utilities
7. **Consistency**: Follow the design system

---

## 🎉 You're Ready!

With this guide, you can create mobile-first, responsive, accessible components that work perfectly across all devices. Remember: Bootstrap 5 does most of the heavy lifting, so use it! 🚀
