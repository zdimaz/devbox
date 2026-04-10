# Arch Linux — основы

## 🧠 Суть
Базовые команды Arch/Manjaro/EndeavourOS для повседневной работы.

## ⚙️ Обновление системы

```bash
sudo pacman -Syu          # полное обновление
```

## 💻 Управление пакетами (pacman)

```bash
sudo pacman -S <pkg>      # установить
sudo pacman -R <pkg>      # удалить (без зависимостей)
sudo pacman -Rns <pkg>    # удалить + зависимости + конфиги
sudo pacman -Ss <name>    # поиск
sudo pacman -Qi <pkg>     # инфо о пакете
```

**Пояснения:**
- `-Syu` = sync + refresh + upgrade
- `-Rns` = remove + dependencies + config files (полная чистка)

## 💻 AUR (через yay)

```bash
# Установка yay
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Использование
yay -S <pkg>              # установить из AUR
yay -Rns <pkg>            # удалить
yay -Ss <name>            # поиск в AUR + репах
yay -Sua                  # обновить только AUR пакеты
```

**Параметр `--needed`:** не переустанавливает если пакет уже есть.

## 💻 Система и сервисы

```bash
uname -r                  # версия ядра
systemctl status          # статус системы
systemctl reboot          # перезагрузка
systemctl poweroff        # выключение
```

## 💻 Мониторинг

```bash
htop                      # процессы (pacman -S htop)
free -h                   # RAM + swap
inxi -Fxz                 # инфо о железе (pacman -S inxi)
lsblk                     # диски и разделы
df -h                     # свободное место
du -sh <dir>              # размер папки
```

## 💻 Сеть

```bash
ip a                      # IP-адреса
ping archlinux.org        # проверить сеть
nmcli device wifi list    # список Wi-Fi
nmcli device wifi connect "SSID" password "PASS"  # подключение
```

## 💻 Пользователи

```bash
whoami                    # текущий пользователь
sudo useradd -m <user>    # создать пользователя
sudo passwd <user>        # задать пароль
sudo usermod -aG wheel <user>  # добавить в sudo
```

## ⚠️ Ошибка GPGME: Нет данных

Классика Manjaro — устаревшие GPG ключи:

```bash
# 1. Обновить ключи
sudo pacman-key --populate archlinux manjaro

# 2. Обновить связку
sudo pacman -Sy archlinux-keyring manjaro-keyring

# 3. Обновить систему
sudo pacman -Syu
```

**Если не помогло — полная переинициализация:**
```bash
sudo rm -rf /etc/pacman.d/gnupg
sudo pacman-key --init
sudo pacman-key --populate archlinux manjaro
sudo pacman -Sy archlinux-keyring manjaro-keyring
sudo pacman -Syu
```

## ⚠️ pamac конфликтует с pacman

```bash
# Обновить pamac из AUR
yay -S pamac-aur

# Потом систему
sudo pacman -Syu
```

## 🔗 Связанные темы
- [Dev среда](/linux/dev-environment)
- [ZSH](/linux/zsh)
