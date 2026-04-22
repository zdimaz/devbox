---
title: "WordPress — безопасность"
---

# WordPress — безопасность

## 🧠 Суть

Четыре главных вектора атак на WordPress: **SQL-инъекции**, **XSS**, **CSRF** и **брутфорс**. Каждый закрывается конкретными WP-функциями — не нужно изобретать своё.

Правило: **санитизируй на входе, экранируй на выходе**.

---

## 💻 SQL — подготовленные запросы

Никогда не вставляй переменные в SQL-строку напрямую. Используй `$wpdb->prepare()`.

```php
global $wpdb;

// ❌ Опасно — SQL-инъекция
$results = $wpdb->get_results(
    "SELECT * FROM {$wpdb->posts} WHERE post_author = " . $_GET['id']
);

// ✅ Безопасно — prepare() экранирует и типизирует
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE post_author = %d AND post_status = %s",
        (int) $_GET['id'],
        'publish'
    )
);
```

**Плейсхолдеры:**

| Плейсхолдер | Тип |
|---|---|
| `%d` | integer |
| `%f` | float |
| `%s` | string (в кавычках) |

```php
// INSERT
$wpdb->insert(
    $wpdb->prefix . 'my_table',
    ['name' => $name, 'score' => $score],
    ['%s', '%d']  // форматы — порядок совпадает с данными
);

// UPDATE
$wpdb->update(
    $wpdb->prefix . 'my_table',
    ['name' => $name],        // данные
    ['id' => $id],            // условие WHERE
    ['%s'],                   // форматы данных
    ['%d']                    // форматы условия
);

// DELETE
$wpdb->delete(
    $wpdb->prefix . 'my_table',
    ['id' => $id],
    ['%d']
);
```

> Всегда используй `$wpdb->prefix` вместо хардкода `wp_` — префикс может быть изменён.

---

## 💻 Санитизация входящих данных

Санитизируй **до** сохранения в БД или обработки.

```php
// Строки
$name    = sanitize_text_field($_POST['name']);         // убирает теги и лишние пробелы
$slug    = sanitize_title($_POST['slug']);              // slug-безопасная строка
$email   = sanitize_email($_POST['email']);             // только валидный email
$url     = esc_url_raw($_POST['url']);                  // безопасный URL (для БД)
$hex     = sanitize_hex_color($_POST['color']);         // #RRGGBB / #RGB

// Числа
$id      = absint($_GET['id']);                         // положительное целое
$count   = (int) $_POST['count'];                      // любое целое
$price   = (float) $_POST['price'];                    // дробное

// HTML (нужно разрешить только определённые теги)
$content = wp_kses_post($_POST['content']);             // разрешены теги как в редакторе
$comment = wp_kses($_POST['comment'], [                 // только свои теги
    'a'      => ['href' => [], 'title' => []],
    'strong' => [],
    'em'     => [],
]);

// Массивы
$ids = array_map('absint', $_POST['ids'] ?? []);
```

---

## 💻 Экранирование выходящих данных

Экранируй **непосредственно перед выводом**, не раньше.

```php
// В HTML-контексте
echo esc_html($title);                        // текст внутри тега
echo esc_attr($class);                        // значение атрибута
echo esc_url($link);                          // href, src, action
echo esc_textarea($text);                     // внутри <textarea>

// В JavaScript
echo esc_js($value);                          // в строке JS: var x = '<?= esc_js($v) ?>'
echo wp_json_encode($data);                   // передача данных как JSON

// В переводимых строках
esc_html_e('Hello World', 'my-theme');        // echo + перевод
$label = esc_html__('Submit', 'my-theme');    // return + перевод

// HTML с разрешёнными тегами
echo wp_kses_post($content);                  // как в редакторе WP
```

```php
// Пример: вывод данных из GET в шаблоне
$search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
?>
<input type="search" value="<?= esc_attr($search) ?>">
<p>Результаты для: <?= esc_html($search) ?></p>
```

---

## 💻 CSRF — нонсы

Нонс (nonce) защищает формы и AJAX от подделки запросов.

```php
// В форме — добавить скрытое поле
<form method="post">
    <?php wp_nonce_field('save_profile', 'my_nonce'); ?>
    <!-- поля формы -->
    <button type="submit">Сохранить</button>
</form>
```

```php
// При обработке POST — проверить нонс первым делом
add_action('admin_post_save_profile', function () {
    // check_admin_referer бросает die() если нонс неверный
    check_admin_referer('save_profile', 'my_nonce');

    // теперь безопасно обрабатывать данные
    $name = sanitize_text_field($_POST['name'] ?? '');
    // ...
});
```

