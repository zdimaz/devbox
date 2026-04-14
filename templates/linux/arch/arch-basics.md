---
title: Arch Linux — основы
---

# Arch Linux — основы

## 🧠 Суть

Базовые команды Arch/Manjaro/EndeavourOS для повседневной работы.

## ⚙️ Обновление системы

```bash
sudo pacman -Syu --noconfirm
```

Полное обновление системы: обновление базы репозиториев + всех установленных пакетов. Делай регулярно.

## 💻 Управление пакетами (pacman)

```bash
sudo pacman -S <pkg>
sudo pacman -R <pkg>
sudo pacman -Rns <pkg>
sudo pacman -Ss <name>
sudo pacman -Qi <pkg>
```

- `pacman -S <pkg>` — установить пакет из репозитория (sync)
- `pacman -R <pkg>` — удалить пакет (зависимости остаются)
- `pacman -Rns <pkg>` — удалить пакет + зависимости + конфиги (полная чистка)
- `pacman -Ss <name>` — поиск пакета по названию в репозиториях
- `pacman -Qi <pkg>` — подробная информация об установленном пакете

**Полезные флаги pacman:**

| Флаг              | Что делает                                     | Пример                   |
| ----------------- | ---------------------------------------------- | ------------------------ |
| `--needed`        | Не переустанавливает, если пакет уже есть      | `-S --needed pkg`        |
| `--noconfirm`     | Пропускает все подтверждения                   | `-S --noconfirm pkg`     |
| `-y`              | Обновить базу репозиториев                     | `-Sy`                    |
| `-yy`             | Принудительно обновить (игнорирует кэш)        | `-Syy`                   |
| `-u`              | Обновить все пакеты                            | `-Su`                    |
| `-q`              | Тихий режим (меньше вывода)                    | `-Sqs <name>`            |
| `-i`              | Информация                                     | `-Qi pkg` / `-Si pkg`    |
| `-l`              | Список файлов пакета                           | `-Ql pkg`                |
| `-o`              | Какой пакет владеет файлом                     | `-Qo /usr/bin/cmd`       |
| `-c`              | Очистить кэш старых версий                     | `-Scc`                   |
| `--overwrite '*'` | Принудительно перезаписать конфликтующие файлы | `-S --overwrite '*' pkg` |

## 💻 AUR (через yay)

Сначала установка yay — нужен для работы с AUR:

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

`makepkg -si` — собрать пакет и сразу установить.

```bash
yay -S <pkg>
yay -Rns <pkg>
yay -Ss <name>
yay -Sua
```

- `yay -S <pkg>` — установить из AUR (или из репов)
- `yay -Rns <pkg>` — удалить с зависимостями и конфигами
- `yay -Ss <name>` — поиск в AUR + официальных репозиториях
- `yay -Sua` — обновить только AUR пакеты (игнорирует репы)

**Полезные флаги yay:**

| Флаг           | Что делает                              |
| -------------- | --------------------------------------- |
| `--noconfirm`  | Пропускает все подтверждения            |
| `--editmenu`   | Показать PKGBUILD перед установкой      |
| `--cleanafter` | Удалить build-папку после установки     |
| `--devel`      | Проверить обновления для `-git` пакетов |
| `-Pg --print`  | Показать конфиг yay                     |

## 💻 Система и сервисы

```bash
uname -r
```

Версия текущего ядра.

```bash
systemctl status
```

Общий статус systemd-сервисов.

```bash
systemctl reboot
systemctl poweroff
```

Перезагрузка и выключение через systemd.

## 💻 Мониторинг

```bash
htop
free -h
inxi -Fxz
lsblk
df -h
du -sh <dir>
```

- `htop` — интерактивный мониторинг процессов (аналог top)
- `free -h` — использование RAM и swap в читаемом формате
- `inxi -Fxz` — полная информация о железе и системе (скрывает IP)
- `lsblk` — список блочных устройств (диски, разделы)
- `df -h` — свободное место на всех разделах
- `du -sh <dir>` — размер конкретной папки

## 💻 Сеть

```bash
ip a
ping archlinux.org
nmcli device wifi list
nmcli device wifi connect "SSID" password "PASS"
```

- `ip a` — все IP-адреса и сетевые интерфейсы
- `ping` — проверка подключения к серверу
- `nmcli device wifi list` — список доступных Wi-Fi сетей
- `nmcli device wifi connect` — подключение к Wi-Fi

## 💻 Пользователи

```bash
whoami
sudo useradd -m <user>
sudo passwd <user>
sudo usermod -aG wheel <user>
```

- `whoami` — имя текущего пользователя
- `useradd -m` — создать нового пользователя с домашней директорией
- `passwd` — задать пароль для пользователя
- `usermod -aG wheel` — добавить пользователя в группу wheel (доступ к sudo)

## 💻 Pamac (GUI менеджер пакетов)

GUI-приложение для установки программ, обновлений и поиска в AUR. Аналог "Магазина приложений".

Сначала установи yay:

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

Затем установи pamac:

```bash
yay -S pamac-aur
```
