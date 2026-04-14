---
title: "Git — Rebase и сброс"
---

# Git — Rebase и сброс

## 🧠 Суть

Перебазирование ветки и откат изменений.

## 💻 Rebase

Обновить ветку с удалёнки и перебазировать текущую:

```bash
git fetch origin master
git rebase origin/master
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
git clean -fdx
git reset --hard origin/master
```

⚠️ `git clean -fdx` удалит **всё** неотслеживаемое, включая `.env`.

**Что делает `git clean -fdx`:**

- `-f` — принудительно
- `-d` — включая директории
- `-x` — даже файлы из `.gitignore`

## ⚠️ Подводные камни

- `--force-with-lease` безопаснее `--force` — не перетрёшь чужие коммиты
- `git clean -fdx` удаляет **всё** включая `.env` → делай бэкап
- Rebase переписывает историю → только для локальных / своих веток
