# Objects (ассоциативные структуры)

## Ассоциативный массив в JS = обычный объект
«Ассоциативный массив» — это структура «ключ → значение». В JS ею является объект (и Map, см. файл 09).
```js
const prices = { "Нарын-кала": 1500, "Сулак": 2500 };
prices["Нарын-кала"];   // 1500 — доступ по ключу
```

## Object.* — статические методы (пишутся ВСЕ через большую букву после точки)
```js
const tour = { name: "Сулак", price: 2500 };

Object.keys(tour);     // ["name", "price"]      — массив ключей
Object.values(tour);   // ["Сулак", 2500]        — массив значений
Object.entries(tour);  // [["name","Сулак"], ["price",2500]] — пары

// entries → map → fromEntries: ТОП-приём трансформации объектов
const updated = Object.fromEntries(
  Object.entries(tour).map(([key, value]) =>
    key === "price" ? [key, value * 0.9] : [key, value]
  )
);

Object.assign({}, tour, { price: 999 });  // слияние (но spread короче)
Object.freeze(tour);   // заморозить (поверхностно!). Забыть — не вспомнить.
Object.hasOwn(tour, "name");  // есть ли СОБСТВЕННЫЙ ключ (без родителей)
```

## JSON — обмен данными с сервером (выучить пару команд)
```js
const json = JSON.stringify(tour);      // объект → строка '{"name":"Сулак",...}'
const obj = JSON.parse(json);           // строка → объект
// ⚠️ JSON.parse("") кидает ошибку — всегда в try/catch или проверяй
// Функции, undefined, Symbol в JSON НЕ превращаются — теряются молча!
localStorage.setItem("tour", JSON.stringify(tour));  // классика сохранения
```

## structuredClone (ES2022) — глубокое копирование
```js
// Spread копирует ТОЛЬКО первый уровень!
const copy = { ...tour };
copy.guide.name = "New";        // ⚠️ изменил и оригинал — guide скопирован по ссылке!

const deep = structuredClone(tour);  // ✅ настоящая глубокая копия
// До 2022 писали JSON.parse(JSON.stringify(obj)) — костыль, забудь
```

## Опциональная цепочка ?. и ?? — защита от undefined
```js
const tour = { guide: null };

tour.guide.name;          // ❌ TypeError: Cannot read properties of null
tour.guide?.name;         // ✅ undefined — просто «нет значения», без красной ошибки
tour.guide?.name ?? "Гид не указан";  // ?. + ?? — классика 2026 года

// Глубокая вложенность, где каждый уровень может отсутствовать:
user?.profile?.contacts?.email ?? "нет почты";

// Массивы:
tours?.[0]?.name;
// Функции (колбэки):
onClick?.();              // вызови, только если onClick существует
```

## Деструктуризация + значения по умолчанию
```js
const tour = { name: "Сулак", price: 2500 };

const { name, price } = tour;
const { name: tourName } = tour;                    // переименование
const { guide: { name: guideName } = {} } = tour;   // вложенность + default {}
const { rating = 5 } = tour;                        // default, если ключа нет

// В параметрах функции — самый частый паттерн в React:
function TourCard({ name, price = 0 }) { ... }
```

## Spread
```js
const updated = { ...tour, price: 2200 };   // новый объект, старый цел
const tours2 = [...tours, newTour];         // добавить элемент
// Порядок важен! Позже = перезапишет:
{ ...defaults, ...userSettings }            // userSettings победят
```

## Работа с ключами
```js
"guide" in tour;        // есть ли ключ (включая прототип)
tour.hasOwnProperty("guide");  // только собственный ключ
delete tour.price;      // удалить ключ
const key = "price";
tour[key];              // доступ через переменную — основа динамики
```

## Паттерн «Словарь вместо switch» (DRY)
```js
const STATUS_LABELS = { active: "Активен", cancelled: "Отменён", done: "Завершён" };
const label = STATUS_LABELS[status] ?? "Неизвестно";
// Добавить статус = добавить строку в объект, а не новый case
```

> Обновлено: 01.10.2026
