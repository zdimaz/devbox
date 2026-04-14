---
title: "WordPress — установка и настройка"
---

# WordPress — установка и настройка

## 🧠 Суть

Два пути: классический WordPress и современный Bedrock. Выбирай по проекту.

| | Классический | Bedrock |
|---|---|---|
| Структура | всё в web-root | разделены app и web |
| Конфиг | `wp-config.php` | `.env` |
| Плагины | через админку | через Composer |
| Git-friendly | ❌ | ✅ |
| Порог входа | низкий | средний |

---

## 🔧 Классический WordPress

### Локально (DDEV)

```bash
# Установи DDEV: https://ddev.readthedocs.io
mkdir my-site && cd my-site
ddev config --project-type=wordpress --docroot=.
ddev start

# Скачай WordPress
ddev exec wp core download --locale=ru_RU

# Создай wp-config.php
ddev exec wp config create \
  --dbname=db \
  --dbuser=db \
  --dbpass=db \
  --dbhost=db

# Установи сайт
ddev exec wp core install \
  --url=https://my-site.ddev.site \
  --title="My Site" \
  --admin_user=admin \
  --admin_password=admin \
  --admin_email=admin@example.com

ddev launch
```

### Локально (вручную)

```bash
# Скачай и распакуй
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
mv wordpress/ my-site/

# Создай БД
mysql -u root -p
CREATE DATABASE my_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL ON my_site.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
```

```php
// wp-config.php — основные настройки
define('DB_NAME',     'my_site');
define('DB_USER',     'wpuser');
define('DB_PASSWORD', 'secret');
define('DB_HOST',     'localhost');
define('DB_CHARSET',  'utf8mb4');

define('WP_DEBUG',         true);  // выключи на проде
define('WP_DEBUG_LOG',     true);  // логи в wp-content/debug.log
define('WP_DEBUG_DISPLAY', false);

// Отключить редактирование файлов через админку
define('DISALLOW_FILE_EDIT', true);

// Лимит ревизий
define('WP_POST_REVISIONS', 5);

// Автосохранение (секунды)
define('AUTOSAVE_INTERVAL', 120);
```

### На сервере (Ubuntu/Nginx)

```bash
# Nginx конфиг
server {
    listen 80;
    server_name my-site.com;
    root /var/www/my-site;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Запретить доступ к чувствительным файлам
    location ~* /(?:wp-config\.php|xmlrpc\.php|wp-login\.php) {
        deny all;
    }
}
```

---

## 🔧 Bedrock

### Локально (DDEV)

```bash
# Установи DDEV: https://ddev.readthedocs.io
mkdir my-site && cd my-site
ddev config --project-type=wordpress --docroot=web
ddev start

composer create-project roots/bedrock .
cp .env.example .env
```

```ini
# .env
DB_NAME=db
DB_USER=db
DB_PASSWORD=db
DB_HOST=db

WP_ENV=development
WP_HOME=https://my-site.ddev.site
WP_SITEURL=${WP_HOME}/wp
```

```bash
# Установи WP через WP-CLI
ddev exec wp core install \
  --path=web/wp \
  --url=https://my-site.ddev.site \
  --title="My Site" \
  --admin_user=admin \
  --admin_password=admin \
  --admin_email=admin@example.com

ddev launch
```

### На сервере (Bedrock + Nginx)

```bash
# Клонируй репо и установи зависимости
git clone git@github.com:you/my-site.git /var/www/my-site
cd /var/www/my-site
composer install --no-dev
cp .env.example .env
# отредактируй .env под прод
```

```bash
# Nginx конфиг для Bedrock (web-root = /web)
server {
    listen 80;
    server_name my-site.com;
    root /var/www/my-site/web;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## 💻 WP-CLI — полезные команды

```bash
# Обновить всё
wp core update
wp plugin update --all
wp theme update --all

# Экспорт/импорт БД
wp db export backup.sql
wp db import backup.sql

# Замена URL (после переноса сайта)
wp search-replace 'https://old-site.com' 'https://new-site.com' --all-tables

# Сбросить пароль
wp user update admin --user_pass=newpassword

# Очистить кэш
wp cache flush
wp rewrite flush
```

## 💻 Обязательные плагины

```bash
# Через Composer (Bedrock)
composer require wpackagist-plugin/advanced-custom-fields
composer require wpackagist-plugin/wordpress-seo        # Yoast SEO
composer require wpackagist-plugin/wordfence             # безопасность
composer require wpackagist-plugin/wp-super-cache        # кэш

# Через WP-CLI (классический)
wp plugin install advanced-custom-fields --activate
wp plugin install wordpress-seo --activate
```

## ⚠️ Безопасность — базовый чеклист

```php
// В wp-config.php или functions.php

// Скрыть версию WP
remove_action('wp_head', 'wp_generator');

// Отключить XML-RPC (если не используется)
add_filter('xmlrpc_enabled', '__return_false');

// Ограничить попытки входа — установи плагин Limit Login Attempts
```

```bash
# Права на файлы
find /var/www/my-site -type d -exec chmod 755 {} \;
find /var/www/my-site -type f -exec chmod 644 {} \;
chmod 600 wp-config.php   # только владелец читает
chmod 600 .env            # Bedrock
```

## ⚠️ Подводные камни

- После переноса сайта всегда `wp search-replace` — в БД хранятся абсолютные URL
- `wp-config.php` — никогда в git (добавь в `.gitignore`)
- Bedrock: `web/wp/` и `vendor/` — в `.gitignore`, генерируются через Composer
- Nginx `root` для Bedrock указывает на `/web`, не на корень проекта
- `DISALLOW_FILE_MODS=true` на проде — иначе можно поставить плагин в обход git
