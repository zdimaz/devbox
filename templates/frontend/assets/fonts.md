---
title: "Fonts"
---

# Fonts

## 🧠 Overview

Proper font loading: woff2, preload, font-display.

## ⚙️ Preload Critical Fonts

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

**Notes:**

- `as="font"` — required for fonts, without it the browser ignores the preload
- `type="font/woff2"` — helps the browser assign the correct loading priority
- `crossorigin` — required even for self-hosted fonts, otherwise the browser downloads the file twice (anonymous mode is default for fonts)
- Preload only above-the-fold fonts — the rest will load when CSS requests them

## 💻 @font-face

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-display: swap;
}
```

**font-display values:**

- `auto` — default, browser decides
- `block` — text is invisible until the font loads (FOIT)
- `swap` — system font shown first, then swapped (FOUT)
- `optional` — like swap, but no swap if font hasn't loaded in time

## ⚠️ Pitfalls

- `font-display: swap` → FOUT (text flashes on font swap)
- Don't preload all fonts → only those above the fold
- WOFF2 is the only format you need

## 🚀 Best Practice

1. WOFF2 only
2. Preload critical fonts
3. `font-display: swap`
4. Subset for non-Latin scripts (smaller file size)
