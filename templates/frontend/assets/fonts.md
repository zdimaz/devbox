---
title: "Шрифты"
---

# Шрифты

## 🧠 Суть

Правильная загрузка шрифтов: woff2, preload, font-display.

## ⚙️ Preload критичных шрифтов

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

**Пояснения:**

- `as="font"` — обязательно для шрифтов, без этого браузер проигнорирует preload
- `type="font/woff2"` — помогает браузеру выбрать правильный приоритет загрузки
- `crossorigin` — обязателен даже для своих шрифтов, иначе браузер скачает файл дважды (anonymous режим по умолчанию для шрифтов)
- Preload только для шрифтов первого экрана — остальные загрузятся когда CSS их потребует

## 💻 @font-face

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-display: swap;
}
```

**font-display значения:**

- `auto` — дефолт, браузер сам решает
- `block` — текст невидим пока шрифт не загрузится (FOIT)
- `swap` — показывается системный шрифт, потом подменяется (FOUT)
- `optional` — как swap, но без подмены если шрифт ещё не загрузился

## ⚠️ Подводные камни

- `font-display: swap` → FOUT (текст мигает при подмене)
- Не preload все шрифты → только те что на первом экране
- WOFF2 — единственный формат, остальные не нужны

## 🚀 Best Practice

1. Только WOFF2
2. Preload для критичных шрифтов
3. `font-display: swap`
4. Subset для кириллицы (меньше файл)
