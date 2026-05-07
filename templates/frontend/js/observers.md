---
title: "JS — Observers"
---

# JS — Observers

## 💻 IntersectionObserver

Отслеживает видимость элемента в viewport — без `scroll` событий и `getBoundingClientRect()`:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // элемент вошёл в viewport
      entry.target.classList.add('visible');
    }
  });
});

observer.observe(document.querySelector('.section'));
observer.unobserve(el);  // остановить наблюдение
observer.disconnect();   // остановить всё
```

**Опции:**

```js
const observer = new IntersectionObserver(callback, {
  root: null,          // null = viewport, или конкретный элемент
  rootMargin: '0px',   // отступ от края (как CSS margin: '100px 0px')
  threshold: 0.5,      // 0 = 1px видно, 1 = полностью, 0.5 = 50%
});

// Несколько порогов
const observer = new IntersectionObserver(callback, {
  threshold: [0, 0.25, 0.5, 0.75, 1],
});
```

**Lazy load изображений:**

```js
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    imageObserver.unobserve(img);  // больше не наблюдать
  });
}, { rootMargin: '200px' }); // начать загрузку за 200px до появления

lazyImages.forEach(img => imageObserver.observe(img));
```

**Анимация при скролле:**

```js
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    target.classList.toggle('animate-in', isIntersecting);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll')
  .forEach(el => animObserver.observe(el));
```

**Бесконечный скролл:**

```js
const sentinel = document.querySelector('#load-more-sentinel');

const loadMoreObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadNextPage();
});

loadMoreObserver.observe(sentinel);
```

---

## 💻 ResizeObserver

Реагировать на изменение размера элемента — не только окна:

```js
const observer = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`Размер: ${width}×${height}`);
  });
});

observer.observe(document.querySelector('.chart'));
observer.unobserve(el);
observer.disconnect();
```

**Адаптивный компонент:**

```js
const card = document.querySelector('.card');

const resizeObserver = new ResizeObserver(([entry]) => {
  const width = entry.contentRect.width;

  card.classList.toggle('card--compact', width < 300);
  card.classList.toggle('card--wide',    width > 600);
});

resizeObserver.observe(card);
```

**Авто-resize textarea (если нет field-sizing):**

```js
const textarea = document.querySelector('textarea');

const ro = new ResizeObserver(() => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
});

ro.observe(textarea);
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
});
```

**Синхронизация высот:**

```js
const source = document.querySelector('.sidebar');
const target = document.querySelector('.main');

new ResizeObserver(([entry]) => {
  target.style.minHeight = entry.contentRect.height + 'px';
}).observe(source);
```

---

## ⚠️ Подводные камни

- `IntersectionObserver` — callback вызывается асинхронно, не синхронно при observe
- `threshold: 1` — элемент должен быть **полностью** виден, 1 пиксель за краем = не срабатывает
- `rootMargin` работает только с `root: null` (viewport) или scroll-container
- `ResizeObserver` может вызвать бесконечный цикл если в callback меняешь размер наблюдаемого элемента — используй `requestAnimationFrame` как защиту
- Всегда вызывай `disconnect()` при уничтожении компонента (Vue `onUnmounted`, React `useEffect` cleanup)
