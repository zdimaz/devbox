# Шрифты

## 🧠 Суть
Оптимизация загрузки шрифтов: woff2, preload, font-display.

## 💻 Preload

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

## 💻 font-display

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```

## ⚠️ Подводные камни
- `font-display: swap` → FOUT (flash of unstyled text)
- Не preload все шрифты → только critical

## 🚀 Best Practice
1. WOFF2 формат
2. Preload для critical шрифтов
3. `font-display: swap`
4. Subset для кириллицы

## 🔗 Связанные темы
- [Vite Config](/frontend/vite)
- [Производительность](/frontend/performance)
