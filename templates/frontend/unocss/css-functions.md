---
title: "CSS Функции (theme / @screen)"
---

# CSS Функции (UnoCSS)

## 🧠 Суть

Функции `theme()` и `@screen` — доступ к дизайн-токенам из CSS.

## 💻 theme()

Достаёт значения из `uno.config.js`:

```css
/* Цвета */
.element {
  color: theme("colors.orange");
  background: theme("colors.neutral");
}

/* Размеры шрифтов */
.element {
  font-size: theme("fontSize.3");
} /* 1.25rem */

/* Отступы */
.element {
  padding: theme("spacing.4");
} /* 1rem */

/* Брейкпоинты */
.element {
  max-width: theme("breakpoints.xl");
} /* 80rem */
```

## 💻 @screen

Медиа-запросы из конфига:

```css
/* Мобайл-фёрст (min-width) */
.element {
  display: block;
}

@screen md {
  .element {
    display: flex;
  }
}
/* → @media (min-width: 48rem) */

/* Десктоп-фёрст (max-width) */
@screen lt-md {
  .sidebar {
    display: none;
  }
}
/* → @media (max-width: 47.9375rem) */
```

### Брейкпоинты

| Имя | Значение | Пиксели |
| --- | -------- | ------- |
| sm  | 30rem    | 480px   |
| md  | 48rem    | 768px   |
| lg  | 64rem    | 1024px  |
| xl  | 80rem    | 1280px  |
| 2xl | 96rem    | 1536px  |

**Префикс `lt-`** = less than: `@screen lt-md` → меньше md

## 💻 Пример — скроллбар

```css
html {
  scrollbar-color: theme("colors.orange") theme("colors.muted");
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  @apply size-2;
}
::-webkit-scrollbar-thumb {
  background: theme("colors.orange");
}
```

## ⚠️ Подводные камни

- `theme()` резолвится на билде — никаких рантайм затрат
- Ключи должны точно совпадать с `uno.config.js`
- `@screen` требует `transformerDirectives()` в конфиге
