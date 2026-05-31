---
title: UnoCSS Примеры
---

# UnoCSS Примеры

UnoCSS установлен и готов к использованию! 🎉

## Базовые утилиты

```html
<div class="p-4 bg-blue-500 text-white rounded-lg shadow-lg">
  <h1 class="text-2xl font-bold mb-2">Заголовок</h1>
  <p class="text-sm opacity-90">Текст с красивыми стилями</p>
</div>
```

<div class="p-4 bg-blue-500 text-white rounded-lg shadow-lg">
  <h1 class="text-2xl font-bold mb-2">Заголовок</h1>
  <p class="text-sm opacity-90">Текст с красивыми стилями</p>
</div>

## Кнопки с шорткатами

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
```

<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>

## Атрибутный режим

```html
<div 
  p-4 
  bg-gradient-to-r from-blue-500 to-purple-600 
  text-white 
  rounded-xl 
  shadow-md
>
  Атрибутные стили без классов!
</div>
```

<div 
  p-4 
  bg-gradient-to-r from-blue-500 to-purple-600 
  text-white 
  rounded-xl 
  shadow-md
>
  Атрибутные стили без классов!
</div>

## Иконки (если preset-icons включен)

```html
<div class="flex items-center gap-2">
  <div i="carbon:sun" class="text-2xl"></div>
  <span class="text-lg">Иконки работают!</span>
  <div i="carbon:moon" class="text-2xl"></div>
</div>
```

<div class="flex items-center gap-2">
  <div i="carbon:sun" class="text-2xl"></div>
  <span class="text-lg">Иконки работают!</span>
  <div i="carbon:moon" class="text-2xl"></div>
</div>

## Адаптивные стили

```html
<div class="p-4 bg-gray-100 rounded-lg">
  <div class="text-center sm:text-left">
    <h2 class="text-lg font-semibold mb-2">Адаптивный блок</h2>
    <p class="text-sm sm:text-base">Этот текст центрируется на мобильных и слева на десктопе</p>
  </div>
</div>
```

<div class="p-4 bg-gray-100 rounded-lg">
  <div class="text-center sm:text-left">
    <h2 class="text-lg font-semibold mb-2">Адаптивный блок</h2>
    <p class="text-sm sm:text-base">Этот текст центрируется на мобильных и слева на десктопе</p>
  </div>
</div>

## Создание кастомных правил

В `uno.config.js` можно добавить свои правила:

```js
rules: {
  'bg-glass': 'bg-opacity-10 backdrop-blur-sm',
}
```

Использование:
```html
<div class="bg-glass">Стеклянный фон</div>
```

<div class="bg-glass p-4 rounded border">Стеклянный фон</div>

## Полезные ссылки

- [Документация UnoCSS](https://unocss.dev/)
- [Справочник утилит](https://unocss.dev/presets/uno)
- [Иконки доступные в preset-icons](https://iconify.design/icon-sets.html)