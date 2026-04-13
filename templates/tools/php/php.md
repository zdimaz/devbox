---
title: "PHP"
---

# PHP Snippets

## 🧠 Суть

Готовые PHP-паттерны для Craft CMS и не только.

## 💻 API Endpoint

```php
<?php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Обработка
    $result = ['status' => 'ok', 'data' => $data];

    echo json_encode($result);
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
```

## 💻 Debounce (серверный)

```php
<?php
function cacheWithTtl(string $key, callable $fn, int $ttl = 3600) {
    $cacheFile = "/tmp/cache_{$key}.json";

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
        return json_decode(file_get_contents($cacheFile), true);
    }

    $result = $fn();
    file_put_contents($cacheFile, json_encode($result));
    return $result;
}
```

## 💻 Fetch в Craft CMS

```twig
{# Craft: получение элементов #}
{% set entries = craft.entries()
    .section('news')
    .orderBy('postDate DESC')
    .limit(10)
    .all()
%}

{% for entry in entries %}
    <h2>{{ entry.title }}</h2>
{% endfor %}
```

## ⚠️ Подводные камни

- Всегда валидируй ввод
- Не логируй чувствительные данные
- Используй prepared statements

## 🚀 Best Practice

1. Type hints везде
2. Обработка ошибок
3. Кешируй тяжёлые операции
