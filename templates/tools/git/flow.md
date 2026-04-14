---
title: "Git Flow"
---

# Git Flow

## 🧠 Суть

Стратегия веток для чистой истории: фичи → preprod → master.

## 💻 Структура веток

```
master        ← прод, только через PR
preprod       ← staging, тест перед мержем
feature/xxx   ← фича или фикс
```

## 💻 Рабочий процесс

```bash
# 1. Новая фича — ветвись от master
git checkout master
git pull origin master
git checkout -b feature/add-auth

# 2. Работаешь, коммитишь по таскам (см. ниже)

# 3. Готово — пуш и PR в preprod
git push origin feature/add-auth
# GitHub: PR feature/add-auth → preprod

# 4. Проверил на staging → PR preprod → master
```

## 💻 Коммиты по таскам

Один таск — один коммит. Не копи изменения из трёх фич в один коммит.

**Формат:**

```
тип: короткое описание

feat: add user auth
fix: broken redirect after login
chore: update dependencies
docs: add API examples
refactor: extract auth middleware
```

**Почему это важно:**

- `git bisect` найдёт сломанный коммит за секунды
- Rollback одного таска без отката соседних
- История читается как changelog

**Плохо:**

```bash
git commit -m "changes"
git commit -m "fix"
git commit -m "wip"
```

**Хорошо:**

```bash
git commit -m "feat: add login form"
git commit -m "feat: add JWT token validation"
git commit -m "fix: redirect loop on /dashboard"
```

## 💻 Интерактивный rebase перед PR

Прибраться перед мержем — склеить WIP коммиты:

```bash
# Последние 3 коммита
git rebase -i HEAD~3
```

В редакторе:
```
pick abc1234 feat: add login form
squash def5678 wip: fix typo        ← склеится с предыдущим
squash ghi9012 fix: forgot semicolon ← тоже
```

## ⚠️ Подводные камни

- Никогда не rebase `master` и `preprod` — только feature ветки
- Squash только WIP коммиты — осмысленные коммиты не трогай
- `preprod` не должен уходить вперёд master — синхронизируй регулярно
