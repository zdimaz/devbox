---
title: "Git — SSH ключи"
---

# Git — SSH ключи

## 🧠 Суть

SSH-ключ заменяет логин/пароль при работе с GitHub/GitLab. Генерируется один раз, публичная часть добавляется на сервер.

---

## 💻 Создать ключ

```bash
ssh-keygen -t ed25519 -C "you@example.com"
# Путь: ~/.ssh/id_ed25519 (Enter — оставить по умолчанию)
# Passphrase: задать или оставить пустым
```

> `ed25519` — современный алгоритм, быстрее и безопаснее старого `rsa`.

---

## 💻 Добавить на GitHub

```bash
# Показать публичный ключ
cat ~/.ssh/id_ed25519.pub
```

GitHub → **Settings → SSH and GPG keys → New SSH key** → вставить вывод команды выше.

```bash
# Проверить подключение
ssh -T git@github.com
# Hi username! You've successfully authenticated...
```

---

## 💻 Несколько аккаунтов (work + personal)

```bash
# Создать второй ключ
ssh-keygen -t ed25519 -C "work@company.com" -f ~/.ssh/id_ed25519_work
```

```bash
# ~/.ssh/config
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

```bash
# Клонировать через нужный аккаунт
git clone git@github-work:company/repo.git
```

---

## 💻 ssh-agent — не вводить passphrase каждый раз

```bash
# Запустить агент и добавить ключ
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Arch/Manjaro — автозапуск через systemd (добавить в ~/.zshrc или ~/.bashrc)
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_ed25519 2>/dev/null
fi
```

---

## ⚠️ Подводные камни

- Публичный ключ — `*.pub` — его добавляют на GitHub; приватный не показывать никому
- Если `ssh -T git@github.com` выдаёт `Permission denied` — ключ не добавлен на GitHub или агент не запущен
- Для разных аккаунтов обязательно `~/.ssh/config` — иначе всегда будет использоваться первый ключ
