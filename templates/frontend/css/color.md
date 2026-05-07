---
title: "Цвет"
---

# CSS — Цвет

## 💻 oklch() — современное цветовое пространство

`oklch` — перцептивно равномерное пространство. Одинаковый шаг в числах = одинаковый визуальный шаг.

```css
/* oklch(lightness chroma hue) */
.primary   { color: oklch(0.6  0.2  250); }  /* синий */
.success   { color: oklch(0.6  0.2  145); }  /* зелёный — та же яркость! */
.danger    { color: oklch(0.6  0.2   25); }  /* красный — та же яркость! */

/* В hsl яркость одинаковая, но визуально они разные.
   В oklch — реально одинаковые. */
```

**Параметры:**

| | Диапазон | Описание |
|---|---|---|
| `L` | 0–1 | Яркость (0 = чёрный, 1 = белый) |
| `C` | 0–0.4 | Насыщенность (0 = серый) |
| `H` | 0–360 | Оттенок |

```css
/* С прозрачностью */
color: oklch(0.6 0.2 250 / 0.5);

/* CSS-переменные */
:root {
  --hue: 250;
  --primary:    oklch(0.6 0.2 var(--hue));
  --primary-50: oklch(0.95 0.05 var(--hue));
  --primary-900:oklch(0.2 0.1 var(--hue));
}
```

---

## 💻 color-mix()

Смешивать цвета прямо в CSS — без SCSS функций:

```css
.btn-hover {
  background: color-mix(in oklch, #3b82f6 80%, white);
  /* 80% синего + 20% белого */
}

/* Полупрозрачный вариант основного цвета */
.overlay {
  background: color-mix(in oklch, var(--primary) 20%, transparent);
}

/* Тёмная версия */
.dark-variant {
  color: color-mix(in oklch, var(--accent) 70%, black);
}
```

```css
/* Генерация палитры через @property */
:root {
  --base: oklch(0.6 0.2 250);
  --light: color-mix(in oklch, var(--base), white 40%);
  --dark:  color-mix(in oklch, var(--base), black 30%);
}
```

---

## 💻 light-dark()

Автоматически выбирает цвет под тему — без media query:

```css
:root {
  color-scheme: light dark;  /* обязательно объявить */
}

.card {
  background: light-dark(#ffffff, #1e1e1e);
  color:       light-dark(#111111, #f5f5f5);
  border:  1px solid light-dark(#e5e7eb, #374151);
}
```

> Вместо:
> ```css
> @media (prefers-color-scheme: dark) {
>   .card { background: #1e1e1e; }
> }
> ```

---

## 💻 accent-color

Цвет системных элементов одной строкой:

```css
:root {
  accent-color: #3b82f6;
}
```

Меняет цвет у: `<input type="checkbox">`, `<input type="radio">`, `<input type="range">`, `<progress>`.

```css
/* Для конкретного элемента */
input[type="checkbox"] {
  accent-color: oklch(0.6 0.2 250);
  width: 1.2em;
  height: 1.2em;
}
```

---

## 💻 color-scheme

Системные элементы адаптируются под тему:

```css
/* Глобально */
:root {
  color-scheme: light dark;  /* поддерживает обе темы */
}

/* Принудить тёмную тему для конкретного элемента */
.dark-section {
  color-scheme: dark;
  /* scrollbars, inputs, selects — автоматически тёмные */
}
```

```html
<!-- Или через meta для всей страницы -->
<meta name="color-scheme" content="light dark">
```

---

## ⚠️ Подводные камни

- `oklch()` не поддерживается в IE и старых Safari — используй `@supports` или `color-mix` fallback
- `color-mix()` требует указать цветовое пространство (`in oklch`, `in srgb`)
- `light-dark()` требует `color-scheme` объявленного на `:root`
- Высокая насыщенность oklch (C > 0.3) может выйти за пределы sRGB — браузер клипает цвет
