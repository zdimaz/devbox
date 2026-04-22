---
title: "Git — инициализация"
---

# Git — инициализация

## 🧠 Суть

Создать git-репозиторий в проекте и подключить к GitHub.

---

## 💻 Новый репозиторий

```bash
cd path/to/project
git init

git add .
git commit -m "[Init] Initial commit"

# Подключить remote и запушить
git remote add origin git@github.com:user/repo.git
git push -u origin master
```

---

## 💻 .gitignore

Создавать **до первого коммита** — иначе уже закоммиченные файлы не исключатся.

```bash
cat > .gitignore << EOF
# Dependencies
vendor/
node_modules/

# Environment
.env
.env.local

# Build
dist/
/web/wp/

# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.suo
EOF
```

> Если файл уже в git и нужно его исключить:
> ```bash
> git rm --cached .env
> echo ".env" >> .gitignore
> git commit -m "[Config] Remove .env from tracking"
> ```

---

## 💻 Клонировать существующий репозиторий

```bash
# По SSH (рекомендуется)
git clone git@github.com:user/repo.git

# В конкретную папку
git clone git@github.com:user/repo.git my-folder

# Только последний коммит (shallow clone — быстрее для больших репо)
git clone --depth=1 git@github.com:user/repo.git
```

---

## ⚠️ Подводные камни

- `.gitignore` игнорирует только неотслеживаемые файлы — если файл уже закоммичен, `git rm --cached` обязателен
- `git push -u` нужен только первый раз — устанавливает upstream, потом просто `git push`
- `git@github.com` — SSH; `https://github.com` — HTTPS (потребует токен, не пароль)
