---
title: "Типографика"
---

# CSS — Типографика

## 💻 text-wrap: balance

Равномерно распределяет текст по строкам — убирает короткий "хвост" в последней строке заголовка.

```css
h1, h2, h3 {
  text-wrap: balance;   /* равномерные строки */
}

p {
  text-wrap: pretty;    /* умные переносы в параграфах, без висячих слов */
}
```

```
Без balance:           С balance:
Заголовок на две       Заголовок на
строки и хвост         две строки
```

> `balance` — для заголовков (до ~6 строк).  
> `pretty` — для параграфов, чуть медленнее рендеринг.

---

## 💻 text-underline-offset

Отступ подчёркивания от текста:

```css
a {
  text-underline-offset: 4px;   /* отодвинуть вниз */
}
```

## 💻 text-decoration-thickness

Толщина линии подчёркивания:

```css
a {
  text-decoration-line:      underline;
  text-decoration-thickness: 2px;          /* фиксированная */
  text-decoration-thickness: 0.1em;        /* относительная */
  text-decoration-thickness: from-font;    /* из метрик шрифта */
}
```

## 💻 text-decoration-skip-ink

Подчёркивание огибает выносные элементы букв (g, p, y, j):

```css
a {
  text-decoration-skip-ink: auto;   /* по умолчанию в большинстве браузеров */
  text-decoration-skip-ink: none;   /* сплошная линия, не огибает */
}
```

## 💻 Комбо для красивых ссылок

```css
a {
  text-decoration-line:      underline;
  text-decoration-color:     currentColor;
  text-decoration-thickness: 1px;
  text-underline-offset:     3px;
  text-decoration-skip-ink:  auto;
  transition: text-decoration-color 0.2s;
}

a:hover {
  text-decoration-color: transparent;
}
```

---

## 💻 hanging-punctuation

Кавычки и тире выносятся за поле текста — профессиональная типографика:

```css
p {
  hanging-punctuation: first last;
}
```

```
Без:  «Цитата начинается здесь»
С:   «Цитата начинается здесь»
     ^ кавычка за полем
```

> Поддержка: Safari. В Chrome/Firefox пока нет. Используй как прогрессивное улучшение.

---

## 💻 ch и lh единицы

```css
/* ch = ширина символа "0" в текущем шрифте */
.input {
  width: 20ch;     /* ровно 20 символов */
}

.code-block {
  max-width: 80ch; /* классическая ширина кода */
}

/* lh = текущий line-height */
.icon {
  width: 1lh;     /* иконка = высота строки, выравнивается с текстом */
  height: 1lh;
}

.gap {
  margin-top: 0.5lh;
}
```

---

## ⚠️ Подводные камни

- `text-wrap: balance` работает только до ~6 строк — на длинных параграфах нет эффекта
- `hanging-punctuation` — только Safari, используй как enhancement
- `ch` зависит от шрифта — с разными шрифтами ширина разная
