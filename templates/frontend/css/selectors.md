---
title: "Селекторы"
---

# CSS — Современные селекторы

## 💻 :has() — parent selector

Выбрать родителя по наличию дочернего элемента. Меняет подход к CSS.

```css
/* Карточка с изображением — другой layout */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Форма с ошибкой */
.form:has(.error) {
  border: 1px solid red;
}

/* Параграф после заголовка */
h2 + p { }           /* следующий сосед — старый способ */
:has(h2) > p { }     /* первый p внутри того что содержит h2 */

/* Input в фокусе — стилизовать label */
.field:has(input:focus) label {
  color: blue;
}

/* Навигация с открытым дропдауном */
.nav-item:has(.dropdown:hover) > a {
  color: var(--accent);
}

/* li без дочерних li (листовой элемент) */
li:not(:has(li)) {
  font-weight: normal;
}
```

---

## 💻 :focus-visible

Показывать outline только при навигации с клавиатуры, не при клике мышью:

```css
/* Плохо — скрывает outline везде */
button:focus { outline: none; }

/* Хорошо — убирает только при клике, оставляет при Tab */
button:focus:not(:focus-visible) { outline: none; }

/* Или */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

---

## 💻 :focus-within

Родитель получает стиль когда фокус внутри него:

```css
/* Подсветить всю группу поля при фокусе на input */
.field:focus-within label {
  color: #3b82f6;
}

.field:focus-within .field__hint {
  opacity: 1;
}

/* Навигационный блок при фокусе */
.nav:focus-within {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
```

---

## 💻 :placeholder-shown

Стилизовать input пока виден placeholder (то есть пока он пустой):

```css
/* Скрыть label когда поле пустое (floating label паттерн) */
.field__label {
  transform: translateY(-100%);
  font-size: 0.85em;
}

input:placeholder-shown + .field__label {
  transform: translateY(0);
  font-size: 1em;
}
```

---

## 💻 :nth-child(An+B of .selector)

`nth-child` с фильтром по классу — выбирает только среди элементов с нужным классом:

```css
/* Каждый чётный .card (игнорируя другие дочерние элементы) */
.card:nth-child(even of .card) {
  background: #f9fafb;
}

/* Первые три .featured */
.item:nth-child(-n+3 of .featured) {
  font-weight: bold;
}
```

> Раньше `:nth-child(even)` считал все дочерние, включая div, span и другие — теперь можно фильтровать.

---

## 💻 ::marker

Стилизовать маркер списка без `list-style: none` и псевдоэлементов:

```css
li::marker {
  color: #3b82f6;
  font-size: 1.2em;
}

/* Кастомный символ */
li::marker {
  content: "→ ";
  color: var(--accent);
}

/* Нумерованный список */
ol li::marker {
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}
```

---

## 💻 ::backdrop

Фон за `<dialog>` и полноэкранными элементами:

```css
dialog::backdrop {
  background: oklch(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
}

/* Анимация появления backdrop */
dialog[open]::backdrop {
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

## 💻 ::selection

Стиль выделенного текста:

```css
::selection {
  background: oklch(0.7 0.15 250 / 0.3);
  color: inherit;
}

/* Для конкретного элемента */
.code-block::selection {
  background: #fbbf24;
  color: #000;
}
```

---

## ⚠️ Подводные камни

- `:has()` не работает в Firefox < 121 — проверяй если нужна поддержка старых версий
- `:nth-child(of .selector)` — поддержка с 2023 года, Safari 9+, Chrome 111+
- `::marker` — ограниченный набор свойств: `color`, `content`, `font-*`, `white-space`
- `:focus-visible` — добавляй как дополнение к `:focus`, не замену (accessibility)
