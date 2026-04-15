---
title: "Компоненты"
---

# Компоненты Craft CMS

## 🧠 Суть

Переиспользуемые UI компоненты в шаблонах.

## 💻 Embed паттерн

```twig
{# _components/button.twig #}
{% embed '_components/base' %}
  {% block content %}
    <a href="{{ url }}" class="btn btn--{{ type }}">
      {{ label }}
    </a>
  {% endblock %}
{% endembed %}
```

## 💻 Macro паттерн

```twig
{# _components/icons.twig #}
{% macro chevronDown() %}
  <svg class="icon"><use href="#chevron-down"></use></svg>
{% endmacro %}

{% from '_components/icons' import chevronDown %}
{{ chevronDown() }}
```

## 💻 Include с fallback

```twig
{% include '_components/' ~ componentName ignore missing %}
```

## ⚠️ Подводные камни

- Macros не наследуют контекст
- Embeds тяжелее чем includes
- Не переусердствуй с абстракцией

## 🚀 Best Practice

1. Компоненты → `_components/`
2. Layouts → `_layout.twig`
3. Partials → `_partials/`
