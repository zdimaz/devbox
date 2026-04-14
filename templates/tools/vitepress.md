---
title: "VitePress"
---

# VitePress

Ссылка: [https://vitepress.dev/](https://vitepress.dev/)

## 🧠 Суть

Генератор статических сайтов на Vite + Vue. Используется для документации (Vue, Vite, Tailwind и др.).

## ⚡ Быстрый старт

```bash
npm init vitepress
npm run docs:dev
```

## ⚙️ Структура

```
project/
├── .vitepress/
│   ├── config.js    # конфигурация
│   ├── nav-helper.js
│   └── public/      # статические файлы
└── templates/       # markdown-страницы
```

## 💻 Ключевые конфиги

```js
// .vitepress/config.js
export default {
  title: "My Docs",
  base: "/my-docs/",       // для деплоя на Pages
  srcDir: "./src",         // где лежат .md
  publicDir: "./public",   // статические файлы
  themeConfig: {
    logo: "/logo.svg",
    nav: [...],
    sidebar: [...],
    socialLinks: [...],
  },
};
```

## 💻 Frontmatter

```md
---
layout: home
hero:
  name: "My Project"
  text: "Awesome docs"
  tagline: Built with VitePress
  image:
    src: /logo.svg
    alt: Logo
---
```

## 💻 Sidebar & Nav

VitePress поддерживает:
- Ручную настройку в `config.js`
- Динамическую генерацию из файловой структуры

## ⚠️ Подводные камни

- `base` нужно указывать вручную в `head` (не автоподставляется)
- Файлы из `publicDir` доступны по `/` без префикса `base`
- `srcDir` с кастомным путём может сломать поиск `publicDir`

## 🚀 Best Practice

1. `publicDir` — в корне проекта (дефолт)
2. `base` только для деплоя на подпуть
3. Пути в `head` — от корня: `/favicon.ico`
4. Hero-картинка — SVG для чёткости на любом DPI
