# Variables & Naming

## Keywords

```js
const price = 1500; // default. Не перезаписывается
let discount = 10; // только если реально перезаписываешь
// var — мёртв, НЕ использовать
```

### Ловушка: const не делает объект неизменяемым!

```js
const tour = { price: 1500 };
tour.price = 2000; // ✅ работает! const бронирует ССЫЛКУ, не содержимое
tour = {}; // ❌ TypeError — саму переменную перезаписать нельзя
```

## Naming Conventions (договорённости всех разработчиков)

```js
const VAT_RATE = 0.15; // UPPER_SNAKE_CASE — фиксированные значения:
// ставки, лимиты, URL, проценты.
// НЕ для переменных, которые меняются!

let userName = "Ali"; // camelCase — переменные и функции
function calcTotal() {} // camelCase + глагол: что делает

const TourCard = () => {}; // PascalCase — только React-компоненты и классы

// ❌ Запрещено: a, b, data, temp, info, item2 — мусорные имена
```

## Template Literals (шаблонные строки) — синтаксический сахар №1

```js
const name = "Сулак";
const price = 2500;

// ❌ Склейка плюсами — боль
const s1 = "Тур " + name + " стоит " + price + "$";

// ✅ Интерполяция через ${} — обратные кавычки!
const s2 = `Тур ${name} стоит ${price}$`;
const s3 = `Со скидкой: ${price * 0.9}$`; // внутри можно считать!
const multiline = `строка 1
строка 2`; // многострочность из коробки
```

## typeof — определение типа

```js
typeof "abc"; // "string"
typeof 1500; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof {}; // "object"
typeof []; // "object" ⚠️ массив тоже object!
Array.isArray([]); // true ← правильная проверка «это массив?»
typeof null; // "object" ⚠️ исторический баг JS, запомни как факт
```

## Magic Numbers → Constants (DRY)

```js
// ❌ Антипаттерн
if (guests > 20) { ... }

// ✅ Паттерн
const MAX_GUESTS = 20;
if (guests > MAX_GUESTS) { ... }
```

> Обновлено: 01.10.2026
