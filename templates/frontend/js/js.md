---
title: "JavaScript"
---

# JavaScript Snippets

## 🧠 Суть

Готовые JS-паттерны для переиспользования в проектах.

## 💻 Debounce

```js
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 500);

input.addEventListener("input", (e) => handleSearch(e.target.value));
```

## 💻 Throttle

```js
function throttle(fn, limit = 200) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage
window.addEventListener(
  "scroll",
  throttle(() => {
    console.log("scroll position:", window.scrollY);
  }),
);
```

## 💻 Modal

```js
class Modal {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.closeBtn = this.el.querySelector("[data-close]");
    this.closeBtn?.addEventListener("click", () => this.hide());
    this.el.addEventListener("click", (e) => {
      if (e.target === this.el) this.hide();
    });
  }

  show() {
    this.el.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  hide() {
    this.el.classList.remove("is-active");
    document.body.style.overflow = "";
  }
}

// Usage
const modal = new Modal("#myModal");
document.querySelector("[data-open-modal]").addEventListener("click", () => modal.show());
```

## 💻 Fetch API Wrapper

```js
async function api(url, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Usage
const data = await api("/api/users");
const newUser = await api("/api/users", {
  method: "POST",
  body: JSON.stringify({ name: "John" }),
});
```

## ⚠️ Подводные камни

- Debounce: последний вызов может потеряться → используй `leading: true` если нужно
- Modal: не забывай про `Escape` key и фокус-менеджмент
- Fetch: не отправляет cookies по умолчанию → добавь `credentials: 'include'`

## 🚀 Best Practice

- Всегда обрабатывай ошибки
- Используй AbortController для отмены запросов
- Кешируй ответы когда возможно
