---
title: "Производительность"
---

# Производительность

## 🧠 Суть

Чеклист оптимизации frontend-проекта.

## ⚙️ Чеклист

- [ ] Минификация JS/CSS
- [ ] Сжатие изображений (webp/avif)
- [ ] Lazy loading для изображений
- [ ] Preload critical ресурсов
- [ ] Code splitting
- [ ] Кеширование

## 💻 Code Splitting (Vite)

```js
// Динамический импорт
const module = await import("./heavy-module.js");
```

## 💻 Performance API

```js
// Измерение загрузки
const perf = performance.getEntriesByType("navigation")[0];
console.log("Load time:", perf.loadEventEnd - perf.startTime);
```

## ⚠️ Подводные камни

- Не оптимизируй раньше времени
- Измеряй перед оптимизацией
- Lighthouse — твой друг

## 🚀 Best Practice

1. Сначала измеряй (Lighthouse)
2. Оптимизируй biggest wins
3. Мониторь в production
