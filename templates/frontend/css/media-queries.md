---
title: "Media Queries"
---

# CSS — Media Queries

## 💻 prefers-reduced-motion

Пользователи с вестибулярными расстройствами или эпилепсией могут отключить анимации в ОС:

```css
/* Базовое — отключить все анимации */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Лучше — убрать именно декоративные анимации */
.hero-animation {
  animation: float 3s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-animation {
    animation: none;
  }
}

/* Или наоборот — добавить анимацию только тем кто не против */
@media (prefers-reduced-motion: no-preference) {
  .btn {
    transition: transform 0.2s, box-shadow 0.2s;
  }
}
```

---

## 💻 prefers-color-scheme

```css
:root {
  --bg:   #ffffff;
  --text: #111111;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg:   #111111;
    --text: #f5f5f5;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

> Или через `light-dark()` без media query — см. [CSS — Цвет](color.md).

---

## 💻 prefers-contrast

Пользователь запросил высококонтрастный режим:

```css
@media (prefers-contrast: more) {
  .btn {
    border: 2px solid currentColor;
    outline: 2px solid;
  }

  .text-muted {
    color: inherit;  /* убрать приглушённый цвет */
  }
}

@media (prefers-contrast: less) {
  /* Для пользователей которым нужен меньший контраст */
  body {
    filter: contrast(0.9);
  }
}
```

---

## 💻 forced-colors — Windows High Contrast

Windows High Contrast Mode заменяет цвета системными. Важно не сломать кастомные UI-элементы:

```css
/* Кастомный чекбокс — в forced-colors теряет стили */
.checkbox {
  background: blue;
  border: none;
}

@media (forced-colors: active) {
  .checkbox {
    /* Вернуть системные цвета */
    background: ButtonFace;
    border: 2px solid ButtonText;
    forced-color-adjust: none;  /* не применять системные цвета автоматически */
  }
}
```

**Системные цвета в forced-colors:**

| | |
|---|---|
| `ButtonFace` | Фон кнопки |
| `ButtonText` | Текст кнопки |
| `Canvas` | Фон страницы |
| `CanvasText` | Основной текст |
| `Highlight` | Выделение |
| `LinkText` | Цвет ссылки |

---

## 💻 pointer — тип устройства ввода

```css
/* Мышь — точный указатель */
@media (pointer: fine) {
  .btn { padding: 0.5rem 1rem; }
}

/* Тач — грубый указатель */
@media (pointer: coarse) {
  .btn { padding: 0.875rem 1.5rem; }  /* крупнее для пальца */
  .link { min-height: 44px; }         /* минимум 44px по WCAG */
}

/* Нет указателя — клавиатура, TV */
@media (pointer: none) {
  .hover-effect { display: none; }
}
```

---

## 💻 hover

```css
/* Стили hover только для устройств с мышью */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
}

/* Тач-устройства — убрать залипающий hover */
@media (hover: none) {
  .card:hover { transform: none; }
}
```

---

## 💻 Комбинирование

```css
/* Мышь + экран */
@media screen and (hover: hover) and (pointer: fine) {
  .tooltip:hover::after { display: block; }
}

/* Тач + маленький экран */
@media (max-width: 768px) and (pointer: coarse) {
  .dropdown { /* нативный select лучше */ }
}
```

---

## ⚠️ Подводные камни

- `prefers-reduced-motion` — не убирай все переходы, убирай только декоративные. Функциональные (открытие модалки) оставляй но делай мгновенными
- Планшеты с мышью = `pointer: fine` + `hover: hover` — не путай с мобильными
- `forced-colors` — тестируй на Windows с включённым High Contrast Mode
- `prefers-color-scheme` срабатывает до загрузки страницы — избегай flash of wrong theme через `<meta name="color-scheme">`
