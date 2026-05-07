---
title: "Единицы и функции"
---

# CSS — Единицы и функции

## 💻 clamp() — fluid значения

Значение плавно меняется между min и max в зависимости от viewport:

```css
/* clamp(минимум, предпочтительное, максимум) */

/* Fluid typography — без media queries */
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  /*         мин   плавно  макс        */
}

/* Fluid spacing */
.section {
  padding: clamp(1rem, 5vw, 4rem);
}

/* Fluid container */
.container {
  width: clamp(320px, 90%, 1200px);
}
```

## 💻 min() и max()

```css
/* min() — выбирает наименьшее */
.sidebar {
  width: min(300px, 100%);  /* 300px или вся ширина если меньше */
}

/* max() — выбирает наибольшее */
.content {
  padding: max(1rem, 5vw);  /* минимум 1rem, растёт с viewport */
}

/* Вместо media query */
.grid {
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
}
```

---

## 💻 dvh / svh / lvh — viewport на мобиле

Проблема: на мобиле `100vh` включает адресную строку браузера → контент обрезается.

```css
/* dvh = dynamic viewport height — меняется при скролле */
.hero {
  height: 100dvh;  /* всегда точно = видимая область */
}

/* svh = small — минимальная высота (адресная строка видна) */
/* lvh = large — максимальная высота (адресная строка скрыта) */

/* Безопасный fallback */
.hero {
  height: 100vh;    /* старые браузеры */
  height: 100dvh;   /* современные */
}
```

| | Что измеряет |
|---|---|
| `vh` | Всё окно браузера (с UI-хромом) |
| `dvh` | Текущий видимый viewport (изменяется) |
| `svh` | Наименьший viewport (UI виден) |
| `lvh` | Наибольший viewport (UI скрыт) |

```css
/* Аналоги для ширины */
dvw, svw, lvw

/* И универсальные */
dvi, svi, lvi   /* inline axis */
dvb, svb, lvb   /* block axis */
```

---

## 💻 cqi / cqw — Container Query Units

Единицы относительно контейнера, а не viewport:

```css
.card {
  container-type: inline-size;
}

.card__title {
  font-size: clamp(1rem, 5cqi, 2rem);
  /* 5% от ширины .card, не от viewport */
}
```

| | |
|---|---|
| `cqi` | 1% от inline-size контейнера |
| `cqw` | 1% от ширины контейнера |
| `cqh` | 1% от высоты контейнера |
| `cqmin` | 1% от меньшей стороны |
| `cqmax` | 1% от большей стороны |

---

## 💻 fit-content / min-content / max-content

```css
/* fit-content — ширина по содержимому */
.tag {
  width: fit-content;     /* как display: inline, но остаётся block */
}

.popup {
  width: fit-content;
  max-width: 90vw;        /* с ограничением */
}

/* min-content — минимум чтобы не было переноса слов */
/* max-content — весь контент в одну строку */
.grid {
  grid-template-columns: max-content 1fr;
  /* первая колонка — по контенту, вторая — остаток */
}
```

---

## 💻 ch и lh

```css
/* ch = ширина символа "0" */
.input         { width: 20ch; }    /* ровно 20 символов */
.code-block    { max-width: 80ch; }

/* lh = текущий line-height */
.icon-inline   { width: 1lh; height: 1lh; }   /* иконка = строка */
.paragraph-gap { margin-bottom: 1.5lh; }
```

---

## ⚠️ Подводные камни

- `dvh` не поддерживается в Safari < 15.4 — добавляй `vh` как fallback
- `cqi/cqw` требуют `container-type` на родителе
- `clamp()` с `vw` в font-size — проверяй читаемость на маленьких экранах
- `max-content` может вылезти за границы родителя — ограничивай `max-width`
