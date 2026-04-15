---
title: "WordPress — натяжка шаблона"
---

# WordPress — натяжка шаблона

## 🧠 Суть

Пошаговый процесс превращения HTML/CSS макета в рабочую WordPress тему.

## 💻 Минимальная структура темы

```
my-theme/
├── style.css           ← обязателен (мета-данные темы)
├── functions.php       ← хуки, подключение скриптов
├── index.php           ← фоллбэк шаблон
├── header.php
├── footer.php
├── page.php            ← статические страницы
├── single.php          ← одиночный пост
├── archive.php         ← архив постов
├── front-page.php      ← главная страница
└── 404.php
```

```css
/* style.css — обязательный заголовок */
/*
Theme Name: My Theme
Author: DDI
Version: 1.0.0
*/
```

## 💻 functions.php — базовый шаблон

```php
<?php

// Подключение скриптов и стилей
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('theme', get_stylesheet_uri(), [], '1.0.0');
    wp_enqueue_script('app', get_template_directory_uri() . '/dist/app.js', [], '1.0.0', true);
});

// Поддержка WordPress функций
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');           // <title> управляется WP
    add_theme_support('post-thumbnails');     // Featured image
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery']);
    add_theme_support('menus');

    // Зоны меню
    register_nav_menus([
        'primary' => 'Основное меню',
        'footer'  => 'Меню в футере',
    ]);
});

// Сайдбары (виджеты)
add_action('widgets_init', function () {
    register_sidebar([
        'name' => 'Сайдбар',
        'id'   => 'sidebar-1',
    ]);
});
```

## 💻 Вывод контента

```php
<!-- header.php -->
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?> <!-- обязательно — сюда WP вставляет стили/скрипты -->
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
```

```php
<!-- footer.php -->
<?php wp_footer(); ?> <!-- обязательно — сюда WP вставляет скрипты -->
</body>
</html>
```

```php
<!-- page.php -->
<?php get_header(); ?>

<?php while (have_posts()) : the_post(); ?>
    <h1><?php the_title(); ?></h1>
    <div><?php the_content(); ?></div>
<?php endwhile; ?>

<?php get_footer(); ?>
```

## 💻 ACF — кастомные поля

Самый удобный способ добавить данные к страницам/постам.

```php
// Вывод поля
$subtitle = get_field('subtitle');

// Группа полей (repeater, flexible content)
if (have_rows('team')) :
    while (have_rows('team')) : the_row();
        $name  = get_sub_field('name');
        $photo = get_sub_field('photo');
    endwhile;
endif;

// Поле с изображением (возвращает массив)
$image = get_field('hero_image');
// $image['url'], $image['alt'], $image['sizes']['large']
```

```php
// ACF Options Page — глобальные настройки сайта
if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title' => 'Настройки сайта',
        'menu_slug'  => 'site-settings',
    ]);
}

// Вывод с options страницы
$phone = get_field('phone', 'option');
$email = get_field('email', 'option');
```

## 💻 Кастомные типы записей (CPT)

```php
add_action('init', function () {
    register_post_type('project', [
        'labels'      => [
            'name'          => 'Проекты',
            'singular_name' => 'Проект',
        ],
        'public'      => true,
        'has_archive' => true,
        'supports'    => ['title', 'editor', 'thumbnail'],
        'menu_icon'   => 'dashicons-portfolio',
        'rewrite'     => ['slug' => 'projects'],
    ]);
});
```

## 💻 WP_Query — кастомные запросы

```php
$query = new WP_Query([
    'post_type'      => 'project',
    'posts_per_page' => 6,
    'orderby'        => 'date',
    'order'          => 'DESC',
    'meta_query'     => [
        [
            'key'   => 'featured',
            'value' => '1',
        ],
    ],
]);

if ($query->have_posts()) :
    while ($query->have_posts()) : $query->the_post();
        // вывод
    endwhile;
    wp_reset_postdata(); // обязательно после кастомного запроса
endif;
```

## 💻 Меню

```php
wp_nav_menu([
    'theme_location' => 'primary',
    'container'      => 'nav',
    'container_class'=> 'main-nav',
    'menu_class'     => 'nav__list',
    'depth'          => 2,
]);
```

## 💻 Хуки — часто используемые

```php
// Убрать emoji скрипты WP (лишний вес)
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Убрать версию WP из исходника (безопасность)
remove_action('wp_head', 'wp_generator');

// Отключить XML-RPC (безопасность)
add_filter('xmlrpc_enabled', '__return_false');

// Лимит ревизий
add_filter('wp_revisions_to_keep', fn() => 5);
```

## 🚀 Порядок натяжки

1. Скопируй HTML в шаблоны (`header.php`, `footer.php`, `page.php`)
2. Замени статический контент на WP теги (`the_title()`, `the_content()`)
3. Подключи CSS/JS через `wp_enqueue_scripts`
4. Создай ACF группы полей для динамического контента
5. Зарегистрируй CPT если нужны кастомные типы
6. Настрой меню через `register_nav_menus` + `wp_nav_menu()`
7. Проверь `wp_head()` и `wp_footer()` — без них плагины не работают

## ⚠️ Подводные камни

- Всегда `wp_reset_postdata()` после `WP_Query` — иначе сломается глобальный луп
- `get_template_directory_uri()` — для файлов темы; `get_stylesheet_directory_uri()` — для дочерней темы
- Стили подключай через `wp_enqueue_style`, не через `<link>` в `header.php`
- `body_class()` обязателен — многие плагины добавляют свои классы туда
