# Vite Config

## 🧠 Суть
Базовый конфиг Vite для frontend-проектов. Быстрый старт, hot reload, оптимизация.

## ⚙️ Базовый конфиг

```js
// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js')
    }
  },
  server: {
    open: true,
    port: 3000
  }
})
```

## 💻 Мульти-entry (для Craft CMS)

```js
// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
        admin: resolve(__dirname, 'src/admin.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
```

## ⚠️ Подводные камни
- Craft CMS не понимает ES modules из коробки → используй `build.manifest`
- При proxy на dev-сервере нужен `server.origin`
- Пути к ассетам должны быть абсолютными

## 🚀 Best Practice

```js
export default defineConfig({
  build: {
    manifest: true, // для Twig integration
    minify: 'terser',
    sourcemap: true
  },
  plugins: [
    // добавить по необходимости
  ]
})
```

## 🔗 Связанные темы
- [Оптимизация изображений](/frontend/images)
- [Шрифты](/frontend/fonts)
