# Modern Features: ES2022–ES2024 — «новинки», которые уже стандарт

Стандарт 2026 года включает всё ниже. Это НЕ эксперименты — пиши смело.

## Немутирующие методы массивов (ES2023) — решают главную боль
```js
// Старые мутировали исходник (антипаттерн в React):
tours.sort(...);         // испортил исходный массив!
tours.reverse();         // тоже
tours.splice(1, 1);      // тоже

// Новые возвращают НОВЫЙ массив, исходник цел:
const sorted = tours.toSorted((a, b) => a.price - b.price);
const reversed = tours.toReversed();
const without = tours.toSpliced(1, 1);        // удалить, не трогая оригинал
const updated = tours.with(0, newTour);       // заменить элемент по индексу
```

## Object.groupBy (ES2024) — группировка вместо reduce
```js
// Раньше: reduce на 5 строк (см. файл 05)
// Теперь одна строка:
const byCategory = Object.groupBy(tours, t => t.category);
// → { history: [...], nature: [...] }
```

## Array.fromAsync (ES2024)
```js
// Ожидать промисы внутри маппинга одной командой:
const results = await Array.fromAsync(urls, url => fetch(url).then(r => r.json()));
// (альтернатива: Promise.all(urls.map(...)))
```

## Уже используем (ES2021–2022), но знать формально:
```js
const str = "Привет, мир";
str.replaceAll(",", ";");          // замена ВСЕХ вхождений (без regex)
arr.at(-1);                        // последний элемент
Promise.any([p1, p2]);             // первый УСПЕШНЫЙ (ES2021)
structuredClone(obj);              // глубокая копия (ES2022)
```

## Порядок изучения новинок (по полезности для джуна):
1. `toSorted` — убьёт 50% багов с мутацией ← **начни здесь**
2. `Object.groupBy` — группировки в проекте экскурсий
3. `at(-1)`, `replaceAll` — мелкий бытовой сахар
4. Остальное — «знаю, что есть», пригодится позже

> Обновлено: 01.10.2026
