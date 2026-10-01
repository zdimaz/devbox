# Snippets — готовые переиспользуемые паттерны

> Проверенные решения. Копируй, адаптируй под проект.

## 💻 Debounce

```js
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Использование: поиск — запрос уходит, когда пользователь перестал печатать
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 500);

input.addEventListener("input", (e) => handleSearch(e.target.value));
```

> Таймер сбрасывается при каждом вызове → fn сработает один раз, через `delay`
> после последнего вызова. Классика: поиск, автосохранение, валидация в реальном времени.

---

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

// Использование: scroll/resize — срабатывает не чаще раза в `limit` мс
window.addEventListener("scroll", throttle(() => {
  console.log("scroll position:", window.scrollY);
}, 200));
```

### Debounce vs Throttle — как запомнить
| | Debounce | Throttle |
|---|---|---|
| Смысл | «Подожди, пока закончит» | «Не чаще, чем раз в N мс» |
| Аналогия | Лифт: ждёт, пока все войдут | Фaucet: капает ровными порциями |
| Кейс | поиск в инпуте | scroll, resize, mousemove |

---

## 💻 Modal (класс)

```js
class Modal {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.closeBtn = this.el.querySelector("[data-close]");

    this.closeBtn?.addEventListener("click", () => this.hide());
    this.el.addEventListener("click", (e) => {
      if (e.target === this.el) this.hide();  // клик по оверлею
    });
    // Escape — не забыть!
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.el.classList.contains("is-active")) this.hide();
    });
  }

  show() {
    this.el.classList.add("is-active");
    document.body.style.overflow = "hidden";  // блокируем скролл под модалкой
  }

  hide() {
    this.el.classList.remove("is-active");
    document.body.style.overflow = "";
  }
}

// Использование
const modal = new Modal("#myModal");
document.querySelector("[data-open-modal]")
  .addEventListener("click", () => modal.show());
```

---

## 💻 Fetch Wrapper (функция, минимум)

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

// Использование
const data = await api("/api/users");
const newUser = await api("/api/users", {
  method: "POST",
  body: JSON.stringify({ name: "John" }),
});
```

> Для серьёзных проектов бери класс ApiClient из файла 11 (токены, baseUrl, методы).
> А не забудь: `credentials: 'include'` — если API на другом домене и нужны куки.

---

## ⚠️ Подводные камни (сводка)

- **Debounce:** если fn должна сработать и на старте, и в конце — нужна версия с `leading`/`trailing` опциями (lodash debounce умеет)
- **Modal:** Escape + фокус-менеджмент (фокус внутрь модалки, возврат на кнопку) — часто забывают
- **Fetch:** обрабатывай ошибки через try/catch на стороне вызова — wrapper их не глотает

> Обновлено: 01.10.2026 (исправлен мусорный текст в шапке, дополн debounce/throttle-пояснения, добавлен Escape в Modal)
