# Async: Promises, async/await

## Шаблон запроса (выучи наизусть — он везде)
```js
async function loadTours() {
  try {
    const res = await fetch("https://api.example.com/tours");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Не загрузилось:", err.message);
  }
}
```

## Ключевое
- `await` — ждёт данные, НЕ блокирует интерфейс
- `try/catch` — ВСЕГДА оборачивай fetch
- Промисы (.then-цепочки) — просто понять идею, пишешь через async/await

## Таймеры
```js
const id = setTimeout(() => console.log("Через 2 сек"), 2000);
clearTimeout(id);              // отменить

const interval = setInterval(tick, 1000);   // каждую секунду
clearInterval(interval);                    // ОБЯЗАТЕЛЬНО отменяй, иначе утечка!
```

## Параллельность vs последовательность
```js
// Последовательно: медленно, каждый ждёт предыдущего
const tours = await loadTours();
const guides = await loadGuides();

// Параллельно: быстро, ждём всех сразу (порядок сохраняется!)
const [tours, guides] = await Promise.all([loadTours(), loadGuides()]);

Promise.allSettled([p1, p2]);  // не падает, если один упал
Promise.race([p1, p2]);        // кто первый, тот и результат (таймауты!)
```

## Цикл с await — не forEach!
```js
// ❌ forEach НЕ ждёт: все запросы запустятся хаотично
tours.forEach(t => await book(t));     // SyntaxError + логика неверна

// ✅ for...of ждёт каждый шаг
for (const tour of tours) {
  await book(tour.id);
}
// Если порядок неважен и нужна скорость → Promise.all(tours.map(t => book(t.id)))
```

## Event Loop — мини-понимание (не глубже)
JS однопоточный, но асинхронный: сначала весь синхронный код, потом микрозадачи (await), потом макрозадачи (setTimeout). Почувствуешь на практике — глубину учить не нужно.

> Обновлено: 01.10.2026
