# Migration to Vite + UnoCSS

## Structure

```
your-project/
├── public/        ← favicon, site.webmanifest (copied as-is to dist root)
└── client/        ← copy your project here, then add the 4 Vite files
    ├── package.json
    ├── vite.config.js
    ├── uno.config.js
    ├── main.js
    ├── index.html
    ├── css/
    ├── js/
    └── ...
```

## Steps

### 1. Copy project files into `client/`

Copy your existing HTML, CSS, JS, images into `client/`.

### 2. Install dependencies

```bash
cd client
npm install
```

### 3. Update `index.html`

Remove the static UnoCSS link and add `main.js`:

```html
<!-- Remove: -->
<link rel="stylesheet" href="css/uno.css" />

<!-- Add (anywhere in <head> or before </body>): -->
<script type="module" src="/main.js"></script>
```

All other `<script src="...">` tags must also have `type="module"` — Vite cannot bundle scripts without it:

```html
<!-- Before: -->
<script src="js/script.core.js"></script>

<!-- After: -->
<script type="module" src="js/script.core.js"></script>
```

Keep `reset.min.css` and `custom.css` links as-is.

### 4. Update `uno.config.js`

Adjust colors, shortcuts, and variants to match the project theme.

### 5. Run

```bash
npm run dev      # dev server with hot reload
npm run build    # production build → ../dist
```

---

---

## Build output (`npm run build` → `../dist`)

```
dist/
├── index.html              ← processed HTML (hashed asset links)
├── assets/
│   ├── main-[hash].js      ← bundled JS (main.js + imports)
│   └── main-[hash].css     ← bundled CSS (UnoCSS + any imported CSS)
├── favicon.ico             ← from public/
├── favicon-32x32.png       ← from public/
├── favicon-16x16.png       ← from public/
├── apple-touch-icon.png    ← from public/
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest        ← from public/
```

### What goes where

| Source | Output |
|--------|--------|
| `client/index.html` | `dist/index.html` |
| `client/main.js` + imports | `dist/assets/main-[hash].js` |
| `virtual:uno.css` + `css/*.css` imported via JS | `dist/assets/main-[hash].css` |
| `client/images/`, `client/fonts/` (static, not imported) | ❌ NOT copied automatically |
| `public/*` | `dist/*` (root, as-is, no hash) |

### Static assets (images, fonts)

Files referenced in HTML as plain paths (e.g. `<img src="images/photo.jpg">`) are **not** processed by Vite — copy them manually or reference via JS import.

To have Vite process and hash them, import in JS:
```js
import photo from './images/photo.jpg';
```

Or put them in `public/` — they will be copied to `dist/` root as-is.

---

## Notes

- `vite.config.js` sets `publicDir: '../public'` and `outDir: '../dist'`
- After build, deploy the `dist/` folder
- No more manual `node generate-css.mjs` — Vite handles everything
- Do **not** add `@unocss/vite` separately — it is already included in the `unocss` package
- Use `presetUno` (not `presetWind4`) — `presetWind4` uses CSS variables for font families, breaking `font-body` and similar utilities
- `dark:` is a reserved variant in `presetUno` (maps to dark mode). To use `dark:` as a theme variant, configure: `presetUno({ dark: { dark: ".theme-dark" } })`
