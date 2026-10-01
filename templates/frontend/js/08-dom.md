# DOM

## База
```js
const btn = document.querySelector("#book-btn");   // по CSS-селектору
const items = document.querySelectorAll(".tour");  // все, NodeList
const form = document.querySelector("form");

btn.addEventListener("click", (event) => {          // объект события!
  event.preventDefault();      // отменить стандартное поведение (перезагрузку формы!)
  console.log(event.target);   // на что именно кликнули
});
```

## Частые операции
```js
el.textContent = "Текст";        // только текст (безопасно)
el.innerHTML = "<b>Жирно</b>";   // ⚠️ опасно с пользовательским вводом (XSS)
el.classList.add("active");      // классы: add/remove/toggle
el.classList.toggle("open");     // переключить
el.dataset.tourId;               // data-tour-id="5" → "5"
el.style.display = "none";
input.value;                     // значение поля
form.reset();                    // очистить форму
```

## Навигация
```js
el.closest(".card");    // ближайший родитель по селектору (всплытие клика)
el.matches(".active");  // подходит ли элемент под селектор
el.remove();
```

## Делегирование событий (паттерн)
Один обработчик на родителе вместо сотни на детях:
```js
list.addEventListener("click", e => {
  const btn = e.target.closest("button.book");
  if (!btn) return;                     // клик мимо кнопки — игнор
  book(btn.dataset.tourId);             // данные из data-атрибута
});
```

> Обновлено: 01.10.2026
