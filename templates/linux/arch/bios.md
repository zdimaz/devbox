---
title: "BIOS — настройка и оптимизация"
---

# BIOS — настройка и оптимизация

## 🧠 Суть

Базовая конфигурация BIOS для стабильной, тихой и производительной работы ПК/ноута.  
Меню на примере **ASRock** — на других материнках разделы могут называться иначе, но логика та же.

---

## ⚙️ RAM — XMP / разгон

```
OC Tweaker →
  Load XMP Setting        → Enabled       ← активирует профиль из SPD памяти
  DRAM Frequency          → 2666 MHz      ← или Auto если XMP сам выбирает
  DRAM Voltage            → 1.35 V        ← стандарт DDR4; 1.2 V для DDR5

OC Tweaker →
  DRAM Timing Configuration →
    Command Rate          → 2T            ← стабильнее чем 1T на большинстве конфигураций
```

> Без XMP RAM работает на базовых 2133 МГц независимо от того, что написано на планке.  
> После включения XMP проверь стабильность — запусти `memtest86` хотя бы на 1 проход.

```bash
# Проверить реальную частоту в Linux
sudo dmidecode --type 17 | grep Speed
```

---

## ⚙️ GPU / PCIe

```
Advanced →
  Chipset Configuration →
    PCIe Link Speed       → Gen3          ← Gen4 только если GPU и слот поддерживают

Advanced →
  PCI Subsystem Settings →
    Above 4G Decoding     → Enabled       ← обязательно для современных GPU (>4 GB VRAM)
                                             и для нескольких GPU/карт расширения
```

> **Above 4G Decoding** нужен для корректной работы RX 580 / RX 6xxx / RTX и других карт  
> с видеопамятью ≥4 GB под Linux. Без него возможны зависания при загрузке драйвера.

---

## ⚙️ Вентиляторы — тихий режим

```
H/W Monitor →
  CPU Fan 1 Setting       → Silent Mode   ← авто-кривая с приоритетом на тишину
  CPU Fan Temp Source     → Monitor CPU   ← ориентир — температура ядра процессора

  Chassis Fan Setting     → Silent / Custom
  Temp Source             → Monitor M/B   ← ориентир — температура платы
```

**Custom-кривая** (если Silent Mode недостаточно тихий):

| Температура | Обороты |
|---|---|
| < 40°C | 0% (полная тишина) |
| 50°C | 30% |
| 65°C | 60% |
| 75°C | 85% |
| 80°C+ | 100% |

---

## ⚙️ Прочие рекомендуемые параметры

```
Advanced →
  CPU Configuration →
    Intel SpeedStep / AMD Cool'n'Quiet → Enabled   ← снижает частоту/напряжение в простое

Security →
  Secure Boot             → Disabled               ← иначе могут не грузиться некоторые
                                                      dkms-модули (nvidia, virtualbox)

Boot →
  Fast Boot               → Disabled               ← иначе USB-девайсы могут не успеть
  CSM                     → Disabled               ← UEFI-only, нужен для GPT+UEFI
```

---

## 💻 RX 580 — андервольт в Linux

Цель: снизить температуру на 10–15°C и уровень шума без потери FPS.

### Метод 1 — CoreCtrl (GUI, рекомендуется)

```bash
# Установка
yay -S corectrl

# Автозапуск с системой без запроса пароля:
# /etc/polkit-1/rules.d/90-corectrl.rules
polkit.addRule(function(action, subject) {
    if (action.id == "org.corectrl.helper.init" &&
        subject.local == true &&
        subject.active == true &&
        subject.isInGroup("your-username")) {
        return polkit.Result.YES;
    }
});
```

В CoreCtrl: GPU → вкладка "Frequency" → снизить напряжение на последних P-стейтах.

### Метод 2 — sysfs вручную

```bash
# Включить overdrive (нужно однократно добавить в параметры ядра)
# /etc/default/grub:
# GRUB_CMDLINE_LINUX_DEFAULT="... amdgpu.ppfeaturemask=0xffffffff"
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

```bash
# После перезагрузки — смотрим текущие P-стейты
cat /sys/class/drm/card0/device/pp_od_clk_voltage
```

```bash
# Пример: снизить напряжение на P7 (максимальный стейт) с ~1150 mV до 1050 mV
# Формат: SCLK <p-state> <freq_MHz> <voltage_mV>
echo "s 7 1340 1050" | sudo tee /sys/class/drm/card0/device/pp_od_clk_voltage
echo "c" | sudo tee /sys/class/drm/card0/device/pp_od_clk_voltage  # применить
```

```bash
# Применять при каждом старте — создать systemd-сервис
# /etc/systemd/system/amdgpu-undervolt.service
[Unit]
Description=AMD GPU undervolt
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo "s 7 1340 1050" > /sys/class/drm/card0/device/pp_od_clk_voltage && echo "c" > /sys/class/drm/card0/device/pp_od_clk_voltage'

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now amdgpu-undervolt
```

**Типичные значения для RX 580:**

| P-стейт | Частота | Заводское напряжение | После андервольта |
|---|---|---|---|
| P6 | 1257 MHz | ~1100 mV | 1000 mV |
| P7 | 1340 MHz | ~1150–1200 mV | 1050 mV |

> Снижай по 25–50 mV за раз. Если артефакты или зависания — откатись на +25 mV.

```bash
# Мониторинг температуры GPU
watch -n 1 "cat /sys/class/drm/card0/device/hwmon/hwmon*/temp1_input | awk '{print \$1/1000 \"°C\"}'"

# Или через radeontop
sudo pacman -S radeontop
radeontop
```

---

## ⚠️ Подводные камни

- После изменений в BIOS всегда жми **F10 (Save & Exit)** — без сохранения изменения не применяются
- XMP может быть нестабилен на некоторых связках плата+память — тест `memtest86` обязателен
- `Above 4G Decoding` может конфликтовать со старыми BIOS/платами — если система не стартует, откати
- Андервольт GPU индивидуален для каждого чипа — значения с интернета это ориентир, не гарантия
- `amdgpu.ppfeaturemask=0xffffffff` включает нестабильные фичи — на продакшн-машинах осторожно
