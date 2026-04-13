---
title: "Изображения"
---

# Оптимизация изображений

## 🧠 Суть

Современные форматы (webp, avif) + lazy loading = быстрая загрузка.

## ⚙️ Установка

### Конвертация в CLI

```bash
# WebP (ImageMagick)
sudo pacman -S imagemagick
mogrify -format webp -quality 80 *.jpg

# AVIF (ffmpeg)
sudo pacman -S ffmpeg
ffmpeg -i input.jpg -c:v libaom-av1 -crf 30 output.avif
```

### Пакетная обработка (sharp)

```bash
npm install -D sharp

# или глобально
npm i -g sharp-cli

# Конвертация папки
npx sharp-cli -i "src/images/*" -o "dist/images" -f webp -q 80
```

### Vite плагин

```bash
npm i -D vite-plugin-image-optimizer
```

```js
// vite.config.js
import { defineConfig } from "vite";
import image from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    image({
      formats: ["webp", "avif"],
      quality: 80,
    }),
  ],
});
```

## 💻 HTML: тег picture

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="описание" loading="lazy" decoding="async" />
</picture>
```

**Пояснения:**

- Браузер берёт первый поддерживаемый формат
- `loading="lazy"` — загрузка при скролле
- `decoding="async"` — не блокирует рендер

## ⚠️ Подводные камни

- AVIF нет в Safari < 16 → всегда давай fallback в jpg
- `loading="lazy"` не для изображений выше fold (первый экран)
- Большие изображения → обязательно `decoding="async"`

## 🚀 Best Practice

1. Критичные изображения (выше fold) → preload
2. Остальные → lazy + async decoding
3. Всегда `<picture>` с fallback
4. SVG для иконок и простой графики
