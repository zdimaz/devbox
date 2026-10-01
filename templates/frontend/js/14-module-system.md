# Module System — система инициализации модулей

> Продвинутая тема. Поймёшь глубже после Vite/Next.js — тогда перечитай.

## 🧠 Суть

Модульная система инициализации скриптов для Vite + статических проектов.
Разделяет собственные модули и сторонние плагины (vendor), с тремя типами тайминга:
`ready`, `load`, `lazy`.

Обёртка `DOMContentLoaded` не нужна — `script type="module"` работает как `defer`,
то есть DOM уже готов, когда скрипт выполняется.

## ⚙️ Структура

```
client/js/
├── index.js                 # Главный оркестратор — единая точка входа
├── initScripts.js           # @deprecated — обратная совместимость
├── modules/                 # Собственные модули (menu, modals, tabs)
│   └── index.js             # Реестр модулей с таймингом
└── vendor/                  # Сторонние плагины (Swiper, GSAP)
    └── index.js             # Реестр плагинов с таймингом
```

## 📁 Ответственность файлов

### `main.js` — точка входа

Только три строки. Не меняется при добавлении модулей.

```js
import "virtual:uno.css";
import { init } from "./js/index.js";

init();
```

### `js/index.js` — оркестратор

```js
import { init as initModules } from "./modules/index.js";
import { init as initVendor } from "./vendor/index.js";

export function init() {
  // Ready — DOM готов, запускаем сразу
  initModules("ready");
  initVendor("ready");

  // Load — ждём полной загрузки ресурсов (картинки, шрифты)
  window.addEventListener("load", () => {
    initModules("load");
    initVendor("load");
  });
}
```

### `modules/index.js` — реестр собственных модулей

```js
const MODULES = [
  // Ready — UI-компоненты
  { name: 'mobileMenu', load: () => import('./mobileMenu.js'), timing: 'ready' },
  { name: 'modals',     load: () => import('./modals.js'),     timing: 'ready' },

  // Load — слайдеры, галереи (зависят от размеров картинок)
  { name: 'swiper', load: () => import('./swiper.js'), timing: 'load' },

  // Lazy — тяжёлые библиотеки по требованию
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

## ⏱ Типы тайминга

| Тип | Когда | Для чего | Пример |
|------|------|-----|---------|
| **ready** | сразу (DOM готов) | UI-компоненты, меню, модалки, валидация | `mobileMenu`, `modals`, `tabs` |
| **load** | событие `window.load` | слайдеры, лайтбоксы — зависят от размеров картинок | `swiper`, `lightbox`, `masonry` |
| **lazy** | по действию пользователя | тяжёлые библиотеки, некритичные для UX | `chart`, `map`, `videoPlayer` |

## 📝 Как добавить модуль

### 1. Создать файл модуля

```js
// js/modules/mobileMenu.js
export function init() {
  const menu = document.querySelector(".mobile-menu");
  if (!menu) return; // guard — пропускаем, если элемента нет на странице

  // логика меню
}
```

### 2. Зарегистрировать в реестре

```js
// js/modules/index.js
const MODULES = [
  { name: 'mobileMenu', load: () => import('./mobileMenu.js'), timing: 'ready' },
];
```

### 3. Готово — другие файлы не трогаем

## ⚠️ Подводные камни

- **Не оборачивай `init()` модуля в `DOMContentLoaded`** — оркестратор уже управляет таймингом
- **Всегда guard-проверки** — `if (!document.querySelector(...)) return` спасает от ошибок на страницах без элемента
- **Модули изолированы** — каждый экспортирует только `init()`, без глобального состояния
- **Lazy для тяжёлых библиотек** — не грузи charts/maps, пока пользователь реально не дошёл до них

## 🚀 Шаблон модуля

```js
/**
 * @file modules/example.js
 * @description Краткое описание, что делает модуль.
 */

export function init() {
  const el = document.querySelector(".example");
  if (!el) return;

  // логика инициализации
}
```

```js
/**
 * @file vendor/swiper.js
 * @description Инициализация Swiper-слайдера.
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

> Обновлено: 01.10.2026
