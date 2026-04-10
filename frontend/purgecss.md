# PurgeCSS

## 🧠 Суть

Удаляет неиспользуемые CSS-правила → меньше размер файлов.

## ⚙️ Установка

```bash
npm i -D purgecss
```

## 💻 Базовое использование

```js
import { PurgeCSS } from "purgecss";

const results = await new PurgeCSS().purge({
  content: ["src/**/*.html", "src/**/*.js"], // где ищем классы
  css: ["src/**/*.css"], // что чистим
  keyframes: true, // сохраняем @keyframes
  fontFace: true, // сохраняем @font-face
  variables: true, // сохраняем CSS переменные (--var)
});
```

## 💻 Safelist (исключения)

Классы которые НЕ удалять — для динамических (JS, carousel):

```js
safelist: {
  standard: [
    'active', 'show', 'open',
    /^col-/, /^order-/        // regex для всех вариантов
  ],
  greedy: [/^embla/, /^carousel/]  // даже в составных селекторах
}
```

## 💻 Vite плагин

```js
// vite.config.js
import { PurgeCSS } from "purgecss";
import fs from "fs";
import path from "path";

function purgecssPlugin() {
  return {
    name: "purgecss",
    async closeBundle() {
      const results = await new PurgeCSS().purge({
        content: ["dist/**/*.html", "dist/**/*.js"],
        css: ["dist/assets/*.css"],
        output: "dist/purged",
      });
    },
  };
}

export default defineConfig({
  plugins: [purgecssPlugin()],
});
```

## ⚠️ Подводные камни

- PurgeCSS не видит классы добавленные через JS → safelist
- Не чисти CSS модули — они уже изолированы
- Проверяй результат — можно удалить нужные стили

## 🚀 Best Practice

1. UnoCSS/Tailwind → уже встроен tree-shaking, PurgeCSS не нужен
2. Обычный CSS → PurgeCSS полезен
3. Всегда проверяй safelist

## 🔗 Связанные темы

- [CSS Функции](/frontend/css-functions)
- [Autoprefixer](/frontend/autoprefixer)
