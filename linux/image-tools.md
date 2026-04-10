# Оптимизация изображений

## 🧠 Суть
Конвертация и сжатие изображений: WebP, AVIF, PNG, JPEG.

## ⚙️ Установка

```bash
# ImageMagick (универсальный)
sudo pacman -S imagemagick

# WebP
sudo pacman -S libwebp

# AVIF
sudo pacman -S libavif

# Оптимизаторы
sudo pacman -S optipng jpegoptim pngquant oxipng

# Squoosh CLI (Google)
npm i -g @squoosh/cli

# Sharp CLI
npm i -g sharp-cli
```

## 💻 Конвертация

### PNG/JPEG → WebP

```bash
# Один файл
cwebp -q 85 input.png -o output.webp

# Все PNG
for img in *.png; do
    cwebp -q 85 "$img" -o "${img%.png}.webp"
done
```

### PNG/JPEG → AVIF

```bash
# Через ImageMagick
magick input.png -quality 85 output.avif

# Через avifenc (лучше)
avifenc -s 4 input.png output.avif
```

### Batch конвертация

```bash
for img in *.{jpg,jpeg,png}; do
    [ -f "$img" ] || continue
    cwebp -q 85 "$img" -o "${img%.*}.webp"
    avifenc -s 4 "$img" "${img%.*}.avif"
done
```

## 💻 Сжатие без потерь

### PNG

```bash
optipng -o7 image.png       # лучшее сжатие
oxipng -o max image.png     # быстрое
pngquant --quality=65-80 image.png  # с потерями, 70% меньше
```

### JPEG

```bash
jpegoptim --max=85 photo.jpg
```

## 📊 Сравнение форматов

| Формат | Размер | Качество | Браузеры |
|---|---|---|---|
| JPEG | 100KB | ★★★ | 100% |
| PNG | 250KB | ★★★★★ | 100% |
| WebP | 45KB | ★★★★ | 97% |
| AVIF | 30KB | ★★★★★ | 90% (Safari 16+) |

**Рекомендация:** Всегда `<picture>` с fallback: AVIF → WebP → JPEG

## 💻 Squoosh CLI (лучший оптимизатор)

```bash
# WebP
squoosh-cli --webp '{"quality":85}' image.png

# AVIF
squoosh-cli --avif '{"cqLevel":30}' image.png
```

## 💻 Sharp CLI (batch)

```bash
sharp -i "*.jpg" -o "output/{name}.{format}" \
  resize 320,640,1024 \
  --webp --avif
```

## ⚠️ Подводные камни
- AVIF нет в Safari < 16 → всегда fallback
- Squoosh требует Node.js 16+
- `oxipng -o max` медленный для больших файлов

## 🔗 Связанные темы
- [Изображения](/frontend/images)
- [Шрифты](/frontend/fonts)
