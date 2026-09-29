---
title: Issues with linux-firmware-amdgpu 20260910-2
---

# AMD GPU Firmware 20260810-2 — Блокировка

## Проблема

Версия 20260910-2 сломала видео на YouTube и потоковых сервисах, долго загружается в boot, виснет при смене яркости.

---

## Понизь на рабочую версию

Если в кеше есть:

```bash
sudo pacman -U /var/cache/pacman/pkg/linux-firmware-amdgpu-20260810-2-any.pkg.tar.zst
```

Если нет в кеше — установи:

```bash
sudo pacman -S linux-firmware-amdgpu=20260810-2
```

## Проверь текущую версию

```bash
pacman -Q linux-firmware-amdgpu
```

Должна быть версия **20260810-2**

## Добавь IgnorePkg в /etc/pacman.conf

```bash
sudo nano /etc/pacman.conf
```

Найди строку `#IgnorePkg   =` и добавь:

```
IgnorePkg = linux-firmware-amdgpu
```

Сохрани: **Ctrl+O** → Enter → **Ctrl+X**

## Обнови систему

```bash
sudo pacman -Syu
```

Должен увидеть предупреждение: linux-firmware-amdgpu: пропуск обновления пакета (20260810-2 => 1:20260916-1)

## Удали lock файл (если база заблокирована)

```bash
sudo rm /var/lib/pacman/db.lck
```

## Перезагрузись

```bash
sudo reboot
```

---

Issues: [Issues with linux-firmware-amdgpu 20260910-1](https://bbs.archlinux.org/viewtopic.php?id=314887 "Issues with linux-firmware-amdgpu 20260910-1")

Всё — система вернется в рабочее состояние.
