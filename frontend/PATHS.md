# Paths Guide

## Dev vs Build

```
npm run dev    ← live changes, no build needed
npm run build  ← deploy only
```

Vite serves `client/` as root in dev.
On build it rewrites asset paths to hashed filenames in `dist/assets/`.
**Same paths work in both modes — no changes needed.**

### What requires a server restart

| Change | Hot reload | Restart needed |
|--------|-----------|---------------|
| `index.html` | ✓ | — |
| `css/*.css` | ✓ | — |
| `js/*.js` | ✓ | — |
| `uno.config.js` | ✗ | ✓ `Ctrl+C` → `npm run dev` |
| `vite.config.js` | ✗ | ✓ `Ctrl+C` → `npm run dev` |

---

## How to write paths

### In `index.html`

Always relative to `client/` root:

```html
<link rel="stylesheet" href="css/reset.min.css" />
<link rel="stylesheet" href="css/custom.css" />
<script type="module" src="/main.js"></script>
<img src="assets/img/photo.jpg" alt="" />
```

### In `css/custom.css`

Relative to the CSS file location:

```css
background-image: url("../assets/img/bg.jpg");
background-image: url("../assets/svg/icon.svg");
```

### In `js/*.js`

Relative to the JS file or use root-relative with `/`:

```js
import Parallax from '../plugins/parallax.js';
```

---

## What NOT to do

```html
<!-- No absolute paths -->
<img src="/home/user/project/assets/img/photo.jpg" />

<!-- No leading slash for local assets (breaks on nested pages) -->
<link rel="stylesheet" href="/css/custom.css" />

<!-- Exception: main.js entry can use / -->
<script type="module" src="/main.js"></script>
```

---

## Public folder paths

Files in `public/` are served at `/` in dev and copied to `dist/` root on build.
Reference them with a leading `/`:

```html
<link rel="icon" href="/favicon.ico" />
<link rel="manifest" href="/site.webmanifest" />
```

---

## Vite aliases (`@`)

```js
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
},
```

**Not needed here.** Aliases like `@/components/foo.js` are a Vue/React pattern for deep module trees.
This project uses simple relative imports — no alias required:

```js
import Parallax from '../plugins/parallax.js'; // ✓ just use relative paths
```

---

## Path cheatsheet

| File | References | Path |
|------|-----------|------|
| `client/index.html` | `client/css/custom.css` | `css/custom.css` |
| `client/index.html` | `client/assets/img/bg.jpg` | `assets/img/bg.jpg` |
| `client/index.html` | `client/js/script.core.js` | `js/script.core.js` |
| `client/css/custom.css` | `client/assets/img/bg.jpg` | `../assets/img/bg.jpg` |
| `client/css/custom.css` | `client/assets/fonts/font.woff2` | `../assets/fonts/font.woff2` |
| `client/index.html` | `public/favicon.ico` | `/favicon.ico` |
