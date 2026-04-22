---
title: "Git Merge"
---

# Git Merge

## 🧠 Суть

Слияние двух веток в одну. В отличие от rebase — **сохраняет историю** обеих веток и создаёт merge-коммит.

| | Merge | Rebase |
|---|---|---|
| История | Сохраняется полностью | Переписывается |
| Merge-коммит | Да (при `--no-ff`) | Нет |
| Безопасно для общих веток | ✅ | ❌ |
| Чистота истории | Древовидная | Линейная |

---

## 💻 Базовый merge

```bash
# Влить feature в текущую ветку (например master)
git checkout master
git merge feature/add-auth
```

---

## 💻 Fast-forward vs --no-ff

**Fast-forward** (по умолчанию) — если master не ушёл вперёд, коммиты просто "приклеиваются":

```bash
git merge feature/add-auth
# История будет линейной, merge-коммита нет
```

**`--no-ff`** — всегда создаёт merge-коммит, даже если ff возможен:

```bash
git merge --no-ff feature/add-auth
# Явный коммит "Merge branch 'feature/add-auth'" — видно в истории
```

> Для `master` и `preprod` рекомендуется `--no-ff` — сохраняет видимость где начиналась ветка.

---

## 💻 Squash merge

Склеить все коммиты ветки в один перед мержем:

```bash
git merge --squash feature/add-auth
git commit -m "[Auth] Add authentication flow"
```

Используй когда в ветке много WIP-коммитов и хочешь чистый один коммит в `master`.

---

## 💻 Разрешение конфликтов

```bash
git merge feature/add-auth
# CONFLICT (content): Merge conflict in src/auth.php
```

```bash
# Посмотреть какие файлы конфликтуют
git status

# Открыть файл — найти маркеры:
<<<<<<< HEAD
код из текущей ветки (master)
=======
код из feature/add-auth
>>>>>>> feature/add-auth

# Отредактировать вручную → убрать маркеры → оставить нужный код

# Зафиксировать
git add src/auth.php
git merge --continue   # или git commit
```

```bash
# Отменить merge и вернуться к состоянию до:
git merge --abort
```

---

## 💻 Merge через инструмент

```bash
# Запустить mergetool (vimdiff, vscode и др.)
git mergetool

# Настроить VS Code как mergetool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

---

## 💻 Просмотр перед мержем

```bash
# Что войдёт в merge (коммиты из feature, которых нет в master)
git log master..feature/add-auth --oneline

# Какие файлы изменятся
git diff master...feature/add-auth --name-only
```

---

## ⚠️ Подводные камни

- Никогда не мержь в `master` напрямую из локальной консоли — только через PR
- `--squash` не создаёт связь с исходной веткой — `git branch -d` потом не сработает без `-D`
- После `--no-ff` merge-коммит нужно именовать осмысленно, не оставляй дефолтное сообщение
- `git merge --abort` работает только если merge ещё не завершён