```php
// AJAX — нонс в JS и проверка на бэкенде
add_action('wp_enqueue_scripts', function () {
    wp_localize_script('my-script', 'MyApp', [
        'nonce' => wp_create_nonce('my_ajax_action'),
        'ajaxUrl' => admin_url('admin-ajax.php'),
    ]);
});

add_action('wp_ajax_my_action',        'handle_ajax');
add_action('wp_ajax_nopriv_my_action', 'handle_ajax'); // для незалогиненных

function handle_ajax() {
    check_ajax_referer('my_ajax_action', 'nonce');  // проверяет $_POST['nonce']

    // обработка...
    wp_send_json_success(['data' => 'ok']);
}
```

```js
// frontend JS
fetch(MyApp.ajaxUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    action: 'my_action',
    nonce: MyApp.nonce,
    data: 'value',
  }),
}).then(r => r.json()).then(console.log);
```

---

## 💻 Проверка прав доступа (Capabilities)

Всегда проверяй права перед выполнением действия.

```php
// Проверка роли/capability
if (!current_user_can('manage_options')) {
    wp_die('Недостаточно прав', 403);
}

if (!current_user_can('edit_post', $post_id)) {
    wp_send_json_error('Forbidden', 403);
}

// Типичные capabilities
// manage_options    → только администратор
// edit_posts        → редактор и выше
// publish_posts     → автор и выше
// read              → любой залогиненный

// Защита страницы настроек плагина
add_action('admin_menu', function () {
    add_options_page(
        'My Plugin', 'My Plugin', 'manage_options',  // ← capability
        'my-plugin', 'render_settings_page'
    );
});

function render_settings_page() {
    if (!current_user_can('manage_options')) return;  // дополнительная проверка
    // ...
}
```

---

## 💻 REST API — аутентификация эндпоинтов

```php
// Закрытый эндпоинт — только авторизованные
register_rest_route('my-plugin/v1', '/data', [
    'methods'             => 'GET',
    'callback'            => 'get_data_handler',
    'permission_callback' => function () {
        return is_user_logged_in();
    },
]);

// Только администраторы
register_rest_route('my-plugin/v1', '/settings', [
    'methods'             => 'POST',
    'callback'            => 'save_settings_handler',
    'permission_callback' => function () {
        return current_user_can('manage_options');
    },
    'args' => [
        'value' => [
            'required'          => true,
            'sanitize_callback' => 'sanitize_text_field',
            'validate_callback' => fn($v) => is_string($v),
        ],
    ],
]);

// Публичный эндпоинт — явно указываем __return_true
register_rest_route('my-plugin/v1', '/public', [
    'methods'             => 'GET',
    'callback'            => 'public_handler',
    'permission_callback' => '__return_true',
]);
```

---

## 💻 Загрузка файлов

```php
add_action('wp_ajax_upload_file', function () {
    check_ajax_referer('upload_file', 'nonce');

    if (!current_user_can('upload_files')) {
        wp_send_json_error('Forbidden', 403);
    }

    // Разрешённые MIME-типы (WP проверит реальный тип, не только расширение)
    $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    $file = $_FILES['file'] ?? null;
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
        wp_send_json_error('Upload error');
    }

    // Проверить MIME через finfo (не доверяй $_FILES['type'])
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file['tmp_name']);

    if (!in_array($mime, $allowed_types, true)) {
        wp_send_json_error('File type not allowed');
    }

    // Загрузить через WP (обрезает изображения, генерирует пути)
    $upload = wp_handle_upload($file, ['test_form' => false]);

    if (isset($upload['error'])) {
        wp_send_json_error($upload['error']);
    }

    wp_send_json_success(['url' => $upload['url']]);
});
```

---

## 💻 Хардening — конфиг wp-config.php

```php
// Запрет редактирования файлов из админки
define('DISALLOW_FILE_EDIT', true);

// Запрет установки плагинов/тем из админки (для prod с Composer)
define('DISALLOW_FILE_MODS', true);

// Отключить отладку на проде
define('WP_DEBUG',         false);
define('WP_DEBUG_LOG',     false);
define('WP_DEBUG_DISPLAY', false);

// Переместить таблицы с другим префиксом (делать при установке, не после)
$table_prefix = 'x7k_';  // не wp_ — защита от массовых атак на дефолтные имена

// Принудительный HTTPS для авторизации
define('FORCE_SSL_ADMIN', true);

// Ограничить количество ревизий
define('WP_POST_REVISIONS', 5);

// Очищать корзину автоматически
define('EMPTY_TRASH_DAYS', 7);
```

