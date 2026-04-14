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

#### 1. Установка стека

```bash
# Обновить пакеты
apt update && apt upgrade -y

# Nginx
apt install -y nginx

# MySQL
apt install -y mysql-server
mysql_secure_installation  # интерактивная настройка: пароль root, удалить тестовые БД

# PHP 8.2 + расширения нужные для WordPress
apt install -y php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl \
  php8.2-gd php8.2-mbstring php8.2-zip php8.2-intl php8.2-bcmath

# Проверить что всё запущено
systemctl status nginx
systemctl status mysql
systemctl status php8.2-fpm
```

#### 2. Создание БД и пользователя

```bash
mysql -u root -p

# Создать БД — замени my_site на имя своего проекта
CREATE DATABASE my_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Создать пользователя — замени wpuser и secret на свои
# 'wpuser'@'localhost' — пользователь может подключаться только локально
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'secret';

# Дать права только на эту БД — не давай GRANT ALL ON *.* (это права на все БД)
GRANT ALL PRIVILEGES ON my_site.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Загрузка WordPress

```bash
# Создать папку сайта — замени my-site.com на домен
mkdir -p /var/www/my-site.com
cd /var/www/my-site.com

# Скачать и распаковать WordPress
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz --strip-components=1  # распаковать содержимое без папки wordpress/
rm latest.tar.gz

# Права — www-data это пользователь от которого работает Nginx/PHP
chown -R www-data:www-data /var/www/my-site.com
find /var/www/my-site.com -type d -exec chmod 755 {} \;
find /var/www/my-site.com -type f -exec chmod 644 {} \;
```

#### 4. wp-config.php

```bash
cp wp-config-sample.php wp-config.php
nano wp-config.php
```

Заменить блок БД:

```php
define('DB_NAME',     'my_site');    // ← имя БД из шага 2
define('DB_USER',     'wpuser');     // ← пользователь из шага 2
define('DB_PASSWORD', 'secret');     // ← пароль из шага 2
define('DB_HOST',     'localhost');  // не менять — MySQL на том же сервере
```

Соли — открой в браузере `https://api.wordpress.org/secret-key/1.1/salt/` и вставь весь блок вместо заглушек.

На проде добавить:

```php
define('WP_DEBUG',        false);
define('DISALLOW_FILE_EDIT', true);   // запрет редактора кода в админке
```

#### 5. Nginx конфиг

```bash
nano /etc/nginx/sites-available/my-site.com
```

```nginx
server {
    listen 80;
    server_name my-site.com www.my-site.com;  # ← поменяй на свой домен

    root /var/www/my-site.com;  # ← путь из шага 3
    index index.php;

    # Стандартный роутинг WordPress — не трогай
    # Сначала ищет файл, потом папку, потом отдаёт в index.php (ЧПУ)
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP — поменяй версию если используешь не 8.2
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Запретить прямой доступ к конфигам — не трогай
    location ~* /(?:wp-config\.php|xmlrpc\.php|\.env) {
        deny all;
    }

    # Статика — браузер кэширует на год, не будет лишних запросов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Включить конфиг (симлинк в sites-enabled)
ln -s /etc/nginx/sites-available/my-site.com /etc/nginx/sites-enabled/

# Проверить синтаксис — если ошибка, nginx скажет в какой строке
nginx -t

# Применить конфиг
systemctl reload nginx
```

#### 6. SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx

# Получить сертификат и автоматически обновить Nginx конфиг
certbot --nginx -d my-site.com -d www.my-site.com

# Автообновление сертификата — certbot сам добавляет cron, проверить:
systemctl status certbot.timer
```

#### 7. Завершение установки

Открой `https://my-site.com` в браузере — запустится визард WordPress:
- Выбери язык
- Введи название сайта, логин, пароль администратора, email
- Нажми «Установить WordPress»

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
