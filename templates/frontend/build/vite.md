---
title: "Vite"
---

# Vite Config

## 🧠 Суть

Базовый конфиг Vite. Объясняю каждую опцию.

## ⚙️ Минимальный конфиг

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // куда собирать
    sourcemap: true, // для отладки
    minify: "terser", // сжатие JS
  },
  server: {
    open: true, // авто-открытие браузера
    port: 3000,
  },
});
```

**Пояснения:**

- `outDir` — относительно `root` (по умолчанию `.`). Не нужен `../`
- `sourcemap` — полезен в деве, в проде можно `false`
- `minify` — `'esbuild'` (дефолт) быстрее, `'terser'` лучше сжимает

## ⚙️ Мульти-entry (несколько точек входа)

Когда нужно несколько JS-файлов — для разных страниц или бандлов:

```js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/main.js"),
        admin: resolve(__dirname, "src/admin.js"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].[hash].js",
      },
    },
  },
});
```

**Пояснения:**

- `__dirname` — глобальная Node.js переменная, путь к текущей директории конфига
- `resolve(__dirname, 'src/main.js')` → абсолютный путь `/твой/проект/src/main.js`
- Без абсолютного пути — Rollup не найдёт файлы

## ⚙️ Для Craft CMS

Craft читает `manifest.json` → получает пути к собранным файлам:

```js
export default defineConfig({
  build: {
    manifest: true, // создаёт manifest.json для Twig
    outDir: "web/dist", // публичная папка Craft
  },
});
```

## ⚠️ Подводные камни

- `manifest: true` обязателен для Craft — иначе Twig не найдёт бандлы
- При прокси на дев-сервере добавь `server.origin`
- Пути в `input` — только абсолютные
