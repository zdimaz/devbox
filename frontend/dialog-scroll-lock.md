# Блокировка скролла (Dialog)

## 🧠 Суть
Как заблокировать скролл фона при открытом модальном окне. Без JS — только CSS.

## 💻 Решение

### Блокировка при открытом dialog

```css
html:has(.base-dialog[open]) {
  @apply overflow-hidden h-full;
}
```

**Пояснения:**
- `:has()` — проверяет есть ли открытый элемент
- `.base-dialog[open]` — нативный `<dialog open>`
- `overflow-hidden` — блокирует скролл
- Работает без JS, браузер сам ставит `[open]`

### Scrollbar gutter (десктоп)

```css
@media (pointer: fine) {
  html {
    scrollbar-gutter: stable;
  }
}
```

**Зачем:**
- Когда скролл блокируется — полоса исчезает → контент прыгает
- `scrollbar-gutter: stable` — резервирует место под полосу
- `pointer: fine` — только для мыши (десктоп)

### Тач-устройства (мобилки)

```css
@media (pointer: coarse), (hover: none) {
  html {
    scrollbar-gutter: initial;
  }
}
```

**Зачем:**
- На мобилках нет скроллбара → gutter не нужен
- `pointer: coarse` — тач-устройства
- `hover: none` — нет hover (мобилки)

## 📋 Полный код

```css
/* Блокировка скролла при открытом dialog */
html:has(.base-dialog[open]) {
  @apply overflow-hidden h-full;
}

/* Десктоп — резервируем место под скроллбар */
@media (pointer: fine) {
  html {
    scrollbar-gutter: stable;
  }
}

/* Мобилки — не нужно, скроллбара нет */
@media (pointer: coarse), (hover: none) {
  html {
    scrollbar-gutter: initial;
  }
}
```

## ⚠️ Подводные камни
- `:has()` — поддержка ~96% браузеров (нет в Firefox без флага до 2024)
- `scrollbar-gutter` — может давать пустую полосу на macOS (где скроллбар скрыт)
- Нативный `<dialog>` — не работает в IE11

## 🔗 Связанные темы
- [CSS Функции](/frontend/css-functions)
