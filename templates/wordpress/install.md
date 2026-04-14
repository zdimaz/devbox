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

## 💻 Локальная разработка (DDEV)

> DDEV — только для локальной разработки. Поднимает PHP, MySQL, Nginx в Docker.  
> На реальный сервер DDEV не ставится — там всё устанавливается руками (см. раздел ниже).

### Классический WordPress

```bash
mkdir my-site && cd my-site

# project-type=wordpress — DDEV настроит Nginx под WordPress автоматически
# docroot=. — корень сайта это текущая папка
ddev config --project-type=wordpress --docroot=.
ddev start

# Скачать WordPress
ddev exec wp core download --locale=ru_RU

# Создать wp-config.php
# db/db/db — дефолтные DDEV credentials, не меняй их
ddev exec wp config create \
  --dbname=db \
  --dbuser=db \
  --dbpass=db \
  --dbhost=db

# Установить сайт — поменяй my-site, "My Site", admin, email
ddev exec wp core install \
  --url=https://my-site.ddev.site \
  --title="My Site" \
  --admin_user=admin \
  --admin_password=admin \
  --admin_email=admin@example.com

ddev launch  # открыть в браузере
```

### Bedrock

```bash
mkdir my-site && cd my-site

# docroot=web — у Bedrock WordPress лежит в /web, не в корне
ddev config --project-type=wordpress --docroot=web
ddev start

composer create-project roots/bedrock .
cp .env.example .env
```

Отредактировать `.env`:

```ini
# DDEV credentials — не меняй
DB_NAME=db
DB_USER=db
DB_PASSWORD=db
DB_HOST=db

WP_ENV=development
WP_HOME=https://my-site.ddev.site  # ← поменяй my-site на имя проекта
WP_SITEURL=${WP_HOME}/wp           # не менять — Bedrock всегда /wp

# Соли — сгенерируй на https://roots.io/salts/ и вставь
AUTH_KEY='...'
SECURE_AUTH_KEY='...'
# и т.д.
```

```bash
ddev exec wp core install \
  --path=web/wp \
  --url=https://my-site.ddev.site \
  --title="My Site" \
  --admin_user=admin \
  --admin_password=admin \
  --admin_email=admin@example.com

ddev launch
```

---

## 🖥️ Деплой на сервер (Ubuntu + Nginx)

> DDEV здесь не используется. Всё устанавливается напрямую на сервер.

### 1. Установка стека

```bash
apt update && apt upgrade -y

# Nginx — веб-сервер
apt install -y nginx

# MySQL — база данных
apt install -y mysql-server
mysql_secure_installation  # интерактивно: задать пароль root, удалить тестовые БД

# PHP 8.2 + расширения нужные для WordPress
apt install -y php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl \
  php8.2-gd php8.2-mbstring php8.2-zip php8.2-intl php8.2-bcmath

# Проверить что сервисы запущены
systemctl status nginx
systemctl status mysql
systemctl status php8.2-fpm
```

### 2. Создание БД

```bash
mysql -u root -p

-- Замени my_site на имя своего проекта
CREATE DATABASE my_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Замени wpuser и secret на свои значения
-- @'localhost' — подключение только с этого сервера, не из сети
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'secret';

-- Права только на одну БД, не на все
GRANT ALL PRIVILEGES ON my_site.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Загрузка файлов сайта

**Классический WordPress:**

```bash
mkdir -p /var/www/my-site.com
cd /var/www/my-site.com

wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz --strip-components=1  # распаковать без вложенной папки wordpress/
rm latest.tar.gz
```

**Bedrock:**

```bash
# Клонировать репо
git clone git@github.com:you/my-site.git /var/www/my-site.com
cd /var/www/my-site.com

# Установить зависимости (без dev-пакетов)
composer install --no-dev

# .env не хранится в git — создаётся руками на каждом сервере
cp .env.example .env
nano .env
# Заполнить: DB_*, WP_HOME=https://my-site.com, WP_ENV=production, соли
```

```bash
# Права для обоих вариантов — www-data это пользователь Nginx/PHP
chown -R www-data:www-data /var/www/my-site.com
find /var/www/my-site.com -type d -exec chmod 755 {} \;
find /var/www/my-site.com -type f -exec chmod 644 {} \;
```

### 4. Конфиг wp-config.php (только классический)

```bash
cp wp-config-sample.php wp-config.php
nano wp-config.php
```

```php
// ─── МЕНЯТЬ ────────────────────────────────────────────────
define('DB_NAME',     'my_site');    // имя БД из шага 2
define('DB_USER',     'wpuser');     // пользователь из шага 2
define('DB_PASSWORD', 'secret');     // пароль из шага 2
define('DB_HOST',     'localhost');  // MySQL на том же сервере — не менять

