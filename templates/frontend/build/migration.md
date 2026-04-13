---
title: "Миграция"
---

# Миграция на Vite + UnoCSS

## 🧠 Суть

Как перенести существующий проект на Vite.

## 📋 Шаги

### 1. Скопируй файлы в `src/`

```
проект/
├── public/        ← фавиконки, manifest
└── src/           ← HTML, CSS, JS, картинки
    ├── index.html
    ├── css/
    └── js/
```

### 2. Добавь конфиги

```
src/
├── package.json
├── vite.config.js
├── uno.config.js
└── main.js        ← точка входа: import 'virtual:uno.css'
```

### 3. Обнови index.html

```html
<!-- Убери статический UnoCSS -->
<!-- <link rel="stylesheet" href="css/uno.css"> -->

<!-- Добавь main.js -->
<script type="module" src="/main.js"></script>
```

**Важно:** все `<script>` должны иметь `type="module"` — иначе Vite не забандлит.

### 4. Установи и запусти

```bash
npm install
npm run dev
```

```bash
npm run build
```

- `dev` — дев-сервер
- `build` — продакшен сборка

## ⚠️ Подводные камни

- `presetUno` используй, не `presetWind4` (ломает шрифты)
- `dark:` зарезервирован — для кастомной темы настрой в конфиге
- Статические файлы (картинки в HTML) → клади в `public/`
