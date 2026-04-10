# Git

## 🧠 Суть
Полезные команды Git для повседневной работы.

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

## 💻 Rebase

Обновить ветку с удалёнки и перебазировать текущую:

```bash
git fetch origin uat
git rebase origin/uat
```

**Если конфликты:**
```bash
# Реши конфликты в файлах
git add <файлы>
git rebase --continue

# Или отменить:
git rebase --abort
```

**После rebase — форс-пуш:**
```bash
git push origin ветка --force-with-lease
```

## 💻 Сброс изменений

Когда много изменений и нужно откатить:

```bash
git fetch origin
git clean -fdx       # ⚠️ удалит всё неотслеживаемое
git reset --hard origin/main
```

**Что делает `git clean -fdx`:**
- `-f` — принудительно
- `-d` — включая директории
- `-x` — даже файлы из `.gitignore`

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
- `--force-with-lease` безопаснее `--force` — не перетрёшь чужие коммиты
- `git clean -fdx` удаляет **всё** включая `.env` → делай бэкап
- Rebase переписывает историю → только для локальных веток

## 🔗 Связанные темы
- [GitHub Pages](/github-pages)
