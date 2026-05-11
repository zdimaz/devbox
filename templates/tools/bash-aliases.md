---
title: "Bash Aliases"
---

# Bash Aliases

## 🧠 Суть

Горячие команды для Docker и деплоя. Функции сами читают `.env` при вызове — не нужно ничего грузить заранее.

---

## ⚙️ Установка

```bash
nano ~/.bash_aliases
source ~/.bashrc
```

Убедись что в `.bashrc` есть:

```bash
if [ -f ~/.bash_aliases ]; then . ~/.bash_aliases; fi
```

---

## 💻 Готовый блок

```bash
# ─── Docker Compose ───────────────────────────────────────────────────
alias dcb='docker compose up -d --build'
alias dcu='docker compose up -d'
alias dcd='docker compose down'
alias dcl='docker compose logs -f'

# ─── Docker Exec ──────────────────────────────────────────────────────
de-sh() {
  local tag; tag=$([ -f .env ] && grep -m1 '^PROJECT_TAG=' .env | cut -d= -f2)
  [ -z "$tag" ] && { echo "PROJECT_TAG не найден в .env"; return 1; }
  docker exec -it "${tag}_web" /bin/sh
}

de-sql() {
  local tag; tag=$([ -f .env ] && grep -m1 '^PROJECT_TAG=' .env | cut -d= -f2)
  [ -z "$tag" ] && { echo "PROJECT_TAG не найден в .env"; return 1; }
  local f="${1:-db.sql}"
  [ ! -f "$f" ] && { echo "Файл '$f' не найден"; return 1; }
  local pass; pass=$(grep -m1 '^MYSQL_ROOT_PASSWORD=' .env | cut -d= -f2)
  docker exec -i "${tag}_mysql" mysql -uroot -p"${pass:-root}" dev < "$f"
}

# ─── Deploy ───────────────────────────────────────────────────────────
alias dep-s='php vendor/bin/dep deploy staging'
alias dep-p='php vendor/bin/dep deploy production'

# ─── Misc ─────────────────────────────────────────────────────────────
alias sp='sudo chmod -R 777 ./'
alias cl='clear'
```

---

## 💻 Использование

```bash
dcb              # docker compose up -d --build
dcd              # docker compose down
dcl              # логи в реальном времени

de-sh            # войти в контейнер (берёт PROJECT_TAG из .env)
de-sql           # импорт db.sql
de-sql dump.sql  # импорт конкретного файла
```

---

## ⚠️ Подводные камни

- `docker-compose` (через дефис) — устарел, используй `docker compose`
- `MYSQL_ROOT_PASSWORD` должен быть в `.env`, иначе fallback `root`
- `de-sql` ищет файл относительно текущей папки — запускай из корня проекта
