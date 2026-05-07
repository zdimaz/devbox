---
title: "JS — Browser API"
---

# JS — Browser API

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
    // Fallback для старых браузеров
    document.execCommand('copy');
  }
});
```

> Требует HTTPS или localhost. Первый вызов запрашивает разрешение у пользователя.

---

## 💻 navigator.share() — Web Share API

Нативный шаринг на мобиле — вызывает системное меню "Поделиться":

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

> Работает только на мобиле (iOS Safari, Android Chrome). На десктопе Chrome тоже поддерживает.  
> Требует HTTPS.

---

## 💻 navigator.sendBeacon() — данные при закрытии

Отправить данные аналитики при уходе со страницы — гарантированно, даже при закрытии вкладки:

```js
// Обычный fetch может не успеть при unload
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden') return;

  // sendBeacon гарантирует доставку
  navigator.sendBeacon('/api/analytics', JSON.stringify({
    timeOnPage: Date.now() - pageLoadTime,
    scrollDepth: getScrollDepth(),
  }));
});

// Или через beforeunload
window.addEventListener('beforeunload', () => {
  navigator.sendBeacon('/api/exit', 'user left');
});
```

**С кастомными заголовками — через Blob:**

```js
const data = JSON.stringify({ event: 'page_exit' });
const blob = new Blob([data], { type: 'application/json' });
navigator.sendBeacon('/api/analytics', blob);
```

> `sendBeacon` — POST-запрос. Ответ не читается. Используй только для fire-and-forget аналитики.

---

## 💻 requestIdleCallback()

Запустить задачу когда браузер простаивает — не блокировать основной поток:

```js
// Некритичная работа в idle time
requestIdleCallback((deadline) => {
  // deadline.timeRemaining() — сколько мс осталось до следующего кадра
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    processTask(tasks.shift());
  }
});

// С таймаутом — запустить не позже чем через 2 секунды
requestIdleCallback(() => {
  prefetchNextPage();
}, { timeout: 2000 });

// Отменить
const id = requestIdleCallback(fn);
cancelIdleCallback(id);
```

**Типичные кейсы:**
- Аналитика и трекинг
- Prefetch следующей страницы
- Инициализация незначимых компонентов
- Кэширование данных

---

## 💻 CSS.supports() — feature detection из JS

```js
// Проверить поддержку CSS свойства
if (CSS.supports('content-visibility', 'auto')) {
  // включить оптимизацию
}

if (CSS.supports('(display: grid) and (subgrid: column)')) {
  useSubgridLayout();
}

// Через строку как в @supports
CSS.supports('selector(:has(img))');
CSS.supports('color', 'oklch(0.6 0.2 250)');

// Практический пример
const features = {
  containerQueries: CSS.supports('container-type', 'inline-size'),
  hasSelector:      CSS.supports('selector(:has(*))'),
  dvhUnit:          CSS.supports('height', '1dvh'),
};
```

---

## 💻 scrollend event

Событие когда скролл **завершился** — без throttle и setTimeout:

```js
// Раньше — костыль с throttle
let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    onScrollEnd();
  }, 150);
});

// Теперь — нативно
window.addEventListener('scrollend', () => {
  onScrollEnd();
});

// Для конкретного элемента
carousel.addEventListener('scrollend', () => {
  updateActiveDot(carousel.scrollLeft);
});
```

---

## 💻 View Transitions API

Анимированные переходы между состояниями/страницами нативно:

```js
// Анимация при смене контента
async function updateContent(newData) {
  if (!document.startViewTransition) {
    // fallback без анимации
    renderContent(newData);
    return;
  }

  await document.startViewTransition(() => {
    renderContent(newData);
  });
}
```

```css
/* Кастомная анимация перехода */
::view-transition-old(root) {
  animation: slide-out 0.3s ease;
}

::view-transition-new(root) {
  animation: slide-in 0.3s ease;
}

@keyframes slide-out {
  to { transform: translateX(-100%); opacity: 0; }
}

@keyframes slide-in {
  from { transform: translateX(100%); opacity: 0; }
}
```

```css
/* Именованный переход — для конкретного элемента */
.hero-image {
  view-transition-name: hero;
}

::view-transition-old(hero),
::view-transition-new(hero) {
  animation: none; /* отключить для этого элемента */
}
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

---

## ⚠️ Подводные камни

- `clipboard.readText()` — требует явного разрешения пользователя (`permissions.query({ name: 'clipboard-read' })`)
- `navigator.share()` — только по жесту пользователя (не из setTimeout)
- `sendBeacon()` — только POST, максимум 64KB данных
- `requestIdleCallback()` — нет в Safari. Fallback: `setTimeout(fn, 0)`
- `scrollend` — Chrome 114+, Firefox 109+. Safari — нет. Добавляй throttle как fallback
- View Transitions — Chrome 111+, Safari 18+. Всегда добавляй проверку `document.startViewTransition`
