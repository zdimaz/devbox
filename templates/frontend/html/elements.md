---
title: "Элементы"
---

# HTML — Элементы

## 💻 dialog — нативная модалка

```html
<dialog id="modal">
  <h2>Заголовок</h2>
  <p>Содержимое</p>
  <button autofocus>Закрыть</button>
</dialog>

<button onclick="modal.showModal()">Открыть</button>
```

```js
const modal = document.querySelector('#modal');

// Открыть как модалку (с backdrop, блокирует фон)
modal.showModal();

// Открыть как обычный диалог (без блокировки)
modal.show();

// Закрыть
modal.close();
modal.close('result'); // с возвращаемым значением

// Закрытие по Escape — встроено автоматически
// Закрытие по кнопке
document.querySelector('button').addEventListener('click', () => modal.close());

// Получить результат
modal.addEventListener('close', () => {
  console.log(modal.returnValue); // значение из close('result')
});
```

```css
/* Стилизация */
dialog {
  border: none;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  max-width: min(560px, 90vw);
}

/* Фон */
dialog::backdrop {
  background: oklch(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
}

/* Анимация появления */
dialog[open] {
  animation: dialog-in 0.2s ease;
}

@keyframes dialog-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

**Встроенная функциональность:**
- Закрытие по `Escape`
- Фокус-ловушка (Tab не уходит за пределы)
- `::backdrop` — фон
- ARIA роль `dialog` автоматически
- `autofocus` — первый фокус на нужном элементе

---

## 💻 meter — gauge-индикатор

Индикатор значения в известном диапазоне (заряд, оценка, использование):

```html
<!-- min, max, value — обязательные -->
<meter min="0" max="100" value="75">75%</meter>

<!-- low, high, optimum — задают "хорошую" зону -->
<meter
  min="0" max="100"
  low="30" high="70" optimum="100"
  value="85"
>85%</meter>

<!-- Примеры -->
<p>Заряд: <meter min="0" max="1" value="0.8">80%</meter></p>
<p>Рейтинг: <meter min="0" max="5" value="4.2" title="4.2 из 5"></meter></p>
<p>Хранилище: <meter min="0" max="50" value="47" high="40">47 GB</meter></p>
```

Браузер автоматически меняет цвет:
- Зелёный — значение в зоне `optimum`
- Жёлтый — значение в субоптимальной зоне (`low`..`high`)
- Красный — значение в опасной зоне

```css
/* Стилизация через ::-webkit-meter-* (ограниченная) */
meter {
  width: 200px;
  height: 12px;
}

/* Сброс и кастомный стиль */
meter {
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

meter::-webkit-meter-bar { background: transparent; }
meter::-webkit-meter-optimum-value { background: #22c55e; }
meter::-webkit-meter-suboptimum-value { background: #f59e0b; }
meter::-webkit-meter-even-less-good-value { background: #ef4444; }
```

---

## 💻 output — результат вычислений

Семантический элемент для вывода результата формы:

```html
<form oninput="result.value = Number(a.value) + Number(b.value)">
  <input type="number" id="a" value="0"> +
  <input type="number" id="b" value="0"> =
  <output name="result" for="a b">0</output>
</form>
```

```html
<!-- Калькулятор -->
<form id="calc">
  <label>Цена: <input type="number" id="price" value="1000"></label>
  <label>Кол-во: <input type="number" id="qty" value="1"></label>
  <output id="total" for="price qty">1000 ₽</output>
</form>

<script>
  const form = document.querySelector('#calc');
  form.addEventListener('input', () => {
    const price = +form.querySelector('#price').value;
    const qty   = +form.querySelector('#qty').value;
    form.querySelector('#total').value = `${(price * qty).toLocaleString()} ₽`;
  });
</script>
```

**Зачем вместо `<span>`:**
- Семантически означает "вычисленный результат"
- Атрибут `for` связывает с источниками данных
- Screen reader объявляет при изменении (live region)

---

## ⚠️ Подводные камни

- `dialog.showModal()` — фокус-ловушка работает только при открытии через JS, не через `open` атрибут
- `dialog` закрывается по `Escape` — добавь `form method="dialog"` внутри чтобы кнопки тоже закрывали
- `<meter>` — не использовать для прогресса процессов, для этого `<progress>`
- `<meter>` стилизация — сильно ограничена, разная в Chrome и Firefox
- `<output>` — не сохраняется при сабмите формы (не является form control)
