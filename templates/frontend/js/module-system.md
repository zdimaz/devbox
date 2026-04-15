# JS Module System

## 🧠 Essence

Modular script initialization system for Vite + static projects. Separates custom modules from third-party vendor plugins, with three timing types: `ready`, `load`, `lazy`.

No `DOMContentLoaded` wrapper needed — `script type="module"` equals `defer`, meaning DOM is already ready when the script runs.

## ⚙️ Structure

```
client/js/
├── index.js                 # Main orchestrator — single entry point
├── initScripts.js           # @deprecated backwards compatibility
├── modules/                 # Custom modules (menu, modals, tabs)
│   └── index.js             # Modules registry with timing
└── vendor/                  # Third-party plugins (Swiper, GSAP)
    └── index.js             # Plugins registry with timing
```

## 📁 File Responsibilities

### `main.js` — Entry Point

Only three lines. Never changes when adding modules.

```js
import "virtual:uno.css";
import { init } from "./js/index.js";

init();
```

### `js/index.js` — Main Orchestrator

Single `DOMContentLoaded` elimination. Runs `ready` modules immediately, `load` modules wait for `window.load`.

```js
import { init as initModules } from "./modules/index.js";
import { init as initVendor } from "./vendor/index.js";

export function init() {
  // Ready — DOM is ready, run immediately
  initModules("ready");
  initVendor("ready");

  // Load — wait for full resource loading (images, fonts)
  window.addEventListener("load", () => {
    initModules("load");
    initVendor("load");
  });
}
```

### `modules/index.js` — Custom Modules Registry

```js
const MODULES = [
  // Ready — UI components, menu, modals
  { name: 'mobileMenu', load: () => import('./mobileMenu.js'), timing: 'ready' },
  { name: 'modals', load: () => import('./modals.js'), timing: 'ready' },

  // Load — sliders, lightboxes (depend on resource dimensions)
  { name: 'swiper', load: () => import('./swiper.js'), timing: 'load' },

  // Lazy — heavy libraries, on demand
  { name: 'chart', load: () => import('./chart.js'), timing: 'lazy' },
];

export async function init(timing = "ready") {
  const modules = MODULES.filter((m) => m.timing === timing);
  for (const { name, load } of modules) {
    try {
      const { init } = await load();
      init?.();
    } catch (error) {
      console.error(`[modules] Failed to load "${name}":`, error);
    }
  }
}
```

### `vendor/index.js` — Third-Party Plugins Registry

Same structure, separate registry for external libraries.

```js
const PLUGINS = [
  { name: 'gsap', load: () => import('./gsap.js'), timing: 'ready' },
  { name: 'swiper', load: () => import('./swiper.js'), timing: 'load' },
];

export async function init(timing = "ready") { /* same logic */ }
```

## ⏱ Timing Types

| Type | When | For | Example |
|------|------|-----|---------|
| **ready** | Immediately (DOM ready) | UI components, menu, modals, validation | `mobileMenu`, `modals`, `tabs` |
| **load** | `window.load` event | Sliders, lightboxes — depend on image sizes | `swiper`, `lightbox`, `masonry` |
| **lazy** | On user action | Heavy libraries not critical for UX | `chart`, `map`, `videoPlayer` |

## 📝 How to Add a Module

### 1. Create module file

```js
// js/modules/mobileMenu.js
export function init() {
  const menu = document.querySelector(".mobile-menu");
  if (!menu) return; // guard — skip if element missing

  // menu logic
}
```

### 2. Register in registry

```js
// js/modules/index.js
const MODULES = [
  { name: 'mobileMenu', load: () => import('./mobileMenu.js'), timing: 'ready' },
];
```

### 3. Done — no other files need changes

## ⚠️ Pitfalls

- **Don't wrap module `init()` in `DOMContentLoaded`** — orchestrator already handles timing
- **Always add guard checks** — `if (!document.querySelector(...)) return` prevents errors on pages without the element
- **Keep modules isolated** — each module exports only `init()`, no global state
- **Use lazy for heavy libs** — don't load charts/maps until user actually needs them

## 🚀 Best Practice

### Module Template

```js
/**
 * @file modules/example.js
 * @description Brief description of what this module does.
 */

export function init() {
  const el = document.querySelector(".example");
  if (!el) return;

  // initialization logic
}
```

### Vendor Plugin Template

```js
/**
 * @file vendor/swiper.js
 * @description Swiper slider initialization.
 */

export async function init() {
  const el = document.querySelector(".swiper");
  if (!el) return;

  const Swiper = (await import("swiper")).default;
  new Swiper(".swiper", {
    loop: true,
    pagination: { el: ".swiper-pagination" },
  });
}
```

## 🔗 Related Topics

- [Vite](/frontend/build/vite)
- [UnoCSS](/frontend/unocss/css-functions)
