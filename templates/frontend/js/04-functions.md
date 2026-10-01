# Functions

## Callback (колбэк) — функция, переданная другой функции
Методы массивов, setTimeout, addEventListener — всё работает через колбэки: ты передаёшь функцию, а вызывает её НЕ ты, а метод в нужный момент.

```js
// Колбэк — обычная функция, просто переданная как аргумент
function greet(name) { console.log("Привет, " + name); }

function processUser(callback) {
  const name = "Ali";
  callback(name);        // вот тут вызвали ТВОЮ функцию изнутри
}

processUser(greet);       // не greet() — без скобок! Передаём саму функцию

// Аналогия: заказал пиццу, оставил номер. Пиццерия звонит ТЕБЕ, когда готово.
// Ты не знаешь, когда это случится — колбэк срабатывает по событию.
```

**Правило:** колбэк передаём БЕЗ скобок `arr.map(greet)`, со скобками `arr.map(greet())` — это вызов сразу, передастся результат, а не функция.

## Anonymous callbacks (как в методах массивов)
```js
// Именованная функция
const isCheap = t => t.price < 2000;
tours.filter(isCheap);

// Анонимная (стрелка прямо на месте) — 99% случаев
tours.filter(t => t.price < 2000);
```

## Callback внутри метода: параметры даёт метод, не ты
```js
tours.map((item, index, array) => item.name);
//          ↑элемент  ↑позиция  ↑весь массив — метод передаёт сам
```
| Метод | Что передаёт в колбэк |
|---|---|
| `map/filter/find/some/every` | `(элемент, индекс, массив)` |
| `reduce` | `(аккумулятор, элемент, индекс, массив)` |
| `sort` | `(a, b)` — пару для сравнения |
| `forEach` | `(элемент, индекс, массив)`, возвращает всегда `undefined` |

## ⚠️ forEach vs map
```js
// ❌ forEach не возвращает массив — результат потеряется
const names = [];
tours.forEach(t => names.push(t.name));  // велосипед

// ✅ map сделал это из коробки
const names = tours.map(t => t.name);
```
forEach — только для сайд-эффектов (console.log, отправка события). Нужен новый массив → map.

## Rest & Spread — «собери» и «разверни»
```js
// Rest: ...args собирает ОСТАТОК аргументов в массив
const sumAll = (...nums) => nums.reduce((a, b) => a + b, 0);
sumAll(1, 2, 3, 4);   // 10

// Spread: разворачивает массив в аргументы
const prices = [1500, 2500, 1800];
Math.max(...prices);  // 2500 — а Math.max не принимает массивы!

// Spread ≠ Rest! Одинаковый синтаксис, разный контекст:
const f = (...args) => args;  // собрал (в определении)
f(...arr);                    // развернул (в вызове)
```

## Функция возвращает функцию (каррирование-lite)
```js
const multiply = a => b => a * b;   // const multiply = (a) => (b) => ...
const double = multiply(2);
double(5);   // 10
```
В React это паттерн «фабрика колбэков»: `onClick={() => book(tour.id)}` — стрелка оборачивает вызов, чтобы передать аргумент.

## Arrow functions — основной стиль (React живёт на них)
```js
const calcTotal = (price, guests = 1) => price * guests;
// Несколько строк — нужны фигурные скобки И return
const calcTotal = (price, guests = 1) => {
  const total = price * guests;
  return total;
};
```

## Чистые функции (best practice)
Одинаковый вход → одинаковый выход. Не читает и не меняет внешнее.

```js
// ✅ Чистая
const calcTotal = (price, guests) => price * guests;

// ❌ НЕ чистая: читает внешнюю переменную
const VAT = 0.15;
const withVat = price => price + price * VAT;
```

## Паттерны
- **SRP:** одна функция — одна задача. Функция на 100 строк = разбить.
- Функция = глагол: `getTours`, `calcTotal`, `validateForm`, не `doStuff`.
- IIFE (вызываем сразу): `(() => { ... })();` — встретишь в старом коде, писать не нужно (есть модули).

> Обновлено: 01.10.2026