// ─── НЕ МЕНЯТЬ ──────────────────────────────────────────────
define('DB_CHARSET',  'utf8mb4');    // utf8mb4 = полная Unicode поддержка
define('DB_COLLATE',  '');           // пустая строка = MySQL выберет сам

// ─── ПРОД НАСТРОЙКИ ─────────────────────────────────────────
define('WP_DEBUG',           false); // на проде всегда false
define('DISALLOW_FILE_EDIT', true);  // запрет редактора кода в админке
define('WP_POST_REVISIONS',  5);     // хранить не более 5 ревизий

// ─── СОЛИ — открой https://api.wordpress.org/secret-key/1.1/salt/
//            и вставь весь блок вместо заглушек ──────────────
define('AUTH_KEY',        '...');
define('SECURE_AUTH_KEY', '...');
// и т.д.
```

### 5. Nginx конфиг

```bash
nano /etc/nginx/sites-available/my-site.com
```

**Классический WordPress:**

```nginx
server {
    listen 80;
    server_name my-site.com www.my-site.com;  # ← домен

    root /var/www/my-site.com;  # ← путь из шага 3
    index index.php;

    # ЧПУ-ссылки — не трогай
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP — поменяй 8.2 если используешь другую версию
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Блокировка конфигов — не трогай
    location ~* /(?:wp-config\.php|xmlrpc\.php) {
        deny all;
    }

    # Кэш статики на год
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Bedrock** — единственное отличие: `root` указывает на `/web`:

```nginx
server {
    listen 80;
    server_name my-site.com www.my-site.com;

    root /var/www/my-site.com/web;  # ← /web, не корень проекта!
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* /(?:wp-config\.php|xmlrpc\.php|\.env) {
        deny all;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Включить конфиг
ln -s /etc/nginx/sites-available/my-site.com /etc/nginx/sites-enabled/

# Проверить синтаксис (nginx скажет в какой строке ошибка)
nginx -t

# Применить
systemctl reload nginx
```

### 6. SSL

```bash
apt install -y certbot python3-certbot-nginx

# Получить сертификат — certbot сам обновит Nginx конфиг под HTTPS
certbot --nginx -d my-site.com -d www.my-site.com

# Автообновление уже настроено, проверить:
systemctl status certbot.timer
```

### 7. Завершение

**Классический** — открой `https://my-site.com` в браузере, запустится визард WordPress.

**Bedrock** — запусти через WP-CLI:

```bash
wp --path=web/wp core install \
  --url=https://my-site.com \
  --title="My Site" \
  --admin_user=admin \
  --admin_password=StrongPassword123! \
  --admin_email=admin@my-site.com
```

---

## 💻 WP-CLI — полезные команды

```bash
# Обновить ядро, плагины, темы
wp core update
wp plugin update --all
wp theme update --all

# Экспорт/импорт БД
wp db export backup-$(date +%Y%m%d).sql
wp db import backup-20260101.sql

# ⚠️ После переноса — обязательно, в БД хранятся абсолютные URL
wp search-replace 'https://old-site.com' 'https://new-site.com' --all-tables

# Сброс пароля
wp user update admin --user_pass=newpassword

# Очистка кэша
wp cache flush
wp rewrite flush
```

---

## 💻 Обязательные плагины

```bash
# Bedrock — через Composer
composer require wpackagist-plugin/advanced-custom-fields
composer require wpackagist-plugin/wordpress-seo
composer require wpackagist-plugin/wordfence
composer require wpackagist-plugin/wp-super-cache

# Классический — через WP-CLI
wp plugin install advanced-custom-fields --activate
wp plugin install wordpress-seo --activate
wp plugin install wordfence --activate
```

---

## ⚠️ Подводные камни

- `wp-config.php` и `.env` — никогда в git
- Bedrock: `web/wp/` и `vendor/` — в `.gitignore`, генерируются Composer
- `DISALLOW_FILE_MODS=true` ставь только если плагины управляются через Composer — иначе не установишь ничего через админку
- Nginx `root` для Bedrock → `/web`, для классического → корень сайта
- После переноса или смены домена → `wp search-replace`
- `wp rewrite flush` после изменения структуры URL или добавления CPT
