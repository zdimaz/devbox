# Примеры использования стилей ссылок

## Базовые ссылки

### Обычная ссылка
```markdown
[Обычная ссылка](https://example.com)
```

### Внешняя ссылка с иконкой
```html
<a href="https://github.com/zdimaz/devbox" class="external-link">
  GitHub репозиторий
</a>
```

## Навигационные ссылки

### Меню навигации
```html
<nav>
  <a href="/" class="nav-link">Главная</a>
  <a href="/docs" class="nav-link active">Документация</a>
  <a href="/about" class="nav-link">О проекте</a>
</nav>
```

## Ссылки в контенте

### Ссылка в тексте
```html
<p>
  Для了解更多 информации посетите 
  <a href="/docs" class="content-link">нашу документацию</a>.
</p>
```

### Ссылка в коде
```html
<p>
  Подробнее в документации: 
  <a href="/docs/css" class="code-link">CSS — Цвета</a>.
</p>
```

## Кнопки-ссылки

### Основная кнопка
```html
<a href="/download" class="btn-link">
  Скачать
</a>
```

### Второстепенная кнопка
```html
<a href="/learn-more" class="btn-link btn-link-secondary">
  Подробнее
</a>
```

## Футер ссылки

```html
<footer>
  <a href="/privacy" class="footer-link">Политика конфиденциальности</a>
  <a href="/terms" class="footer-link">Условия использования</a>
  <a href="/contact" class="footer-link">Контакты</a>
</footer>
```

## Карточки и таблицы

### Ссылка в карточке
```html
<div class="card">
  <a href="/feature" class="card-link">
    Узнать больше о функции
  </a>
</div>
```

### Ссылка в таблице
```html
<table>
  <tr>
    <td>Название</td>
    <td><a href="/docs" class="table-link">Документация</a></td>
  </tr>
</table>
```

## Списки

### Ссылка в списке
```html
<ul>
  <li><a href="/guide" class="list-link">Начало работы</a></li>
  <li><a href="/advanced" class="list-link">Продвинутые темы</a></li>
  <li><a href="/api" class="list-link">API документация</a></li>
</ul>
```

## Специальные стили

### Ссылка без подчеркивания
```html
<a href="#" class="no-underline">Ссылка без подчеркивания</a>
```

### Ссылка с высоким контрастом
```html
<a href="#" class="high-contrast-link">Ссылка с высоким контрастом</a>
```

## Адаптивные примеры

### Адаптивная навигация
```html
<nav class="flex flex-col sm:flex-row gap-4">
  <a href="/" class="nav-link">Главная</a>
  <a href="/docs" class="nav-link">Документация</a>
  <a href="/about" class="nav-link">О проекте</a>
</nav>
```

### Адаптивная кнопка
```html
<a href="/download" class="btn-link sm:px-6 sm:py-3">
  Скачать
</a>
```

## Встроенная поддержка VitePress

Стили совместимы с VitePress и автоматически применяются к стандартным ссылкам в документации:

```markdown
[Ссылка в документации VitePress](/docs)
```

## Цветовые схемы

Стили автоматически адаптируются под светую и темную темы:

- **Светлая тема**: `text-blue-600 hover:text-blue-800`
- **Темная тема**: `dark:text-blue-400 dark:hover:text-blue-300`

## Переходы и анимации

Все ссылки включают плавные переходы:

```css
transition: color 0.2s ease-in-out;
```

## Доступность

Стили включают состояния для доступности:

- `:hover` - наведение мыши
- `:focus` - фокус клавиатуры
- `:visited` - посещенные ссылки