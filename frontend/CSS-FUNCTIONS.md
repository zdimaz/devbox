# UnoCSS CSS Functions

Available via `transformerDirectives` — works in any CSS file processed by Vite.

---

## theme()

Access design tokens from `uno.config.js` directly in CSS values.

### Syntax
```css
theme('key.subkey')
```

### Colors
```css
.element {
  color:            theme('colors.orange');      /* #ee732f */
  background-color: theme('colors.neutral');     /* #404040 */
  border-color:     theme('colors.red');         /* #f74c55 */
  scrollbar-color:  theme('colors.orange') theme('colors.muted');
}
```

### Font sizes
```css
.element {
  font-size: theme('fontSize.3');   /* 1.25rem / 20px */
  font-size: theme('fontSize.5');   /* 2.25rem / 36px */
}
```

### Spacing / breakpoints
```css
.element {
  max-width: theme('breakpoints.xl');   /* 80rem */
  padding:   theme('spacing.4');        /* 1rem */
}
```

---

## screen()

Generate media queries from breakpoints defined in `uno.config.js`.

### Breakpoints (from config)
| Name | Value  | px     |
|------|--------|--------|
| sm   | 30rem  | 480px  |
| md   | 48rem  | 768px  |
| lg   | 64rem  | 1024px |
| xl   | 80rem  | 1280px |
| 2xl  | 96rem  | 1536px |

### min-width (mobile-first, default)
```css
@screen md { ... }
/* → @media (min-width: 48rem) */
```

### max-width (desktop-first)
```css
@screen lt-md { ... }
/* → @media (max-width: 47.9375rem) */

@screen lt-xl { ... }
/* → @media (max-width: 79.9375rem) */
```

### min + max range
```css
@screen md-lg { ... }  /* not in UnoCSS — use manual instead */

/* manual range: */
@media (min-width: 48rem) and (max-width: 64rem) {
  .element { ... }
}
```

### Examples
```css
/* mobile-first */
.element { display: block; }

@screen md {
  .element { display: flex; }
}

/* desktop-first */
.sidebar { display: flex; }

@screen lt-md {
  .sidebar { display: none; }
}
```

---

## Real-world example — scrollbar

```css
html {
  scrollbar-color: theme('colors.orange') theme('colors.muted');
  scrollbar-width: thin;
}

::-webkit-scrollbar       { @apply size-2; }
::-webkit-scrollbar-track { background: theme('colors.muted'); }
::-webkit-scrollbar-thumb { background: theme('colors.orange'); }
```

---

## Notes

- Keys match exactly what is in `uno.config.js` → `theme`
- Nested: `colors.orange`, `fontSize.3`, `breakpoints.md`
- `theme()` is resolved at build time — no runtime cost
- `@screen` requires `transformerDirectives()` in config
