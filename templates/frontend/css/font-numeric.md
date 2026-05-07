---
title: "font-variant-numeric"
---

# CSS — font-variant-numeric

## 🧠 Суть

Управление отображением цифр и числовых символов в шрифте — выравнивание ширины, дроби, порядковые числительные.

Самый частый кейс — **tabular-nums**: все цифры одинаковой ширины, числа не "прыгают" при изменении значения.

---

## 💻 tabular-nums — главное

```css
.price,
.timer,
.counter,
.table-numbers {
  font-variant-numeric: tabular-nums;
}
```

**Когда нужен:**
- Таблицы с числами — колонки выравниваются
- Таймеры и счётчики — цифры не сдвигают соседей при смене значения
- Цены — одинаковые отступы под разные суммы
- Дашборды — числа в карточках

```
Без tabular-nums:   С tabular-nums:
1 111               1 111
9 999               9 999
1 000 000           1 000 000
← ширина гуляет    ← ровно выровнено
```

---

## 💻 Все значения font-variant-numeric

```css
font-variant-numeric:
  normal             /* сброс всего */

  /* Ширина цифр */
  tabular-nums       /* все цифры одной ширины (для таблиц, таймеров) */
  proportional-nums  /* цифры разной ширины (по умолчанию в большинстве шрифтов) */

  /* Высота цифр */
  lining-nums        /* цифры одной высоты, на базовой линии (0123456789) */
  oldstyle-nums      /* цифры с выносными элементами, как буквы (выглядит в тексте) */

  /* Дроби */
  diagonal-fractions /* 1/2 → красивая диагональная дробь */
  stacked-fractions  /* 1/2 → вертикальная дробь */

  /* Порядковые числительные */
  ordinal            /* 1st, 2nd → надстрочный суффикс */

  /* Слеш нуля */
  slashed-zero;      /* 0 с чёрточкой — чтобы не путать с O */
```

**Комбинирование:**

```css
/* tabular + lining — стандарт для таблиц */
font-variant-numeric: tabular-nums lining-nums;

/* oldstyle в тексте выглядит органично */
font-variant-numeric: proportional-nums oldstyle-nums;

/* дроби */
font-variant-numeric: diagonal-fractions;
```

---

## 💻 Альтернатива через font-feature-settings

Низкоуровневый способ — напрямую управляет OpenType-фичами:

```css
/* tabular-nums */
font-feature-settings: "tnum" 1;

/* lining-nums */
font-feature-settings: "lnum" 1;

/* oldstyle-nums */
font-feature-settings: "onum" 1;

/* diagonal-fractions */
font-feature-settings: "frac" 1;

/* slashed-zero */
font-feature-settings: "zero" 1;

/* комбо */
font-feature-settings: "tnum" 1, "lnum" 1;
```

> `font-variant-numeric` предпочтительнее — более читаемо и стандартно.  
> `font-feature-settings` нужен только если `font-variant-numeric` не работает в конкретном шрифте.

---

## 💻 Практические примеры

```css
/* Таблица с числами */
.data-table td {
  font-variant-numeric: tabular-nums lining-nums;
  text-align: right;
}

/* Таймер — цифры не прыгают */
.timer {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";  /* запасной вариант */
}

/* Цена */
.price {
  font-variant-numeric: tabular-nums lining-nums;
}

/* Обычный текст с цифрами — oldstyle выглядит элегантнее */
.article-body {
  font-variant-numeric: oldstyle-nums;
}

/* Дроби в рецептах, характеристиках */
.ingredient-amount {
  font-variant-numeric: diagonal-fractions;
}

/* Код/терминал — нуль со слешем */
.monospace-output {
  font-variant-numeric: slashed-zero;
}
```

---

## 💻 Поддержка браузерами

`font-variant-numeric` — 98%+ (все современные браузеры).

Поддержка зависит от **шрифта** — если в шрифте нет OpenType-фичи `tnum`, tabular-nums не сработает. Системные шрифты и большинство Google Fonts поддерживают.

```css
/* Проверить — если шрифт поддерживает, числа будут одной ширины */
.test {
  font-variant-numeric: tabular-nums;
}
```

**Шрифты с хорошей поддержкой:** Inter, Roboto, Source Sans, IBM Plex, JetBrains Mono.

---

## ⚠️ Подводные камни

- Если шрифт не содержит нужную OpenType-фичу — свойство тихо игнорируется
- `font-feature-settings` перезаписывается целиком — при комбинировании перечисляй все фичи в одном объявлении
- `oldstyle-nums` может выглядеть странно в UI-компонентах — используй только в длинном тексте
- Не все кастомные шрифты поддерживают `diagonal-fractions` — проверяй в браузере
