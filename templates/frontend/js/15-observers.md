# Observers — наблюдатели браузера

> Заменяют scroll-события и resize-хаки. Основа современных анимаций и lazy loading.

## 💻 IntersectionObserver

Отслеживает видимость элемента в viewport — без `scroll`-событий:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

observer.observe(document.querySelector('.section'));
observer.unobserve(el);  // остановить наблюдение за элементом
observer.disconnect();   // остановить всё
```

**Опции:**

```js
const observer = new IntersectionObserver(callback, {
  root: null,          // null = viewport, или конкретный scroll-контейнер
  rootMargin: '0px',   // отступ от края ('100px 0px' — как CSS margin)
  threshold: 0.5,      // 0 = хоть 1px, 1 = полностью, 0.5 = 50% элемента
});

// Несколько порогов
const observer = new IntersectionObserver(callback, {
  threshold: [0, 0.25, 0.5, 0.75, 1],
});
```

**Lazy load изображений:**

```js
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    imageObserver.unobserve(img);  // больше не наблюдать
  });
}, { rootMargin: '200px' }); // начать загрузку за 200px до появления

document.querySelectorAll('img[data-src]')
  .forEach(img => imageObserver.observe(img));
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

Реагирует на изменение размера ЭЛЕМЕНТА (не только окна):

```js
const observer = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`Размер: ${width}×${height}`);
  });
});

observer.observe(document.querySelector('.chart'));
observer.disconnect();
```

**Адаптивный компонент по своей ширине (container queries логика):**

```js
const card = document.querySelector('.card');

const resizeObserver = new ResizeObserver(([entry]) => {
  const width = entry.contentRect.width;
  card.classList.toggle('card--compact', width < 300);
  card.classList.toggle('card--wide',    width > 600);
});

resizeObserver.observe(card);
```

**Синхронизация высот двух блоков:**

```js
const source = document.querySelector('.sidebar');
const target = document.querySelector('.main');

new ResizeObserver(([entry]) => {
  target.style.minHeight = entry.contentRect.height + 'px';
}).observe(source);
```

---

## ⚠️ Подводные камни

- Callback вызывается **асинхронно** — не жди мгновенной реакции после `observe()`
- `threshold: 1` — элемент должен быть виден **полностью**, 1px за краем = не срабатывает
- `ResizeObserver` + изменение размера наблюдаемого элемента в callback = бесконечный цикл.
  Защита: обновлять через `requestAnimationFrame`
- **Всегда `disconnect()`** при уничтожении компонента:
  - React: в cleanup `useEffect` → `return () => observer.disconnect()`
  - Vue: в `onUnmounted`

> Обновлено: 01.10.2026
