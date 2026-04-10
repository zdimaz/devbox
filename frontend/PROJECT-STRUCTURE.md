# Project Structure

```
your-project/
├── public/                 ← static files copied as-is to dist root
│   ├── favicon.ico
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   └── site.webmanifest
│
├── client/                 ← Vite project root (run npm install / npm run dev here)
│   ├── index.html
│   ├── main.js             ← entry point: import 'virtual:uno.css'
│   ├── vite.config.js
│   ├── uno.config.js
│   ├── package.json
│   │
│   ├── css/
│   │   ├── reset.min.css
│   │   └── custom.css      ← CSS variables, theme accents, custom rules
│   │
│   ├── js/
│   │   ├── script.core.js
│   │   └── script.plugins.js
│   │
│   ├── plugins/
│   │   └── parallax.js
│   │
│   └── assets/
│       ├── fonts/
│       ├── img/
│       └── svg/
│
└── dist/                   ← build output (generated, do not edit)
    ├── index.html          ← from client/index.html (asset links auto-hashed)
    ├── assets/
    │   ├── main-[hash].js  ← from client/main.js + all JS imports
    │   ├── main-[hash].css ← UnoCSS + CSS imported in JS
    │   └── img-[hash].*    ← images imported via JS (auto-hashed)
    ├── favicon.ico         ← from public/ (no hash, no processing)
    ├── favicon-32x32.png
    ├── favicon-16x16.png
    ├── apple-touch-icon.png
    ├── android-chrome-*.png
    └── site.webmanifest
```

## What needs configuration vs what is automatic

| | Needs config | Automatic |
|---|---|---|
| `public/` → `dist/` root | — | ✓ always copied as-is |
| UnoCSS → `dist/assets/*.css` | `uno.config.js` | ✓ bundled via `virtual:uno.css` |
| JS → `dist/assets/*.js` | — | ✓ all imports bundled from `main.js` |
| Images via `<img src="">` in HTML | — | ✓ copied, path rewritten |
| Images imported in JS | — | ✓ hashed, optimized |
| Fonts via `@font-face` in CSS | — | ✓ hashed, bundled |
| `css/custom.css` | link in `index.html` | ✓ bundled if linked |
| `css/reset.min.css` | link in `index.html` | ✓ bundled if linked |
| Hashed filenames | — | ✓ always in `dist/assets/` |

## Rules

- `index.html` always stays in `client/` root — Vite requires it as entry point
- `public/` files are served at `/` during dev and copied to `dist/` root on build
- `assets/` is for source files referenced via HTML or imported in JS
- Files in `assets/` processed by Vite get hashed filenames in `dist/`
- Files in `public/` are never hashed — use for favicon, manifest, robots.txt
