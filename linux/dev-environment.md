# Dev среда

## 🧠 Суть
Настройка Manjaro/Arch для разработки: Docker, Node, Git, PHP.

## ⚙️ Системные пакеты

```bash
sudo pacman -Syu

# Docker
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER  # без sudo для docker (релогин)

# Git
sudo pacman -S git

# PHP Composer
sudo pacman -S composer

# Yarn / pnpm
sudo pacman -S yarn
yay -S pnpm

# DDEV (для Craft CMS)
yay -S ddev-bin
mkcert -install  # один раз
```

## 💻 Node.js через NVM

```bash
# Установка yay (если нет)
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Установка nvm
yay -S nvm

# Добавь в ~/.bashrc:
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/share/nvm/init-nvm.sh" ] && . "/usr/share/nvm/init-nvm.sh"

# Применяем
source ~/.bashrc

# Используем
nvm install --lts
nvm use --lts
node -v
```

## 💻 Bash Aliases

```bash
# ~/.bashrc
alias ll='ls -la --color=auto'
alias dc='docker-compose'
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
```

После изменений: `source ~/.bashrc`

## ⚠️ Подводные камни
- После `usermod -aG docker` — обязательно релогин
- NVM в Arch через AUR, не через curl (отличается путь init)
- DDEV требует `mkcert -install` для HTTPS локально

## 🔗 Связанные темы
- [Bash Aliases](/dev/bash-aliases)
- [Docker](/dev/docker)
