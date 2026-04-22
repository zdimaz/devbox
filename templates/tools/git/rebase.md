---
title: "Git Rebase"
---

# Git Rebase

## 🧠 Суть

Перенести коммиты ветки на новое основание — история становится **линейной**, как будто ветка создавалась с актуального master.

В отличие от merge — **переписывает историю**. Только для своих веток, никогда для общих (`master`, `preprod`, `staging`).

---

## 💻 Обновить ветку от master

Самый частый случай — подтянуть свежие изменения из `master` в feature-ветку:

```bash
git fetch origin
git rebase origin/master
```

---

## 💻 Интерактивный rebase

Переписать, склеить или переименовать последние N коммитов:

```bash
git rebase -i HEAD~3   # последние 3 коммита
```

В редакторе — команды для каждого коммита:

```
pick a1b2c3 [Auth] Add login form       ← оставить как есть
squash d4e5f6 wip: fix typo             ← склеить с предыдущим
fixup g7h8i9 forgot semicolon           ← склеить, выбросить сообщение
reword h0i1j2 old message               ← переименовать коммит
drop k3l4m5 debug console.log           ← удалить коммит
edit n6o7p8 [Auth] Add JWT              ← остановиться для правки
```

> `squash` — объединяет коммиты, предлагает отредактировать сообщение.  
> `fixup` — то же, но сообщение второго коммита выбрасывается автоматически.

---

## 💻 Конфликт при rebase

```bash
# Git остановится на конфликтном коммите
# CONFLICT (content): Merge conflict in src/auth.php

# Разрешить конфликт вручную в файле, затем:
git add src/auth.php
git rebase --continue

# Пропустить проблемный коммит (осторожно):
git rebase --skip

# Отменить rebase и вернуться к исходному состоянию:
git rebase --abort
```

---

## 💻 Force push после rebase

Rebase переписывает историю — обычный push не пройдёт:

```bash
# Безопасный force push — не перезапишет чужие коммиты
git push origin feature/add-auth --force-with-lease

# Обычный --force — только если ветка полностью твоя
git push origin feature/add-auth --force
```

> `--force-with-lease` проверяет что remote не ушёл вперёд с момента последнего fetch.  
> Используй его вместо `--force` — страховка от случайного затирания чужих коммитов.

---

## 💻 Сброс ветки до состояния remote

Когда накопился мусор и проще начать чисто:

```bash
git fetch origin
git reset --hard origin/master

# Удалить неотслеживаемые файлы и папки
git clean -fd

# Удалить также файлы из .gitignore (осторожно — удалит .env)
git clean -fdx
```

> `git clean -fdx` удалит **всё** неотслеживаемое включая `.env` — сделай бэкап.

---

## ⚠️ Подводные камни

- Никогда не rebase `master`, `preprod`, `staging` — только feature-ветки
- После rebase всегда нужен `--force-with-lease`, обычный push упадёт
- `--force` без `--with-lease` опасен в командной работе — можно затереть чужие коммиты
- Если rebase долгий и сложный — `git rebase --abort` и попробуй merge
- `git clean -fdx` необратим — удалённые файлы не восстановить через git
