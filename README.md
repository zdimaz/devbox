# 📦 DevBox

> Личная база знаний + dev platform

Быстро искать решения, переиспользовать между проектами, деплоить как документацию.

---

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Локальный dev-сервер
npm run docs:dev

# Сборка для продакшена
npm run docs:build

# Превью собранного сайта
npm run docs:preview
```

После `npm run docs:dev` откроется `http://localhost:5173`

---

## 📁 Структура

```
devbox/
├── index.md              # Главная страница
├── frontend/             # Vite, изображения, шрифты, performance
├── craft/                # Craft CMS: структура, Twig, компоненты
├── snippets/             # Готовые решения: JS, PHP, Twig
├── linux/                # Arch setup, оптимизация
├── templates/            # Стартовые шаблоны
└── .vitepress/           # Конфиг VitePress
```

---

## 📝 Как добавить новую страницу

1. Создай файл в нужной папке, например `frontend/fonts.md`
2. Используй стандартный формат:

```markdown
# Название

## 🧠 Суть

Коротко что это и зачем

## ⚙️ Как использовать

Шаги / команды

## 💻 Код

\`\`\`js
// example
\`\`\`

## ⚠️ Подводные камни

- проблема 1
- проблема 2

## 🚀 Best Practice

...

## 🔗 Связанные темы

- [ссылка](/путь)
```

3. **(необязательно)** Добавь в sidebar для навигации:

```js
// .vitepress/config.js
'/frontend/': [
  { text: 'Vite Config', link: '/frontend/vite' },
  { text: 'Моя страница', link: '/frontend/fonts' },  // ← добавь сюда
]
```

> **Без sidebar** страница тоже работает. Просто не будет видна в меню.
> Прямая ссылка: `http://localhost:5173/frontend/fonts`

4. Закоммить:

```bash
git add .
git commit -m "[docs-frontend] add fonts guide

Why:
Need reusable font optimization pattern

Changes:
- added woff2 preload guide
- added font-display examples"
```

---

## 🌐 Deploy на GitHub Pages

### 1. Создай репозиторий на GitHub

```bash
git remote add origin https://github.com/yourusername/devbox.git
git push -u origin master
```

### 2. Включить Pages

Settings → Pages → Source: **GitHub Actions**

### 3. Workflow сделает всё сам

После push на `master`:

- автоматическая сборка
- деплой на GitHub Pages
- ссылка: `https://yourusername.github.io/devbox/`

### 3. Проверь настройки

Settings → Pages → Source: **GitHub Actions**

---

## 🔄 Workflow

**Решил проблему → сразу в доку:**

1. Нашёл решение
2. Упростил до минимума
3. Оформил по шаблону
4. Добавил примеры кода
5. Закоммитил

---

## 🛠 Технологии

- **VitePress** — генератор статической документации
- **Markdown** — формат всех страниц
- **GitHub Pages** — хостинг
- **GitHub Actions** — CI/CD

---

## 📱 Доступ с телефона

- GitHub Pages сайт: `https://yourusername.github.io/devbox/`
- GitHub repo: мобильная версия
- Локально: `npm run docs:dev` → доступ по IP

---

## 🔮 Следующие шаги

- [ ] Добавить больше страниц
- [ ] Создать Craft CMS starter
- [ ] Добавить Vite config шаблоны
- [ ] Наполнить сниппетами
- [ ] Превратить в boilerplate для проектов

---

## 💡 Принципы

- минимум теории, максимум практики
- всё переиспользуемо
- всё коротко и по делу
- всё структурировано
