---
title: "JS — Современные методы"
---

# JS — Современные методы

## 💻 structuredClone() — глубокое клонирование

```js
// Раньше — хаки
const clone = JSON.parse(JSON.stringify(obj));  // теряет Date, undefined, Map, Set

// Теперь — нативно
const clone = structuredClone(obj);

// Поддерживает: Date, Map, Set, RegExp, ArrayBuffer, Blob
const original = {
  date: new Date(),
  map:  new Map([['key', 'val']]),
  set:  new Set([1, 2, 3]),
  arr:  [1, [2, [3]]],
};

const copy = structuredClone(original);
copy.arr[1][0] = 99;
console.log(original.arr[1][0]); // 2 — оригинал не изменился
```

---

## 💻 crypto.randomUUID()

```js
// UUID v4 без библиотек
const id = crypto.randomUUID();
// 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

// Использование
const newItem = { id: crypto.randomUUID(), name: 'Item' };
```

---

## 💻 AbortController — отмена запросов

```js
// Базовое использование
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(r => r.json())
  .then(console.log)
  .catch(err => {
    if (err.name === 'AbortError') return; // отмена — не ошибка
    throw err;
  });

// Отменить запрос
controller.abort();
```

**Отмена предыдущего запроса при новом (поиск):**

```js
let controller;

searchInput.addEventListener('input', async (e) => {
  controller?.abort();               // отменить предыдущий
  controller = new AbortController();

  try {
    const res = await fetch(`/api/search?q=${e.target.value}`, {
      signal: controller.signal,
    });
    renderResults(await res.json());
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err);
  }
});
```

**С таймаутом:**

```js
const response = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000),  // отменить через 5 секунд
});

// Комбо: таймаут + ручная отмена
const controller = new AbortController();
const signal = AbortSignal.any([
  controller.signal,
  AbortSignal.timeout(5000),
]);

fetch('/api/data', { signal });
```

---

## 💻 Array.at() — отрицательные индексы

```js
const arr = [1, 2, 3, 4, 5];

// Раньше
arr[arr.length - 1];  // 5
arr[arr.length - 2];  // 4

// Теперь
arr.at(-1);  // 5
arr.at(-2);  // 4
arr.at(0);   // 1

// Работает для строк тоже
'hello'.at(-1);  // 'o'
```

---

## 💻 Object.groupBy() / Map.groupBy()

```js
const items = [
  { name: 'Apple',  category: 'fruit' },
  { name: 'Carrot', category: 'vegetable' },
  { name: 'Banana', category: 'fruit' },
  { name: 'Broccoli', category: 'vegetable' },
];

// Группировка по полю
const grouped = Object.groupBy(items, item => item.category);
// {
//   fruit:     [{ name: 'Apple' }, { name: 'Banana' }],
//   vegetable: [{ name: 'Carrot' }, { name: 'Broccoli' }],
// }

// По произвольному условию
const byLength = Object.groupBy(items, item =>
  item.name.length > 5 ? 'long' : 'short'
);

// Map.groupBy — когда ключ не строка
const byObj = Map.groupBy(items, item => item);
```

---

## 💻 Promise.allSettled() и Promise.any()

```js
// allSettled — дождаться ВСЕХ, включая упавшие
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/broken'), // упадёт
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log(result.value);
  } else {
    console.error(result.reason);
  }
});

// any — первый УСПЕШНЫЙ (противоположность allSettled)
const fastest = await Promise.any([
  fetch('https://cdn1.example.com/data.json'),
  fetch('https://cdn2.example.com/data.json'),
  fetch('https://cdn3.example.com/data.json'),
]);
// Кто ответит первым — того и данные
```

---

## 💻 URLSearchParams + URL

```js
// Парсинг query string
const params = new URLSearchParams('page=2&sort=date&order=desc');
params.get('page');          // '2'
params.has('sort');          // true
params.getAll('tag');        // [] или ['js', 'css']

// Модификация
params.set('page', '3');
params.append('tag', 'css');
params.delete('order');
params.toString();           // 'page=3&sort=date&tag=css'

// Из window.location
const current = new URLSearchParams(window.location.search);

// URL constructor
const url = new URL('https://example.com/path?a=1#hash');
url.hostname;   // 'example.com'
url.pathname;   // '/path'
url.searchParams.get('a');  // '1'
url.hash;       // '#hash'

// Построить URL
const apiUrl = new URL('/api/users', window.location.origin);
apiUrl.searchParams.set('page', '2');
apiUrl.searchParams.set('limit', '20');
fetch(apiUrl.toString());
```

---

## 💻 BroadcastChannel — коммуникация между вкладками

```js
// В каждой вкладке
const channel = new BroadcastChannel('app-sync');

// Отправить всем другим вкладкам
channel.postMessage({ type: 'USER_LOGOUT' });

// Получить
channel.addEventListener('message', (event) => {
  if (event.data.type === 'USER_LOGOUT') {
    window.location.href = '/login';
  }
});

// Закрыть канал
channel.close();
```

**Синхронизация корзины/авторизации:**

```js
const sync = new BroadcastChannel('cart');

// При добавлении товара
function addToCart(item) {
  cart.push(item);
  sync.postMessage({ type: 'CART_UPDATED', cart });
}

// Все вкладки обновят корзину
sync.onmessage = ({ data }) => {
  if (data.type === 'CART_UPDATED') renderCart(data.cart);
};
```

---

## ⚠️ Подводные камни

- `structuredClone()` не клонирует функции и DOM-узлы — бросит ошибку
- `AbortError` нужно явно игнорировать — это не настоящая ошибка, а отмена
- `Object.groupBy()` — Chrome 117+, Firefox 119+, Safari 17.4+. Проверяй поддержку
- `Promise.any()` бросает `AggregateError` если ВСЕ промисы упали — обрабатывай
- `BroadcastChannel` не работает между разными доменами и не персистентен — только для live-коммуникации между вкладками
