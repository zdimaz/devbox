---
title: Dev среда
---

# Dev среда

## 🧠 Суть

Настройка Manjaro/Arch для разработки: Docker, Node, Git, PHP.

## ⚙️ Системные пакеты

```bash
sudo pacman -Syu
```

Обновление системы перед установкой новых пакетов.

**Docker:**

```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

- `docker docker-compose` — установка Docker и Docker Compose
- `systemctl enable --now` — запустить сервис и добавить в автозагрузку
- `usermod -aG docker $USER` — разрешение запуска docker без sudo

После `usermod -aG docker` — релогин.

```bash
sudo pacman -S git
sudo pacman -S composer
sudo pacman -S yarn
yay -S pnpm
yay -S ddev-bin
mkcert -install
```

- `git` — система контроля версий
- `composer` — менеджер пакетов PHP
- `yarn` / `pnpm` — альтернативы npm для JS
- `ddev-bin` — локальная среда для Craft CMS/PHP
- `mkcert -install` — создание локального CA для HTTPS (один раз)

## 💻 Node.js через NVM

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

Установка yay — менеджера для AUR (если ещё нет).

```bash
yay -S nvm
```

```bash
# Добавь в ~/.bashrc:
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/share/nvm/init-nvm.sh" ] && . "/usr/share/nvm/init-nvm.sh"

# Применяем
source ~/.bashrc
```

Инициализация NVM — добавь это в `~/.bashrc` или `~/.zshrc`.

```bash
nvm install --lts
nvm use --lts
node -v
```

- `install --lts` — установить последнюю LTS-версию Node.js
- `use --lts` — переключиться на LTS
- `node -v` — проверить текущую версию

## 💻 Bash Aliases

```bash
alias ll='ls -la --color=auto'
alias dc='docker-compose'
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
```

- `ll` — подробный список файлов
- `dc` — сокращение для docker-compose
- `dps` — таблица запущенных контейнеров
- `gs`, `ga`, `gc`, `gp` — быстрые команды Git

После изменений: `source ~/.bashrc`

## ⚠️ Подводные камни

- После `usermod -aG docker` — обязательно релогин
- NVM в Arch через AUR, не через curl (отличается путь init)
- DDEV требует `mkcert -install` для HTTPS локально
