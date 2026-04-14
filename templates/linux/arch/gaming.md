---
title: Arch для игр
---

# Arch для игр

## 🧠 Суть

Настройка Manjaro/Arch для игр: Steam, Proton, FPS, оптимизация.

## ⚙️ Установка игровых компонентов

```bash
sudo pacman -Syu

# Игровой стек (AMD)
sudo pacman -S vulkan-tools lib32-vulkan-radeon vulkan-radeon \
  lib32-vulkan-driver mesa-utils lib32-mesa-utils \
  gamemode mangohud wine-staging winetricks lutris steam

# NVIDIA (проприетарный драйвер)
sudo mhwd -a pci nonfree 0300
# После — перезагрузка
```

## 💻 Ядро

```bash
uname -r
```

Проверить текущее ядро.

```bash
sudo mhwd-kernel -li
```

Список доступных ядер.

```bash
sudo mhwd-kernel -i linux68-rt
```

Установить ядро реального времени.

## 💻 GameMode

```bash
# Проверка
gamemoded -s

# Автозапуск
systemctl --user enable --now gamemoded

# В Steam: Параметры запуска → gamemoderun %command%
```

## 💻 Proton GE

```bash
yay -S proton-ge-custom-bin
```

Steam → Свойства игры → Совместимость → Выбери Proton-GE

## 💻 MangoHud (FPS overlay)

```bash
# В Steam: Параметры запуска → mangohud %command%

# Вместе с GameMode:
mangohud gamemoderun %command%

# Настройки:
nano ~/.config/MangoHud/MangoHud.conf
```

## 💻 DXVK / VKD3D

```bash
yay -S dxvk-bin vkd3d-proton-bin

# Проверка Vulkan
vulkaninfo | grep "deviceName"
```

## 💻 Swap файл (если RAM < 16GB)

```bash
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 💻 Контроллеры

```bash
sudo pacman -S game-devices-udev
sudo systemctl restart systemd-udevd
```

## 💻 Драйверы и микрокоды

```bash
sudo pacman -S linux-firmware amd-ucode intel-ucode
sudo update-grub
```

## ⚠️ Подводные камни

- NVIDIA → только проприетарный драйвер для игр
- `gamemoderun` до `%command%`, не после
- Proton GE не обновляется автоматически — следи за версиями
