---
title: Canon LBP6020B
---

# Canon LBP6020B на Arch Linux — рабочая инструкция

Драйвер: **capt-src** (AUR). Модель принтера в системе — CAPT, не UFR II.

## 1. Установка драйвера

```bash
sudo pacman -S cups base-devel git
sudo systemctl enable --now cups.service
yay -S capt-src
```

## 2. Проверить PPD

```bash
ls /usr/share/cups/model/ | grep -i 6020
```

Должен быть файл `CNCUPSLBP6020CAPTK.ppd`.

⚠️ Важно: для LBP6020B используется PPD именно `CNCUPSLBP6020CAPTK.ppd` (без буквы B в имени файла). Через GUI-мастер CUPS этот PPD может не отображаться в списке — используйте терминал.

## 3. Найти USB-адрес принтера

```bash
lpinfo -v | grep -i canon
```

Или через `lsusb | grep -i canon` — убедиться, что принтер вообще виден системой.

## 4. Создать очередь печати

```bash
sudo lpadmin -p LBP6020B -m CNCUPSLBP6020CAPTK.ppd -v ccp://localhost:59687 -E
```

Порт `59687` — рабочий вариант. Если не заработает, попробовать `59787`.

## 5. Привязать CAPT-демон к USB-устройству

```bash
sudo ccpdadmin -p LBP6020B -o /dev/usb/lp0
sudo systemctl restart ccpd.service
```

## 6. Автозапуск после перезагрузки

```bash
sudo systemctl enable cups.service
sudo systemctl enable ccpd.service
```

## 7. Сделать принтер по умолчанию

```bash
sudo lpadmin -d LBP6020B
```

## 8. Права пользователя (печать без sudo)

```bash
sudo usermod -aG lp $USER
```

Перелогиниться после этого.

## Проверка

```bash
lp -d LBP6020B /etc/hostname
```

Или тестовая страница через `http://localhost:631` → выбрать принтер `LBP6020B` → Print Test Page.

## Диагностика, если не печатает

```bash
lpstat -p -d          # статус очереди и принтер по умолчанию
lpstat -o              # застрявшие задания
sudo tail -f /var/log/cups/error_log   # лог в реальном времени во время печати
sudo ss -tlnp | grep 59687             # слушает ли демон ccpd порт
```

## Частые грабли

- **Неверная модель PPD** (например LBP6070 вместо LBP6020) — принтер "печатает", но выдаёт пустой лист или ошибку `Неверная команда принтера`. Решение: пересоздать очередь с точным PPD `CNCUPSLBP6020CAPTK.ppd`.
- **Две очереди одновременно** (`LBP6020` и `LBP6020B`) — система может по умолчанию выбрать нерабочую. Снести лишнюю:
  ```bash
  sudo lpadmin -x LBP6020
  ```
- Установка через веб-интерфейс CUPS (`localhost:631/admin`) для CAPT-принтеров часто не работает — использовать только `lpadmin` в терминале.
