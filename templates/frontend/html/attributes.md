---
title: "Атрибуты"
---

# HTML — Атрибуты

## 💻 fetchpriority — приоритет загрузки

Подсказать браузеру что загружать первым:

```html
<!-- LCP-изображение — повысить приоритет -->
<img src="hero.jpg" fetchpriority="high" alt="Hero">

<!-- Изображения ниже fold — понизить -->
<img src="promo.jpg" fetchpriority="low" loading="lazy" alt="Promo">

<!-- Некритичный скрипт -->
<script src="analytics.js" fetchpriority="low" defer></script>

<!-- Критичный шрифт -->
<link rel="preload" href="font.woff2" as="font" fetchpriority="high">
```

> Важен для Core Web Vitals (LCP). Без `fetchpriority="high"` браузер может загружать hero-изображение в низком приоритете.

---

## 💻 inputmode — тип клавиатуры на мобиле

Показывает нужную клавиатуру без изменения типа поля:

```html
<!-- Цифровая клавиатура (с -, +, , .) -->
<input inputmode="numeric" pattern="[0-9]*" placeholder="Код">

<!-- Только цифры, без знаков -->
<input inputmode="numeric">

<!-- Телефон (с +, *, #) -->
<input inputmode="tel" type="tel">

<!-- Email (с @ и .) -->
<input inputmode="email" type="email">

<!-- URL (с / и .) -->
<input inputmode="url">

<!-- Поиск (Enter = поиск) -->
<input inputmode="search">

<!-- Дробные числа (с запятой) -->
<input inputmode="decimal" placeholder="3.14">
```

---

## 💻 enterkeyhint — лейбл кнопки Enter

Меняет текст/иконку кнопки Enter на мобильной клавиатуре:

```html
<input enterkeyhint="search"   placeholder="Поиск">     <!-- 🔍 Поиск    -->
<input enterkeyhint="go"       placeholder="URL">        <!-- → Перейти   -->
<input enterkeyhint="done"     placeholder="Сумма">      <!-- ✓ Готово    -->
<input enterkeyhint="next"     placeholder="Имя">        <!-- → Далее     -->
<input enterkeyhint="previous" placeholder="...">        <!-- ← Назад     -->
<input enterkeyhint="send"     placeholder="Сообщение">  <!-- ↑ Отправить -->
```

---

## 💻 translate="no"

Запретить Google Translate (и другие переводчики) переводить элемент:

```html
<!-- Имена, бренды, код — не переводить -->
<span translate="no">John Doe</span>
<code translate="no">git commit -m "fix"</code>
<strong translate="no">Anthropic</strong>

<!-- Вся форма с кодом -->
<pre translate="no">
  const x = 1;
</pre>

<!-- Включить внутри запрещённого блока -->
<div translate="no">
  Code: <span translate="yes">Введите код</span>
</div>
```

---

## 💻 inert

Полностью деактивировать элемент: нет кликов, нет фокуса, нет a11y:

```html
<!-- Скрытая панель (модалка закрыта) -->
<aside inert class="sidebar">
  <nav>...</nav>
  <button>...</button>  <!-- недоступна с клавиатуры -->
</aside>

<!-- Открыть — убрать атрибут -->
<aside class="sidebar">...</aside>
```

```js
// Управление
sidebar.inert = true;   // деактивировать
sidebar.inert = false;  // активировать

// При открытии/закрытии модалки
function openModal(modal) {
  document.querySelector('main').inert = true;  // фон недоступен
  modal.inert = false;
  modal.showModal();
}
```

> Заменяет ручное управление `tabindex="-1"` на всех дочерних элементах.

---

## 💻 hidden="until-found"

Элемент скрыт визуально, но браузерный поиск (Ctrl+F) и `find-in-page` его находят:

```html
<!-- Аккордеон — контент скрыт, но доступен для поиска -->
<details>
  <summary>Вопрос 1</summary>
  <div hidden="until-found" id="answer-1">
    Ответ на вопрос...
  </div>
</details>

<!-- FAQ — статьи скрыты, но индексируются и ищутся -->
<section hidden="until-found" id="faq-delivery">
  <p>Доставка занимает 3-5 дней...</p>
</section>
```

```js
// Браузер сам раскрывает элемент при нахождении — событие:
element.addEventListener('beforematch', () => {
  // раскрыть родительский аккордеон
  element.removeAttribute('hidden');
});
```

---

## 💻 popover — нативный popover

Tooltip, dropdown, toast без JavaScript-позиционирования:

```html
<!-- Кнопка-триггер -->
<button popovertarget="my-popup">Открыть</button>

<!-- Popover -->
<div id="my-popup" popover>
  Содержимое popover
  <button popovertarget="my-popup" popovertargetaction="hide">✕</button>
</div>
```

```html
<!-- auto (по умолчанию) — закрывается при клике вне -->
<div id="tooltip" popover="auto">...</div>

<!-- manual — закрывается только программно -->
<div id="menu"    popover="manual">...</div>
```

```js
// Управление из JS
const pop = document.querySelector('#my-popup');
pop.showPopover();
pop.hidePopover();
pop.togglePopover();
```

```css
/* Стилизация */
[popover] {
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  padding: 1rem;
}

/* Анимация появления через @starting-style */
[popover]:popover-open {
  transition: opacity 0.2s;
  opacity: 1;

  @starting-style { opacity: 0; }
}
```

---

## ⚠️ Подводные камни

- `fetchpriority` — не добавляй `high` на всё, только на LCP-элемент
- `inputmode="numeric"` — не устанавливает тип поля, валидацию делай через `pattern`
- `inert` — не скрывает элемент визуально, только деактивирует. Добавляй `display:none` или `visibility:hidden` отдельно
- `hidden="until-found"` — поддержка: Chrome 105+, Safari 17+. Firefox — нет
- `popover` — позиционирует в top layer (над всем), но без привязки к триггеру. Для tooltip нужен Anchor Positioning API
