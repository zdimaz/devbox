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

**Когда классический:** простой сайт, клиент сам управляет, нет CI/CD.  
**Когда Bedrock:** командная разработка, git-воркфлоу, несколько сред (dev/staging/prod).

---

## 🔧 Классический WordPress

### Локально (DDEV — рекомендуется)

DDEV поднимает изолированное окружение с PHP, MySQL, Nginx в Docker. Не нужно ничего ставить руками.

```bash
mkdir my-site && cd my-site

# Инициализация — project-type=wordpress настраивает Nginx под WP
ddev config --project-type=wordpress --docroot=.
ddev start

# Скачать WordPress на русском
ddev exec wp core download --locale=ru_RU

# Создать wp-config.php — db/db/db это дефолтные DDEV credentials, не меняй
ddev exec wp config create \
  --dbname=db \
  --dbuser=db \
  --dbpass=db \
  --dbhost=db

# Установить сайт — поменяй my-site, "My Site", admin, admin@example.com
ddev exec wp core install \
  --url=https://my-site.ddev.site \
  --title="My Site" \
  --admin_user=admin \
  --admin_password=admin \
  --admin_email=admin@example.com

# Открыть в браузере
ddev launch
```

### Локально (вручную, без Docker)

```bash
# Скачать и распаковать
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
mv wordpress/ my-site/

# Создать БД — замени my_site, wpuser, secret на свои
mysql -u root -p
CREATE DATABASE my_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL ON my_site.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### wp-config.php — что менять, что нет

```php
// ─── МЕНЯТЬ ────────────────────────────────────────────────

define('DB_NAME',     'my_site');   // имя БД которую создал выше
define('DB_USER',     'wpuser');    // пользователь БД
define('DB_PASSWORD', 'secret');    // пароль пользователя БД
define('DB_HOST',     'localhost'); // обычно localhost, у хостингов может быть другой

// ─── НЕ МЕНЯТЬ (если не знаешь зачем) ──────────────────────

define('DB_CHARSET',  'utf8mb4');   // кодировка — utf8mb4 поддерживает emoji и все языки
define('DB_COLLATE',  '');          // пустая строка = MySQL выберет сам

// ─── СРЕДА РАЗРАБОТКИ (только локально) ────────────────────

define('WP_DEBUG',         true);   // включить отладку — ВЫКЛЮЧИ НА ПРОДЕ
define('WP_DEBUG_LOG',     true);   // писать ошибки в wp-content/debug.log
define('WP_DEBUG_DISPLAY', false);  // не показывать ошибки на странице

// ─── ОГРАНИЧЕНИЯ (рекомендуется везде) ─────────────────────

define('DISALLOW_FILE_EDIT',  true); // запрет редактора тем/плагинов в админке
define('DISALLOW_FILE_MODS',  true); // запрет установки плагинов/тем через админку
                                     // ⚠️ ТОЛЬКО если управляешь через git/Composer

define('WP_POST_REVISIONS', 5);      // хранить не более 5 ревизий поста (по умолчанию бесконечно)
define('AUTOSAVE_INTERVAL', 120);    // автосохранение каждые 120 сек (по умолчанию 60)

