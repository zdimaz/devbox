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
├── templates/            # Весь контент (.md файлы)
│   ├── index.md          # Главная страница
│   ├── dev/              # Dev: Tools, Frontend
│   │   ├── tools/        # Bash Aliases, Git, Docker, PHP
│   │   └── frontend/     # Assets, Build, CSS, JS
│   ├── craft/            # Craft CMS: структура, Twig, компоненты
│   └── linux/            # Arch setup, оптимизация
├── .vitepress/           # Конфиг и утилиты навигации
│   ├── config.js         # Импорт динамической навигации
│   └── nav-helper.js     # Авто-генерация sidebar из файловой структуры
├── .github/workflows/    # CI/CD для GitHub Pages
└── package.json
```

Навигация генерируется **динамически** — добавление нового `.md` файла в `templates/` автоматически обновляет sidebar.

---

## 📝 Как добавить новую страницу

1. Создай файл в нужной папке, например `templates/dev/frontend/fonts.md`
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

- [ссылка](/dev/frontend/fonts)
```

3. **Готово!** Sidebar обновится автоматически — навигация генерируется из файловой структуры.
   Прямая ссылка: `http://localhost:5173/dev/frontend/fonts`

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
git remote add origin https://github.com/zdimaz/devbox.git
git push -u origin master
```

### 2. Включить Pages

Settings → Pages → Source: **GitHub Actions**

### 3. Workflow сделает всё сам

После push на `master`:

- автоматическая сборка
- деплой на GitHub Pages
- ссылка: `https://zdimaz.github.io/devbox/`

### 3. Проверь настройки

Settings → Pages → Source: **GitHub Actions**

Всё работает автоматически — workflow собирает сайт из `templates/` и деплоит на GitHub Pages.

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

- GitHub Pages сайт: `https://zdimaz.github.io/devbox/`
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
