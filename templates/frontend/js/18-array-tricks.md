# 18. Array Tricks — фишки методов

## filter(Boolean) — убрать «мусор»
```js
const mixed = ["Сулак", "", null, "Нарын-кала", undefined, 0];

mixed.filter(Boolean);
// ["Сулак", "Нарын-кала"] — Boolean убирает falsy: "", null, undefined, 0, NaN, false

// Реальная задача: выкинуть пустые поля формы
const filled = [nameInput, emailInput, phoneInput].filter(Boolean);
```

## find с деструктуризацией в колбэке
```js
const tour = tours.find(({ name }) => name === "Сулак");
//               ↑ сразу достаём поле, без t.name
```

## includes — есть ли значение (проще some)
```js
["admin", "editor"].includes(role);   // true/false — быстрая проверка прав
```

## flat / flatMap — расплющить вложенность
```js
const nested = [[1, 2], [3, [4, 5]]];
nested.flat();      // [1, 2, 3, [4, 5]] — на 1 уровень
nested.flat(2);     // [1, 2, 3, 4, 5]  — на 2 уровня

// map + flatten в одном: теги всех туров одним массивом
const tags = tours.flatMap(t => t.tags);  // ["history", "fortress", "nature", ...]
```

## Object.keys / values / entries — объект ↔ массив
```js
const tour = { name: "Сулак", price: 2500 };

Object.keys(tour);    // ["name", "price"]
Object.values(tour);  // ["Сулак", 2500]
Object.entries(tour); // [["name","Сулак"], ["price",2500]] — удобно для циклов

// Перевернуть объект (цена → имя)
Object.fromEntries(Object.entries(tour).map(([k, v]) => [v, k]));
```

## at(-1) — последний элемент без танцев
```js
tours[tours.length - 1];  // старый способ
tours.at(-1);             // современный: -1 = последний, -2 = предпоследний
```

## toSorted / toReversed (ES2023) — НЕ ломают исходный массив!
```js
// ❌ sort мутирует исходник — источник багов
const sorted = [...tours].sort((a, b) => a.price - b.price);  // копия вручную

// ✅ ES2023: метод сам возвращает новый массив
const sorted = tours.toSorted((a, b) => a.price - b.price);
```

## groupBy (ES2024) — сгруппировать за один вызов
```js
Object.groupBy(tours, t => t.category);
// { history: [...], nature: [...] } — вместо ручного reduce
```
Поддержка: все современные браузеры 2024+. Полифил не нужен.

> Обновлено: 01.10.2026
