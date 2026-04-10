# Пути в проекте

## 🧠 Суть

Как правильно писать пути к файлам в разных местах проекта.

## 📋 Правило

| Где пишешь      | Путь                   | Пример                 |
| --------------- | ---------------------- | ---------------------- |
| `index.html`    | Относительно `src/`    | `css/style.css`        |
| CSS             | Относительно CSS файла | `../assets/img/bg.jpg` |
| JS              | Относительно JS файла  | `../utils/helpers.js`  |
| `public/` файлы | С ведущим `/`          | `/favicon.ico`         |

## 💻 Примеры

### В index.html

```html
<!-- CSS -->
<link rel="stylesheet" href="css/reset.css" />
<link rel="stylesheet" href="css/custom.css" />

<!-- JS (entry point с /) -->
<script type="module" src="/main.js"></script>

<!-- Картинки -->
<img src="assets/images/photo.jpg" alt="" />

<!-- Фавиконки из public/ -->
<link rel="icon" href="/favicon.ico" />
```

### В CSS

```css
/* Относительно css/custom.css */
background-image: url("../assets/images/bg.jpg");
font-family: url("../assets/fonts/inter.woff2");
```

### В JS

```js
// Относительно текущего файла
import { foo } from "../utils/helpers.js";
import Parallax from "../plugins/parallax.js";
```

## ⚠️ Чего НЕ делать

```html
<!-- ❌ Не абсолютные пути ОС -->
<img src="/home/user/project/src/assets/img/photo.jpg" />

<!-- ❌ Не ведущий слэш для локальных ассетов -->
<link rel="stylesheet" href="/css/custom.css" />
```

## 🔄 Hot reload — когда нужен рестарт

| Изменение        | Hot reload | Рестарт                  |
| ---------------- | ---------- | ------------------------ |
| HTML, CSS, JS    | ✓          | Не нужен                 |
| `vite.config.js` | ✗          | `Ctrl+C` → `npm run dev` |
| `uno.config.js`  | ✗          | `Ctrl+C` → `npm run dev` |

## 🔗 Связанные темы

- [Vite Config](/frontend/vite)
- [Структура проекта](/frontend/project-structure)
