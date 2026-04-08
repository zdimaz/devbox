# Оптимизация изображений

## 🧠 Суть
Современные форматы (WebP, AVIF) + lazy loading = быстрая загрузка страниц.

## ⚙️ Конвертация

### WebP (ImageMagick)
```bash
mogrify -format webp -quality 80 *.jpg
```

### AVIF (ffmpeg)
```bash
ffmpeg -i input.jpg -c:v libaom-av1 -crf 30 output.avif
```

### Пакетная конвертация (sharp)
```bash
npx sharp-cli -i "src/images/*" -o "dist/images" -f webp -q 80
```

## 💻 HTML implementation

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="description" loading="lazy" decoding="async">
</picture>
```

## 💻 Vite plugin

```js
// vite.config.js
import image from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    image({
      formats: ['webp', 'avif'],
      quality: 80
    })
  ]
})
```

## ⚠️ Подводные камни
- AVIF не поддерживается в Safari < 16 → всегда давай fallback
- `loading="lazy"` не работает для изображений выше fold
- Большие изображения → используй `decoding="async"`

## 🚀 Best Practice
1. Critical images (above fold) → preload
2. Остальные → lazy + async decoding
3. Всегда используй `<picture>` с fallback
4. SVG для иконок и простой графики

## 🔗 Связанные темы
- [Vite Config](/frontend/vite)
- [Производительность](/frontend/performance)
