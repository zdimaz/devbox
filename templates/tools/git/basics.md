---
title: "Git — основы"
---

# Git — основы

## 🧠 Суть

Инициализация, конфиг пользователя и SSH для GitHub.

## ⚙️ Инициализация проекта

```bash
cd путь/к/проекту
git init

# Сразу .gitignore
cat > .gitignore << EOF
vendor/
node_modules/
.env
.DS_Store
EOF

git add .
git commit -m "Initial commit"
```

## 💻 Конфиг пользователя

```bash
# Глобально
git config --global user.name "Имя"
git config --global user.email "email@example.com"

# Для конкретного репозитория
git config user.name "Имя"
git config user.email "email@example.com"
```

## 💻 SSH ключ для GitHub

```bash
# Создай ключ
ssh-keygen -t ed25519 -C "your@email.com"

# Покажи публичный ключ
cat ~/.ssh/id_ed25519.pub

# Добавь на GitHub: Settings → SSH Keys → New SSH Key
```

## ⚠️ Подводные камни

- Используй `ed25519` — быстрее и безопаснее старого `rsa`
- Для разных аккаунтов (work/personal) создай `~/.ssh/config` с алиасами
