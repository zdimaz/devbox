---
title: "@layer, @property, @container"
---

# CSS — Каскад и современные фичи

## 💻 @layer — управление каскадом

Явный порядок приоритета стилей — без войн специфичности:

```css
/* Объявить порядок слоёв (первый = наименьший приоритет) */
@layer reset, base, components, utilities;

@layer reset {
  * { box-sizing: border-box; margin: 0; }
}

@layer base {
  a { color: blue; }
}

@layer components {
  .btn { color: white; background: blue; }
}

@layer utilities {
  .text-red { color: red; }  /* выигрывает у всего выше */
}
```

```css
/* Стили вне @layer всегда выигрывают у слоёв */
a { color: green; }  /* перебьёт @layer base a { color: blue; } */

/* Импортировать в слой */
@import url("reset.css") layer(reset);
```

> Решает проблему "!important войн" при подключении сторонних CSS.

---

## 💻 @property — типизированные CSS-переменные

Переменная с типом, наследованием и начальным значением — можно анимировать:

```css
@property --hue {
  syntax: '<number>';
  inherits: false;
  initial-value: 250;
}

@property --opacity {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* Анимация переменной — без @property не работает */
.btn {
  background: oklch(0.6 0.2 var(--hue));
  transition: --hue 0.3s;
}

.btn:hover {
  --hue: 150;  /* плавно меняет цвет через oklch */
}

/* Анимированный градиент */
.card {
  background: linear-gradient(var(--gradient-angle), #3b82f6, #8b5cf6);
  animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
  to { --gradient-angle: 360deg; }
}
```

---

## 💻 @container — container queries

Стили по размеру родителя, а не viewport:

```css
/* 1. Объявить контейнер */
.card-wrapper {
  container-type: inline-size;
  container-name: card;  /* опционально */
}

/* 2. Стили внутри контейнера */
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}

@container card (min-width: 600px) {
  .card__title {
    font-size: 1.5rem;
  }
}

/* Один компонент, разный layout в зависимости от места */
.product-card {
  /* в узкой колонке — вертикальный */
  display: flex;
  flex-direction: column;
}

@container (min-width: 350px) {
  .product-card {
    /* в широком контейнере — горизонтальный */
    flex-direction: row;
  }
}
```

---

## 💻 @starting-style — анимация появления

Анимировать элемент при его добавлении в DOM (или при `display: none → block`):

```css
.toast {
  transition: opacity 0.3s, transform 0.3s;
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .toast {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

```css
/* Анимация dialog при открытии */
dialog[open] {
  transition: opacity 0.2s, transform 0.2s;
  opacity: 1;
  transform: scale(1);

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

---

## 💻 transition-behavior: allow-discrete

Анимировать свойства которые раньше нельзя было — `display`, `visibility`, `overlay`:

```css
/* Анимация исчезновения — display: none больше не обрывает transition */
.dropdown {
  display: block;
  opacity: 1;
  transition: opacity 0.2s, display 0.2s;
  transition-behavior: allow-discrete;
}

.dropdown.hidden {
  display: none;
  opacity: 0;
}

/* Анимация dialog закрытия */
dialog {
  transition: opacity 0.2s, display 0.2s allow-discrete;
}

dialog:not([open]) {
  opacity: 0;
  display: none;
}
```

---

## 💻 @supports — feature detection

```css
/* Применить стили только если свойство поддерживается */
@supports (content-visibility: auto) {
  .card { content-visibility: auto; }
}

@supports (display: grid) and (subgrid: column) {
  .grid { grid-template-columns: subgrid; }
}

/* Отрицание */
@supports not (field-sizing: content) {
  /* JavaScript fallback */
}

/* Selector support */
@supports selector(:has(img)) {
  .card:has(img) { display: grid; }
}
```

---

## ⚠️ Подводные камни

- `@layer` — стили вне слоёв всегда выигрывают. Сторонние CSS без слоёв перебьют твои слои
- `@property` — не поддерживается в Firefox < 128
- `@container` — требует `container-type` на родителе; не работает по высоте без `container-type: size`
- `@starting-style` + `transition-behavior` — Chrome 117+, Safari 17.4+. Firefox — нет
- `@supports selector()` — поддержка неполная, проверяй через caniuse
