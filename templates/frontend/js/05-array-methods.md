# Array Methods — расширенная азбука

## Шпаргалка-таблица (основная восьмёрка)
| Метод | Вопрос | Возвращает | Метафора |
|---|---|---|---|
| `filter` | Оставить НЕКОТОРЫЕ? | новый массив | Сито |
| `map` | Преобразовать КАЖДЫЙ? | новый массив | Конвейер |
| `reduce` | Свести В ОДНО? | одно значение | Кассир |
| `find` | Что нашёл? | объект (первая находка) | Лупа |
| `findIndex` | Где лежит? | число (индекс) | Координаты |
| `some` | Есть ХОТЯ БЫ ОДИН? | boolean | Детектор |
| `every` | ВСЕ подходят? | boolean | Строгий проверяющий |

## Второй эшелон (знает каждый джун)
| Метод | Что делает |
|---|---|
| `includes` | есть ли значение? `[1,2].includes(2)` → true (простые типы!) |
| `indexOf` | позиция значения или -1 |
| `join` | массив → строка: `["a","b"].join(", ")` → "a, b" |
| `slice` | копия части БЕЗ мутации: `arr.slice(1, 3)` |
| `splice` | ВЫРЕЗАЕТ на месте (мутирует!): `arr.splice(idx, 1)` — удалить элемент |
| `concat` | склеить массивы (без мутации): `[1].concat([2])` → но spread короче: `[...[1], ...[2]]` |
| `flat` | расплющить вложенность: `[1, [2, [3]]].flat(2)` → [1,2,3] |
| `flatMap` | map + flat в один проход: `tours.flatMap(t => t.photos)` |
| `at` | элемент с конца: `arr.at(-1)` — последний элемент (ES2022) |

## Фичи, о которых ты спрашивал
```js
// filter(Boolean) — классика: выкинуть ВСЕ falsy из массива
const mixed = [0, "сулак", "", null, 2500, undefined, "нарын"];
mixed.filter(Boolean);
// → ["сулак", 2500, "нарын"] — убрал 0, "", null, undefined
// Это просто filter(v => Boolean(v)) в короткой записи

// findLast / findLastIndex (ES2023) — ищет с КОНЦА
tours.findLast(t => t.category === "nature");

// at() — замена длинной записи
arr[arr.length - 1]   // ❌ длинно
arr.at(-1)            // ✅ коротко
```

## reduce — «кассир»
```js
const total = tours.reduce((acc, tour) => acc + tour.price, 0);
//                        ↑корзина  ↑товар              ↑старт, ВСЕГДА пиши!
```
- Формула: `(что копим, текущий) => как копим, НАЧАЛЬНОЕ ЗНАЧЕНИЕ`
- Каждый шаг ОБЯЗАТЕЛЬНО `return acc` — иначе `undefined`
- **KISS:** внутри reduce if/push? — скорее нужен filter/map

### reduce — не только суммы
```js
// Группировка: { history: [...], nature: [...] } — руками
const byCategory = tours.reduce((acc, tour) => {
  (acc[tour.category] ??= []).push(tour);   // ??= — создать массив, если нет
  return acc;
}, {});

// Поиск максимума
const maxPrice = tours.reduce((max, t) => t.price > max ? t.price : max, 0);
// Но для max/min проще: Math.max(...tours.map(t => t.price))
```

## slice vs splice — самая частая путаница
```js
// slice — «отрезать КОПИЮ», не трогает оригинал (буква "c" = copy)
const copy = tours.slice(0, 2);     // элементы 0 и 1, tours цел

// splice — «шов хирургический», МУТИРУЕТ массив (удаляет/вставляет)
tours.splice(1, 1);                 // удали 1 элемент начиная с индекса 1
// Мнемоника: сliCe — Копия, сpliCe — хирургия (мутирует)
```

## Array.from — массив из чего угодно
```js
Array.from("abc");           // ["a", "b", "c"] — из строки
Array.from({ length: 5 }, (_, i) => i);  // [0, 1, 2, 3, 4] — быстро создать
Array.from(nodeList);        // NodeList → настоящий массив (нужен для map!)
// Но чаще короче: [...nodeList]
```

## find vs findIndex
```js
const tour = tours.find(t => t.name === "Сулак");
tour.price = 1999;                    // find дал ссылку → массив изменён

const idx = tours.findIndex(t => t.name === "Сулак"); // число!
tours[idx].price = 2200;              // нужен сам arr[idx], чтобы менять
```

## ⚠️ Мутация — антипаттерн (критично для React!)
```js
// ❌ Портим исходные данные — React не заметит и не перерисует экран
tours.push(newTour);
tour.price = 999;
tours.sort(...)                       // sort мутирует!

// ✅ Новые массивы
const updated = tours.map(t => t.name === "Сулак" ? { ...t, price: 999 } : t);
const sorted = [...tours].sort((a, b) => a.price - b.price);  // копия + sort
```

## Цепочки читаются как предложение
```js
tours.filter(t => t.price < 2000).map(t => t.name).length;
//   дешёвые           только имена            сколько?
```

**Поддержка:** map/filter/reduce с 2009 (ES5), find/findIndex с 2015 (ES6), at с 2022, findLast/toSorted с 2023. Всё работает в современных браузерах, используй смело.

> Обновлено: 01.10.2026
