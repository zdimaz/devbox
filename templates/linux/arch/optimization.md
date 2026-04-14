---
title: Оптимизация Linux
---

# Оптимизация Linux

## 🧠 Суть

Оптимизация системы для dev-машины.

## ⚙️ ZRAM

```bash
# Установка
pacman -S zram-generator

# Конфиг: /etc/systemd/zram-generator.conf
[zram0]
zram-size = min(ram / 2, 4096)

# Активация
systemctl daemon-reload
systemctl start systemd-zram-setup@zram0
```

## ⚙️ Sysctl твики

```bash
# /etc/sysctl.d/99-sysctl.conf
vm.swappiness=10
vm.vfs_cache_pressure=50
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```

## 💻 Очистка системы

```bash
# Очистка кэша pacman
paccache -r

# Удаление orphan пакетов
pacman -Rns $(pacman -Qtdq)

# Очистка логов
journalctl --vacuum-time=3d
```

## ⚠️ Подводные камни

- Не ставь слишком низкий `swappiness`
- `vfs_cache_pressure` влияет на I/O
- Не чисти кэш слишком часто

## 🚀 Best Practice

1. ZRAM > swap на диске
2. BBR congestion control
3. Регулярная очистка кэша
