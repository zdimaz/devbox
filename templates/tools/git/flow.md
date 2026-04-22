---
title: "Git Flow"
---

# Git Flow

## 🧠 Суть

Стратегия веток для чистой истории: фичи → staging → preprod → master.

---

## 💻 Структура веток

```
master          ← прод, только через PR
preprod         ← финальная проверка перед мержем в master
staging         ← общий тест, сюда мержатся все фичи
feature/xxx     ← фича
fix/xxx         ← баг
task/xxx        ← задача без явной фичи или бага
```

---

## 💻 Рабочий процесс

```bash
# 1. Новая задача — ветвись от master (всегда свежая база)
git checkout master
git pull origin master
git checkout -b feature/add-auth

# 2. Работаешь — коммить каждую завершённую фичу (см. ниже)

# 3. Готово — пуш и PR в staging
git push origin feature/add-auth
# GitHub: PR feature/add-auth → staging

# 4. Проверил на staging → PR staging → preprod → master
```

---

## 💻 Когда коммитить

**Коммить после каждой завершённой смысловой единицы** — не жди пока накопится куча изменений.

```
✅ Добавил компонент → коммит
✅ Починил баг → коммит
✅ Обновил зависимость → коммит
✅ Поправил конфиг → коммит

❌ "Сделал всё за день" → один жирный коммит
❌ WIP на весь день без коммитов
```

Почему это важно:
- Если что-то сломается — откатить один коммит, а не весь день работы
- `git bisect` найдёт сломанный коммит за секунды
- История читается как журнал изменений

---

## 💻 Формат коммита

```
[SCOPE] Title — что сделано                ← до 72 символов

Motivation:
Одно-два предложения — зачем, а не что.

Changes:
- Fixed ...
- Added ...
- Updated ...
- Removed ...
```

**`[SCOPE]`** — контекст изменения: `[CMS]`, `[Auth]`, `[API]`, `[UI]`, `[Config]`, `[Deps]`

**Заголовок:**
- До **72 символов** — GitHub обрезает длиннее
- Глагол с большой буквы: `Fix`, `Add`, `Update`, `Remove`
- Без точки в конце

**Motivation:**
- Зачем сделано — причина, а не описание кода
- 1–2 предложения

**Changes:**
- Конкретный список: что добавлено, исправлено, обновлено, удалено

---

## 💻 Примеры коммитов

**Плохо:**
```
fix
changes
wip
update stuff
```

**Хорошо — простой:**
```
[Auth] Fix redirect loop after login
```

**Хорошо — с телом:**
```
[CMS] Fix icon rendering and update plugin version

Motivation:
Resolve incorrect icon display caused by outdated plugin behavior.

Changes:
- Fixed icon rendering issue
- Updated plugin dependency version
- Synced composer configuration
```

---

## 💻 Типы изменений в Changes

| Глагол | Когда |
|---|---|
| `Added` | Новый файл, функция, маршрут, компонент |
| `Fixed` | Исправление бага или некорректного поведения |
| `Updated` | Изменение существующего кода / зависимости |
| `Removed` | Удаление кода, файла, зависимости |
| `Refactored` | Переписан без изменения поведения |
| `Synced` | Обновление конфига / локки под изменения |

---

## 💻 Локальная настройка git

```bash
# Имя и email (обязательно)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Для конкретного репозитория (без --global) — например рабочий аккаунт
git config user.name "Work Name"
git config user.email "work@company.com"

# Редактор для commit-сообщений
git config --global core.editor "nano"     # или: code --wait, nvim, vim

# Показывать diff при написании коммита
git config --global commit.verbose true
```

**Шаблон коммита** — структура всегда перед глазами при `git commit`:

```bash
cat > ~/.git-commit-template << 'EOF'
# [SCOPE] Title — до 72 символов
# |<---- 72 символа ---------------------------------------------------->|

Motivation:


Changes:
- 
EOF

git config --global commit.template ~/.git-commit-template
```

Теперь `git commit` (без `-m`) откроет редактор с шаблоном.

---

## ⚠️ Подводные камни

- Никогда не rebase `master`, `preprod`, `staging` — только feature-ветки
- `staging` / `preprod` не должны уходить вперёд `master` — синхронизируй после мержа
- Длинный заголовок (>72 символов) GitHub обрезает в списке коммитов
- `git commit -m "..."` не подходит для многострочных — используй `git commit` без флага
