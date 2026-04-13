---
title: "Twig"
---

# Twig Best Practices

## 🧠 Суть

Правила написания Twig шаблонов в Craft CMS.

## 💻 Организация кода

```twig
{# Плохо #}
{{ entry.body|markdown|raw }}

{# Хорошо #}
{% set content = entry.body|markdown|raw %}
{{ content }}
```

## 💻 Embeds для компонентов

```twig
{# _components/card.twig #}
{% macro card(entry) %}
  <article class="card">
    <h3>{{ entry.title }}</h3>
    <p>{{ entry.summary }}</p>
  </article>
{% endmacro %}

{# Использование #}
{% from '_components/card' import card %}
{{ card(entry) }}
```

## 💻 Кэширование

```twig
{% cache globally for 1 day %}
  {% nav page in pages %}
    ...
  {% endnav %}
{% endcache %}
```

## ⚠️ Подводные камни

- `eagerLoading` для связанных элементов
- N+1 проблема с `entry.relations`
- `|length` на Matrix — дорого

## 🚀 Best Practice

1. Кэшируй всё что можно
2. Eager load relations
3. Используй `embeds` вместо `include`
4. Избегай логики в шаблонах
