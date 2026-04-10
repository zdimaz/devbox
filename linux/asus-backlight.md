# Подсветка клавиатуры Asus TUF

## 🧠 Суть
Настройка подсветки клавиатуры на ноутбуках Asus TUF.

## ⚙️ Постоянная настройка

В `/etc/default/grub` найди:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
```

Добавь параметр:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash acpi_backlight=native"
```

Обнови GRUB:

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

Перезагрузись.

**Пояснения:**
- `acpi_backlight=native` — использует родной ACPI для управления яркостью
- Без этого могут не работать fn-клавиши яркости

## ⚠️ Подводные камни
- После обновления GRUB — проверь что файл `grub.cfg` обновился
- Если не помогло — попробуй `acpi_backlight=vendor` вместо `native`

## 🔗 Связанные темы
- [Arch основы](/linux/arch-basics)