// ─── СОЛИ — ГЕНЕРИРУЙ НА https://api.wordpress.org/secret-key/1.1/salt/ ───
define('AUTH_KEY',         'уникальная строка');
define('SECURE_AUTH_KEY',  'уникальная строка');
define('LOGGED_IN_KEY',    'уникальная строка');
define('NONCE_KEY',        'уникальная строка');
// и т.д. — нужны для шифрования куков авторизации, менять при компрометации
```

### На сервере (Ubuntu + Nginx)

```bash
# Nginx конфиг /etc/nginx/sites-available/my-site.com
server {
    listen 80;
    server_name my-site.com www.my-site.com;  # ← поменяй домен

    root /var/www/my-site;   # ← путь к файлам сайта
    index index.php;

    # Стандартный роутинг WP — не трогай
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP обработчик — поменяй версию PHP если нужно (php8.2, php8.1)
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Блокировка чувствительных файлов — не трогай
    location ~* /(?:wp-config\.php|xmlrpc\.php) {
        deny all;
    }

    # Статика — кэшировать на год
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Включить конфиг и перезапустить
ln -s /etc/nginx/sites-available/my-site.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL через Let's Encrypt
certbot --nginx -d my-site.com -d www.my-site.com
```

---

## 🔧 Bedrock

### Локально (DDEV)

```bash
mkdir my-site && cd my-site

# docroot=web — Bedrock хранит WordPress в /web, не в корне
ddev config --project-type=wordpress --docroot=web
ddev start

# Создать проект Bedrock
composer create-project roots/bedrock .

# Скопировать пример конфига
cp .env.example .env
```

### .env — что менять, что нет

```ini
# ─── МЕНЯТЬ ────────────────────────────────────────────────

DB_NAME=db           # имя БД (в DDEV = db)
DB_USER=db           # пользователь (в DDEV = db)
DB_PASSWORD=db       # пароль (в DDEV = db)
DB_HOST=db           # хост (в DDEV = db, на сервере = localhost)

WP_ENV=development   # development | staging | production — меняй под среду

WP_HOME=https://my-site.ddev.site  # URL сайта — меняй на свой домен
WP_SITEURL=${WP_HOME}/wp           # ← НЕ МЕНЯТЬ: Bedrock всегда /wp

# ─── СОЛИ — ГЕНЕРИРУЙ НА https://roots.io/salts/ ───────────

AUTH_KEY='...'
SECURE_AUTH_KEY='...'
# и т.д. — генерируй один раз при создании проекта

# ─── НА ПРОДЕ ДОБАВИТЬ ─────────────────────────────────────

# Запрет установки плагинов через админку (управляем только через Composer)
DISALLOW_FILE_MODS=true
```

```bash
# Установить WordPress
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
# Клонировать репо
git clone git@github.com:you/my-site.git /var/www/my-site
cd /var/www/my-site

# Установить зависимости без dev пакетов
composer install --no-dev

# Создать .env — НЕ копируется из git, создаётся руками на сервере
cp .env.example .env
nano .env  # заполни DB_*, WP_HOME, соли, WP_ENV=production
```

```bash
# Nginx — единственное отличие от классического: root указывает на /web
server {
    listen 80;
    server_name my-site.com;

    root /var/www/my-site/web;   # ← /web, не корень проекта!
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
# Обновить ядро, плагины, темы
wp core update
wp plugin update --all
wp theme update --all

# Экспорт/импорт БД
wp db export backup-$(date +%Y%m%d).sql   # с датой в имени файла
wp db import backup-20260101.sql

# ⚠️ После переноса сайта — обязательно заменить URL везде в БД
# В БД хранятся абсолютные пути к медиафайлам, виджетам, мета-полям
wp search-replace 'https://old-site.com' 'https://new-site.com' --all-tables

# Сбросить пароль если потерял доступ
wp user update admin --user_pass=newpassword

# Очистить кэш после изменений
wp cache flush
wp rewrite flush   # пересобрать .htaccess / правила Nginx
```

---

## 💻 Обязательные плагины

```bash
# Bedrock — через Composer
composer require wpackagist-plugin/advanced-custom-fields  # кастомные поля
composer require wpackagist-plugin/wordpress-seo           # SEO (Yoast)
composer require wpackagist-plugin/wordfence                # файрвол и защита
composer require wpackagist-plugin/wp-super-cache           # кэш страниц

# Классический — через WP-CLI
wp plugin install advanced-custom-fields --activate
wp plugin install wordpress-seo --activate
wp plugin install wordfence --activate
```

---

## ⚠️ Безопасность — чеклист

```php
// functions.php темы

// Скрыть версию WP из исходника страницы и RSS
remove_action('wp_head', 'wp_generator');

// Отключить XML-RPC — старый протокол, вектор атак, нужен только для мобильного приложения WP
add_filter('xmlrpc_enabled', '__return_false');

// Убрать REST API заголовок с версией WP
remove_action('wp_head', 'rest_output_link_wp_head');
```

```bash
# Права на файлы на сервере
# 755 для папок — читать и заходить может любой, писать только владелец
# 644 для файлов — читать может любой, писать только владелец
find /var/www/my-site -type d -exec chmod 755 {} \;
find /var/www/my-site -type f -exec chmod 644 {} \;

# Конфиги — только владелец читает, никто другой
chmod 600 wp-config.php
chmod 600 .env   # Bedrock
```

## ⚠️ Подводные камни

- `wp-config.php` и `.env` — никогда в git
- Bedrock: `web/wp/` и `vendor/` — в `.gitignore`, не коммить
- `DISALLOW_FILE_MODS=true` ставь только если плагины управляются через Composer/git — иначе не сможешь ничего установить через админку
- Nginx `root` для Bedrock → `/web`, для классического → корень сайта
- После любого переноса или смены домена → `wp search-replace`
- `wp rewrite flush` после изменения структуры URL или добавления CPT
