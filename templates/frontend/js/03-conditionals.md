# Conditionals

```js
if (freeSeats > 0 && hasGuide) { ... }  // && И, || ИЛИ, ! НЕ
else if (...) { ... }
else { ... }
```

## Guard Clause — сторож, ранний выход
Убивает вложенность. Функция читается сверху вниз без «лесенок».

```js
// ✅ Вышли сразу — каждая проверка одной строкой
function book(seats) {
  if (seats <= 0) return "Мест нет";
  if (!hasGuide) return "Нужен гид";
  return "Бронируем!";
}
```

**Паттерн:** сначала все «плохие» случаи → return. Внизу — счастливый путь.

## Ternary — короткое if/else в одну строку
```js
const label = freeSeats > 0 ? "Можно бронировать" : "Мест нет";
//            условие          ? значение если true  : значение если false
```
**Правило:** тройной тернарник `a ? b : c ? d : e` — антипаттерн, читается больно. Больше одного уровня → if/else.

## Short-circuit: && и || как «мини-if»
```js
// && — если левое falsy, правое НЕ выполнится (и наоборот)
isLoggedIn && showProfile();          // «сделай, ТОЛЬКО если»
freeSeats > 0 && console.log("OK");

// || — если левое truthy, берётся оно; иначе правое
const name = input || "Аноним";

// React-стиль, который ты увидишь ВЕЗДЕ:
{isLoading && <Spinner />}            // показать спиннер, только если грузится
{tour && <TourCard tour={tour} />}    // рендерить, только если данные есть
```

## switch — когда if-else плодится
```js
switch (category) {
  case "nature":
    console.log("Природа");
    break;                    // ⚠️ без break «провалится» в следующий case!
  case "history":
    console.log("История");
    break;
  default:
    console.log("Другое");
}
```
**Паттерн-альтернатива (часто чище):** объект-словарь
```js
const LABELS = { nature: "Природа", history: "История" };
const label = LABELS[category] ?? "Другое";   // DRY, легко расширять
```

## Logical Assignment (ES2021) — присваивание с проверкой
```js
count ||= 0;     // если count falsy → 0 (аналог: count = count || 0)
price ??= 1000;  // если price null/undefined → 1000
user &&= "admin";// если user truthy → перезаписать
```

> Обновлено: 01.10.2026
