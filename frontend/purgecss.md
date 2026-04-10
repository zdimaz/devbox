# PurgeCSS

Удаляет неиспользуемые CSS-правила, уменьшая размер файлов.

## Установка

```bash
npm i --save-dev purgecss
```

## Базовое использование

```js
import PurgeCSS from "purgecss";

const results = await new PurgeCSS().purge({
  content: ["**/*.html"],
  css: ["**/*.css"],
});
```

Результат — массив объектов `{ file, css }` с очищенным CSS.

## Интеграция в Vite

```js
import { PurgeCSS } from "purgecss";
import fs from "fs";
import path from "path";

function purgecssPlugin() {
  return {
    name: "purgecss",
    async buildStart() {
      const outputDir = path.resolve(__dirname, "css-purged");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const results = await new PurgeCSS().purge({
        content: ["**/*.html", "**/*.js"],
        css: ["**/*.css"],
      });

      results.forEach((r) => {
        if (r.file && r.css) {
          const out = path.join(outputDir, path.basename(r.file));
          fs.writeFileSync(out, r.css, "utf8");
        }
      });
    },
  };
}
```

## Ключевые опции

| Опция             | Зачем                                              |
| ----------------- | -------------------------------------------------- |
| `content`         | Файлы, где ищутся CSS-селекторы (HTML, JS)         |
| `css`             | CSS-файлы для очистки                              |
| `keyframes: true` | Сохраняет `@keyframes` даже без прямого упоминания |
| `fontFace: true`  | Сохраняет `@font-face` правила                     |
| `variables: true` | Сохраняет CSS custom properties (`--var`)          |
| `safelist`        | Селекторы, которые нельзя удалять                  |

## Safelist

Для динамических классов (carousel, bootstrap, JS-манипуляции):

```js
safelist: {
  standard: [
    "active", "show", "open",
    /^col-/, /^order-/          // regex покрит все варианты
  ],
  greedy: [/^embla/, /^carousel/] // жадное совпадение
}
```

- **standard** — точное совпадение или regex
- **greedy** — совпадение даже внутри составных селекторов (`.embla__slide`)

## Конфиг Vite

```js
export default defineConfig({
  plugins: [purgecssPlugin()],
  server: {
    watch: {
      ignored: ["**/css-purged/**"], // не перезагружать при изменении purged CSS
    },
  },
});
```

## Проверка размера

```json
{
  "scripts": {
    "build:stats": "npm run build && echo '📊 Итоговый размер:' && du -sh dist/assets/*.css 2>/dev/null || true"
  }
}
```

```bash
npm run build:stats
```

## Почему не `vite-plugin-purgecss`

`purgecss` как библиотека даёт полный контроль:

- Чистит CSS **до** билда Vite
- Пишет файлы в отдельную папку
- Не конфликтует с CSS-обработчиками Vite
