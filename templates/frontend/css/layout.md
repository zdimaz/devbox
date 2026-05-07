---
title: "Layout"
---

# CSS — Современный Layout

## 💻 subgrid

Вложенный элемент участвует в родительской сетке — колонки выравниваются автоматически:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Карточка занимает все 3 колонки своей строки */
.card {
  display: grid;
  grid-column: span 3;
  grid-template-columns: subgrid;  /* наследует колонки родителя */
}

/* Содержимое карточки выравнивается по общей сетке */
.card__image   { grid-column: 1; }
.card__content { grid-column: 2; }
.card__actions { grid-column: 3; }
```

```css
/* Subgrid по строкам */
.card {
  grid-row: span 3;
  grid-template-rows: subgrid;
  /* header, content, footer всех карточек на одном уровне */
}
```

---

## 💻 Логические свойства

Вместо `top/right/bottom/left` — `block/inline`. Автоматически адаптируются к RTL и вертикальным режимам:

```css
/* Вместо margin-left / margin-right */
.text {
  margin-inline: auto;          /* центрирование */
  margin-inline-start: 1rem;    /* left в LTR, right в RTL */
  margin-inline-end: 1rem;
}

/* Вместо margin-top / margin-bottom */
.section {
  margin-block: 2rem;
  padding-block: 1rem;
}

/* Вместо top/right/bottom/left в position */
.tooltip {
  inset: 0;                  /* top:0; right:0; bottom:0; left:0; */
  inset-block-start: 1rem;   /* top в горизонтальном режиме */
  inset-inline-end: 1rem;    /* right в LTR */
}

/* Вместо width/height */
.box {
  inline-size: 200px;    /* width */
  block-size: 100px;     /* height */
  max-inline-size: 100%; /* max-width */
}

/* border, border-radius */
.card {
  border-block-end: 1px solid #e5e7eb;   /* border-bottom */
  border-inline-start: 4px solid blue;   /* border-left */
  border-start-start-radius: 8px;        /* top-left */
}
```

---

## 💻 inset shorthand

```css
/* Вместо top: 0; right: 0; bottom: 0; left: 0; */
.overlay { inset: 0; }

/* Как padding/margin — вертикаль / горизонталь */
.popup { inset: 10px 20px; }

/* Все четыре */
.modal { inset: 10px 20px 30px 40px; }

/* Частичный */
.fixed-bottom {
  inset: auto 0 0;  /* top:auto; right:0; bottom:0; left:0 */
}
```

---

## 💻 content-visibility: auto

Браузер пропускает рендеринг элементов вне viewport — ускоряет загрузку длинных страниц:

```css
.article-card {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px;  /* заглушка размера пока не отрисован */
}
```

> Даёт прирост производительности на страницах с большим количеством карточек/постов. Не используй для элементов с анимацией в viewport.

---

## 💻 field-sizing: content

`input` и `textarea` автоматически растут под содержимое:

```css
textarea {
  field-sizing: content;    /* растёт по тексту */
  min-height: 3lh;          /* минимум 3 строки */
  max-height: 20lh;         /* максимум */
}

input[type="text"] {
  field-sizing: content;
  min-width: 10ch;
}
```

> Замена JavaScript auto-resize для textarea.

---

## 💻 overscroll-behavior

Контролировать что происходит когда скролл достигает края:

```css
/* Модальное окно не скроллит body под собой */
.modal {
  overflow-y: auto;
  overscroll-behavior: contain;  /* скролл не "перетекает" дальше */
}

/* Горизонтальный слайдер не скроллит страницу */
.slider {
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

/* Отключить pull-to-refresh на мобиле */
body {
  overscroll-behavior-y: none;
}
```

---

## 💻 scroll-snap

Нативный snap-скролл без JavaScript:

```css
.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;   /* обязательный snap по X */
  gap: 1rem;
}

.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;        /* start / center / end */
}

/* Вертикальный snap */
.sections {
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.section {
  height: 100dvh;
  scroll-snap-align: start;
}
```

---

## 💻 overflow-anchor

Предотвращает прыжок страницы когда выше загружается контент (например сообщения в чате):

```css
/* Включено по умолчанию */
.chat-messages {
  overflow-anchor: auto;   /* браузер держит позицию скролла */
}

/* Отключить — если нужно прыгать наверх при добавлении */
.feed {
  overflow-anchor: none;
}
```

---

## ⚠️ Подводные камни

- `subgrid` не поддерживается в Chrome < 117 — проверяй через `@supports`
- `field-sizing: content` — только Chrome/Edge, Safari 2024+. Firefox — нет
- `content-visibility: auto` — не применяй к элементам в viewport, будет мигание
- `scroll-snap-type: mandatory` — агрессивный, пользователь не может остановиться между snap-точками. Используй `proximity`
- Логические свойства — не смешивай с физическими (`margin-left` + `margin-inline-start`) на одном элементе
