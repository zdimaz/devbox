# Autoprefixer

## Online tool

Use **https://autoprefixer.github.io** to prefix plain CSS files (projects without a build system).

Paste your CSS on the left, enter the Browserslist query below, copy the result.

---

## Recommended Browserslist query

```
> 0.5%, last 2 versions, not dead, not IE 11, not op_mini all
```

What it removes compared to the default `> 0.2% and not dead`:
- **IE 11** — eliminates `-ms-flex`, `-ms-transform`, `-ms-filter`, `-ms-grid` and other IE-only noise
- **op_mini all** — eliminates Opera Mini prefixes
- **< 0.5% share** — drops ancient browser versions that still generate `-moz-flex`, `-o-flex`, `-webkit-flex`

---

## Modern-only query (when broad support is not needed)

```
last 2 Chrome versions, last 2 Firefox versions, last 2 Safari versions, last 2 Edge versions, last 2 iOS versions
```

Produces the cleanest output — almost no vendor prefixes except `-webkit-` for Safari-specific properties.

---

## `.browserslistrc` file (for projects with PostCSS / Vite)

Create `.browserslistrc` in the project root:

```
> 0.5%
last 2 versions
not dead
not IE 11
not op_mini all
```

Or set it in `package.json`:

```json
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "not dead",
    "not IE 11",
    "not op_mini all"
  ]
}
```

Vite and PostCSS pick up `.browserslistrc` automatically — no extra config needed.

---

## Properties that still need prefixing in 2024

Even with a modern query, autoprefixer will add prefixes for:

| Property | Prefix needed for |
|---|---|
| `mask-image` | `-webkit-` (Safari) |
| `clip-path` | `-webkit-` (older Safari) |
| `appearance` | `-webkit-` |
| `user-select` | `-webkit-` (Safari) |
| `backdrop-filter` | `-webkit-` (Safari) |

Everything else (`flex`, `grid`, `transform`, `transition`, `animation`) is safe without prefixes in modern browsers.
