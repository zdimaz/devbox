# Оптимизация шрифтов

## 🧠 Суть

Конвертация TTF/OTF → WOFF2 + субсеттинг для уменьшения размера.

## ⚙️ Установка

```bash
# Основной инструмент
sudo pacman -S python-fonttools python-brotli woff2

# Или через AUR
yay -S woff2
```

## 💻 Конвертация TTF → WOFF2

```bash
# Одиночный файл
fonttools ttLib.woff2 compress font.ttf
```

Или через `woff2`:

```bash
woff2_compress font.ttf
```

Создаст `font.woff2`.

```bash
# Все TTF в папке
for font in *.ttf; do
    fonttools ttLib.woff2 compress "$font"
done
```

## 💻 Субсеттинг (только нужные символы)

```bash
pyftsubset font.ttf \
  --output-file=font-optimized.woff2 \
  --flavor=woff2 \
  --layout-features=* \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0400-045F,U+0490-0491" \
  --desubroutinize
```

**Результат:** 180KB → 60KB (67% меньше)

### Unicode Ranges

| Диапазон      | Символы         |
| ------------- | --------------- |
| `U+0020-007E` | Basic Latin     |
| `U+00A0-00FF` | Latin Extended  |
| `U+0400-045F` | Cyrillic        |
| `U+0490-0491` | Ґ ґ (Ukrainian) |
| `U+2013-2014` | Dashes          |
| `U+2018-201E` | Quotes          |
| `U+20AC`      | Euro            |

## 💻 CSS подключение

```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-display: swap;
}

/* С разделением по языкам */
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont-cyrillic.woff2") format("woff2");
  unicode-range: U+0400-04FF;
}
```

## ⚠️ Подводные камни

- `--desubroutinize` уменьшает файл, но не для всех шрифтов
- Не удаляй нужные символы → проверяй текст на сайте
- Только WOFF2 — остальные форматы не нужны
