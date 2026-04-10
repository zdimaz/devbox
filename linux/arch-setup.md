# Arch Linux Setup

## 🧠 Суть
Быстрая настройка Arch Linux для dev-машины. Минимум лишнего, максимум производительности.

## ⚙️ Базовая установка

```bash
# Разметка (UEFI)св
parted /dev/sda mklabel gpt
parted /dev/sda mkpart primary fat32 1MiB 513MiB
parted /dev/sda mkpart primary ext4 513MiB 100%
mkfs.fat -F32 /dev/sda1
mkfs.ext4 /dev/sda2

# Монтирование
mount /dev/sda2 /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot

# Установка базовой системы
pacstrap /mnt base linux linux-firmware base-devel
genfstab -U /mnt >> /mnt/etc/fstab
arch-chroot /mnt
```

## 💻 Post-install

```bash
# Locale
sed -i 's/#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
locale-gen
echo 'LANG=en_US.UTF-8' > /etc/locale.conf

# Timezone
ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime
hwclock --systohc

# Network
pacman -S networkmanager
systemctl enable NetworkManager

# Bootloader
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

## 💻 Dev Tools

```bash
pacman -S \
  git neovim tmux zsh \
  docker docker-compose \
  nodejs npm \
  php php-fpm composer \
  imagemagick ffmpeg
```

## ⚠️ Подводные камни
- AUR helper (yay) → ставь после базовой настройки
- NVIDIA → нужны проприетарные драйверы `nvidia`
- Swap → создай swapfile если нет раздела

## 🚀 Оптимизация

### ZRAM вместо swap
```bash
pacman -S zram-generator
# /etc/systemd/zram-generator.conf
[zram0]
zram-size = min(ram / 2, 4096)

systemctl daemon-reload
systemctl start systemd-zram-setup@zram0
```

### Pacman оптимизация
```bash
# /etc/pacman.conf
ParallelDownloads = 5
ILoveCandy
```

## 🔗 Связанные темы
- [Оптимизация](/linux/optimization)