---

## 💻 Хардening — хуки в functions.php

```php
// Убрать версию WP из исходника и RSS
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

// Отключить XML-RPC (вектор брутфорса и DDoS)
add_filter('xmlrpc_enabled', '__return_false');

// Скрыть ошибки входа (не говорить "неверный пароль" vs "пользователь не найден")
add_filter('login_errors', fn() => 'Неверные данные для входа.');

// Блокировать перечисление пользователей через ?author=1
add_action('template_redirect', function () {
    if (is_author() && isset($_GET['author'])) {
        wp_redirect(home_url('/'), 301);
        exit;
    }
});

// Отключить REST API для незалогиненных (если не нужен публичный)
add_filter('rest_authentication_errors', function ($result) {
    if (!is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'Требуется авторизация.', ['status' => 401]);
    }
    return $result;
});

// Ограничить попытки входа (или поставить плагин Limit Login Attempts)
add_filter('authenticate', function ($user, $username) {
    // через плагин Wordfence / Limit Login Attempts Reloaded лучше
    return $user;
}, 30, 2);
```

---

## 💻 Nginx — дополнительные блокировки

```nginx
server {
    # ...

    # Блокировать прямой доступ к wp-config и .env
    location ~* /(?:wp-config\.php|\.env|\.git) {
        deny all;
    }

    # Блокировать исполнение PHP в uploads (защита от загрузки шеллов)
    location ~* /(?:uploads|files)/.*\.php$ {
        deny all;
    }

    # Блокировать xmlrpc.php
    location = /xmlrpc.php {
        deny all;
    }

    # Блокировать readme/license файлы WP (утечка версии)
    location ~* /(?:readme\.html|license\.txt|wp-activate\.php) {
        deny all;
    }

    # Заголовки безопасности
    add_header X-Frame-Options "SAMEORIGIN"            always;
    add_header X-Content-Type-Options "nosniff"        always;
    add_header Referrer-Policy "strict-origin"         always;
    add_header Permissions-Policy "camera=(), microphone=()" always;
    # CSP настраивай под конкретный сайт
}
```

---

## 💻 Checklist перед деплоем

```
Конфиг
□ WP_DEBUG=false
□ DISALLOW_FILE_EDIT=true
□ DISALLOW_FILE_MODS=true (если Composer)
□ FORCE_SSL_ADMIN=true
□ Префикс таблиц изменён (не wp_)
□ Соли сгенерированы (https://api.wordpress.org/secret-key/1.1/salt/)
□ wp-config.php вне web-root (или защищён Nginx)

Nginx
□ xmlrpc.php заблокирован
□ .env/.git заблокированы
□ PHP в uploads/ заблокирован
□ Заголовки безопасности добавлены
□ HTTPS + HSTS включены

WordPress
□ Версия WP не видна в исходнике
□ XML-RPC отключён
□ Сообщения об ошибках входа скрыты
□ Enumeration пользователей по ?author= заблокировано
□ Все плагины/темы обновлены
□ Неиспользуемые плагины/темы удалены (не просто деактивированы)

Код
□ Все SQL-запросы через $wpdb->prepare()
□ Все POST/GET данные санитизированы перед сохранением
□ Все данные экранированы при выводе (esc_html, esc_attr, esc_url)
□ Все формы защищены нонсами
□ Все AJAX-хендлеры проверяют нонс и права
□ REST-эндпоинты имеют permission_callback
```

---

## ⚠️ Подводные камни

- `sanitize_text_field` убирает теги — не используй для HTML-контента, используй `wp_kses_post`
- `esc_url()` — для вывода; `esc_url_raw()` — для сохранения в БД (не добавляет HTML-атрибуты)
- Нонсы протухают через 12-24 часа — AJAX должен обрабатывать ошибку `-1` и перезапрашивать
- `wp_die()` возвращает 200 по умолчанию — передай код: `wp_die('msg', 403)`
- `check_admin_referer()` вызывает `wp_nonce_ays()` и `die()` при провале — используй `wp_verify_nonce()` если нужна мягкая обработка
- Не доверяй `$_FILES['type']` — это то, что прислал браузер; проверяй реальный MIME через `finfo`
- `DISALLOW_FILE_MODS=true` полностью блокирует обновления через админку — убедись что есть другой способ обновлять
