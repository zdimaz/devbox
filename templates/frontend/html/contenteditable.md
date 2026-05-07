---
title: "contenteditable"
---

# HTML — contenteditable

## 🧠 Суть

`contenteditable` превращает любой HTML-элемент в редактируемую область — без `<input>` и `<textarea>`.

Три значения:

```html
contenteditable="true"         <!-- редактируемый, разрешён HTML -->
contenteditable="plaintext-only" <!-- редактируемый, только текст (без форматирования) -->
contenteditable="false"        <!-- явный запрет (для вложенных элементов) -->
```

---

## 💻 Базовое использование

```html
<!-- Простой редактируемый блок -->
<div contenteditable="true">
  Кликни и редактируй текст
</div>

<!-- Только текст, без вставки HTML -->
<div contenteditable="plaintext-only">
  Только plain text, вставка форматирования запрещена
</div>

<!-- Inline-редактирование заголовка -->
<h1 contenteditable="true">Заголовок страницы</h1>

<!-- Вложенный запрет — кнопка внутри не редактируется -->
<div contenteditable="true">
  Редактируемый текст
  <button contenteditable="false">Не трогай</button>
</div>
```

---

## 💻 JavaScript — чтение и запись

```js
const editor = document.querySelector('[contenteditable]');

// Читать текст (без HTML-тегов)
const text = editor.innerText;
const textContent = editor.textContent;

// Читать HTML (с тегами — осторожно с XSS)
const html = editor.innerHTML;

// Писать текст
editor.textContent = 'Новый текст';

// Писать HTML
editor.innerHTML = '<strong>Жирный</strong> текст';

// Слушать изменения
editor.addEventListener('input', (e) => {
  console.log(editor.innerText);
});

// Проверить пустоту (innerText возвращает '\n' для пустого div)
const isEmpty = editor.innerText.trim() === '';
```

---

## 💻 Получить/установить курсор

```js
// Поставить курсор в конец
function moveCursorToEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false); // false = конец
  sel.removeAllRanges();
  sel.addRange(range);
}

// Получить позицию курсора (смещение в символах)
function getCursorOffset(el) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return 0;
  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(el);
  range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
  return range.toString().length;
}
```

---

## 💻 Вставка текста — контроль содержимого

По умолчанию при вставке (Ctrl+V) браузер вставляет HTML со стилями. Чтобы принудить только текст:

```js
editor.addEventListener('paste', (e) => {
  e.preventDefault();

  // Получить чистый текст из буфера
  const text = e.clipboardData.getData('text/plain');

  // Вставить в позицию курсора
  document.execCommand('insertText', false, text);

  // Или современный способ (без execCommand):
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  sel.deleteFromDocument();
  sel.getRangeAt(0).insertNode(document.createTextNode(text));
  sel.collapseToEnd();
});
```

---

## 💻 Ограничение длины

```js
editor.addEventListener('input', () => {
  const max = 200;
  if (editor.innerText.length > max) {
    // Обрезать до максимума
    editor.innerText = editor.innerText.slice(0, max);
    moveCursorToEnd(editor); // вернуть курсор в конец
  }
});

// Блокировать ввод сверх лимита
editor.addEventListener('keydown', (e) => {
  const ignore = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
  if (editor.innerText.length >= 200 && !ignore.includes(e.key)) {
    e.preventDefault();
  }
});
```

---

## 💻 Placeholder (как у input)

```html
<div
  contenteditable="true"
  class="editor"
  data-placeholder="Введите текст..."
></div>
```

```css
.editor:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}
```

```js
// :empty не работает если внутри есть <br> — чистим
editor.addEventListener('input', () => {
  if (editor.innerHTML === '<br>') {
    editor.innerHTML = '';
  }
});
```

---

## 💻 CSS — базовые стили

```css
[contenteditable] {
  outline: none;             /* убрать синий border при фокусе */
  caret-color: #3b82f6;     /* цвет курсора */
  white-space: pre-wrap;    /* сохранять переносы строк */
  word-break: break-word;   /* длинные слова не вылезают за пределы */
  min-height: 1em;          /* чтобы не схлопывался пустой */
}

/* Подсветить при редактировании */
[contenteditable]:focus {
  box-shadow: 0 0 0 2px #3b82f6;
  border-radius: 4px;
}

/* Запретить resize у textarea-замены */
[contenteditable] {
  resize: none;
}
```

---

## 💻 Отключить spell check и autocorrect

```html
<div
  contenteditable="true"
  spellcheck="false"
  autocorrect="off"
  autocapitalize="off"
>
```

---

## 💻 Сохранение — debounce

```js
let saveTimer;

editor.addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    save(editor.innerText);
  }, 500); // сохранить через 500ms после последнего ввода
});

function save(content) {
  localStorage.setItem('draft', content);
  // или fetch('/api/save', { method: 'POST', body: content })
}

// Восстановить при загрузке
editor.innerText = localStorage.getItem('draft') ?? '';
```

---

## 💻 Vue — v-model аналог

```vue
<template>
  <div
    ref="editorRef"
    contenteditable="true"
    @input="onInput"
    @blur="onBlur"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({ modelValue: String });
const emit  = defineEmits(['update:modelValue']);

const editorRef = ref(null);

onMounted(() => {
  editorRef.value.innerText = props.modelValue ?? '';
});

// Синхронизировать если значение изменилось снаружи
watch(() => props.modelValue, (val) => {
  if (editorRef.value.innerText !== val) {
    editorRef.value.innerText = val;
  }
});

function onInput() {
  emit('update:modelValue', editorRef.value.innerText);
}
</script>
```

---

## ⚠️ Подводные камни

- `innerHTML` при чтении возвращает HTML с тегами — используй `innerText` для чистого текста
- `innerText` пустого `<div>` возвращает `'\n'`, не `''` — всегда `.trim()` при проверке
- `:empty` CSS-псевдокласс не работает если внутри есть `<br>` (браузер добавляет при Enter)
- Вставка из буфера вставляет HTML со стилями — всегда перехватывай `paste` если нужен plain text
- `execCommand` deprecated — используй для совместимости, но готовься к замене
- `contenteditable="true"` наследуется дочерними элементами — добавляй `false` там где не нужно
- `plaintext-only` не поддерживается в Firefox (используй paste-handler как запасной вариант)
