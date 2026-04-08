# GitHub Pages Deploy

## 🧠 Суть
Автоматический деплой документации на GitHub Pages при push.

## ⚙️ Как работает

1. Push на `main`
2. GitHub Actions запускает workflow
3. Собирает VitePress (`npm run docs:build`)
4. Деплоит на GitHub Pages
5. Сайт доступен по `https://username.github.io/devbox/`

## 💻 Setup

### 1. Создай репозиторий на GitHub

```bash
git remote add origin https://github.com/yourusername/devbox.git
git branch -M main
git push -u origin main
```

### 2. Включи Pages в настройках

Settings → Pages → Source: **GitHub Actions**

### 3. Готово

После каждого push на `main` → авто-деплой.

## ⚠️ Подводные камни
- Repo должно быть **public** для бесплатных Pages
- Первый деплой может занять 1-2 минуты
- Если кастомный домен → добавь `CNAME` в `.vitepress/dist/`

## 🚀 Кастомный домен

```
# Создай файл public/CNAME
docs.yourdomain.com
```

В DNS:
```
CNAME  docs  →  yourusername.github.io
```

## 🔗 Связанные темы
- [Главная](/)
