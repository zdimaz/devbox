# Browser API — нативные возможности браузера

## 💻 navigator.clipboard — буфер обмена

```js
// Записать в буфер
await navigator.clipboard.writeText('Скопированный текст');

// Прочитать из буфера
const text = await navigator.clipboard.readText();

// Кнопка "Копировать"
button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeBlock.innerText);
    button.textContent = 'Скопировано!';
    setTimeout(() => button.textContent = 'Копировать', 2000);
  } catch (err) {
    console.error('Clipboard failed:', err);
  }
});
```

> Требует HTTPS или localhost. `readText()` запрашивает разрешение у пользователя.
> Fallback через `document.execCommand('copy')` — устарел, в 2026 не нужен.

---

## 💻 navigator.share() — Web Share API

Нативный шаринг — вызывает системное меню «Поделиться»:

```js
const shareData = {
  title: 'Заголовок страницы',
  text:  'Описание для превью',
  url:   window.location.href,
};

// Проверить поддержку
if (navigator.canShare?.(shareData)) {
  shareBtn.style.display = 'block';
}

shareBtn.addEventListener('click', async () => {
  try {
    await navigator.share(shareData);
  } catch (err) {
    if (err.name !== 'AbortError') {  // пользователь закрыл меню — не ошибка
      console.error(err);
    }
  }
});
```

> Работает на мобильных и в десктопном Chrome. Требует HTTPS.
> ⚠️ Вызывать только по жесту пользователя (клик) — из setTimeout упадёт.

---

## 💻 navigator.sendBeacon() — данные при закрытии

Отправить аналитику при уходе со страницы — гарантированно, даже при закрытии вкладки:

```js
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden') return;

  // sendBeacon гарантирует доставку, где fetch может не успеть
  navigator.sendBeacon('/api/analytics', JSON.stringify({
    timeOnPage: Date.now() - pageLoadTime,
  }));
});
```

**С кастомным Content-Type — через Blob:**

```js
const blob = new Blob([JSON.stringify({ event: 'page_exit' })], {
  type: 'application/json'
});
navigator.sendBeacon('/api/analytics', blob);
```

> `sendBeacon` — POST-запрос. Ответ не читается. Только fire-and-forget аналитика.

---

## 💻 requestIdleCallback()

Запустить задачу, когда браузер простаивает — не блокировать основной поток:

```js
requestIdleCallback((deadline) => {
  // deadline.timeRemaining() — сколько мс осталось до следующего кадра
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    processTask(tasks.shift());
  }
});

// С таймаутом — запустить не позже чем через 2 секунды
requestIdleCallback(() => prefetchNextPage(), { timeout: 2000 });

// Отменить
const id = requestIdleCallback(fn);
cancelIdleCallback(id);
```

**Кейсы:** аналитика, prefetch следующей страницы, инициализация некритичных компонентов.

> ⚠️ Нет в Safari. Fallback: `setTimeout(fn, 1)`.

---

## 💻 CSS.supports() — feature detection из JS

```js
if (CSS.supports('content-visibility', 'auto')) {
  // включить оптимизацию
}

CSS.supports('selector(:has(img))');
CSS.supports('color', 'oklch(0.6 0.2 250)');

// Практический пример — собрать карту фич проекта
const features = {
  containerQueries: CSS.supports('container-type', 'inline-size'),
  hasSelector:      CSS.supports('selector(:has(*))'),
  dvhUnit:          CSS.supports('height', '1dvh'),
};
```

---

## 💻 scrollend event

Событие, когда скролл **завершился** — без throttle и setTimeout:

```js
// Раньше — костыль
let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(onScrollEnd, 150);
});

// Теперь — нативно
window.addEventListener('scrollend', onScrollEnd);

// Для конкретного элемента
carousel.addEventListener('scrollend', () => {
  updateActiveDot(carousel.scrollLeft);
});
```

> Chrome 114+, Firefox 109+. Safari — нет, держи throttle как fallback.

---

## 💻 View Transitions API

Анимированные переходы между состояниями нативно:

```js
async function updateContent(newData) {
  if (!document.startViewTransition) {
    renderContent(newData);   // fallback без анимации
    return;
  }
  await document.startViewTransition(() => renderContent(newData));
}
```

```css
::view-transition-old(root) {
  animation: slide-out 0.3s ease;
}
::view-transition-new(root) {
  animation: slide-in 0.3s ease;
}
@keyframes slide-out { to { transform: translateX(-100%); opacity: 0; } }
@keyframes slide-in  { from { transform: translateX(100%); opacity: 0; } }
```

**SPA — переход между роутами:**

```js
router.on('navigate', async (to) => {
  if (!document.startViewTransition) {
    await loadPage(to);
    return;
  }
  await document.startViewTransition(async () => {
    await loadPage(to);
  });
});
```

> Chrome 111+, Safari 18+. Всегда проверяй `document.startViewTransition`.

---

## ⚠️ Подводные камни (сводка)

| API | Ограничение |
|---|---|
| `clipboard.readText()` | явное разрешение пользователя |
| `navigator.share()` | только по жесту пользователя, не из таймеров |
| `sendBeacon()` | только POST, макс ~64KB, ответ не читается |
| `requestIdleCallback()` | нет в Safari → `setTimeout(fn, 1)` |
| `scrollend` | нет в Safari → throttle как fallback |
| View Transitions | проверяй `document.startViewTransition` |

> Обновлено: 01.10.2026
