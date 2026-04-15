---
title: "WordPress Bedrock"
---

# WordPress Bedrock

## 🧠 Суть

Bedrock — современная структура WordPress от Roots. Composer-зависимости, `.env` конфиг, разделение web-root и приложения.

## ⚙️ Установка

```bash
composer create-project roots/bedrock my-site
cd my-site
cp .env.example .env
```

## ⚙️ .env конфиг

```ini
DB_NAME=my_db
DB_USER=root
DB_PASSWORD=secret
DB_HOST=localhost

WP_ENV=development          # development / staging / production
WP_HOME=http://my-site.test
WP_SITEURL=${WP_HOME}/wp

# Генерируй на https://roots.io/salts/
AUTH_KEY=...
SECURE_AUTH_KEY=...
```

## 💻 Структура

```
my-site/
├── config/
│   ├── application.php     ← главный конфиг WP (вместо wp-config.php)
│   └── environments/
│       ├── development.php
│       ├── staging.php
│       └── production.php
├── web/
│   ├── app/
│   │   ├── mu-plugins/     ← must-use плагины
│   │   ├── plugins/        ← обычные плагины (через Composer)
│   │   ├── themes/         ← темы
│   │   └── uploads/
│   ├── wp/                 ← ядро WordPress (не трогать)
│   └── index.php
├── vendor/
└── composer.json
```

## 💻 Управление плагинами через Composer

```bash
# Найти плагин
composer search wpackagist-plugin/advanced-custom-fields

# Установить плагин (WPackagist)
composer require wpackagist-plugin/advanced-custom-fields
composer require wpackagist-plugin/contact-form-7

# Обновить всё
composer update

# Обновить только WordPress
composer update roots/wordpress
```

> Все плагины через `composer.json` — не через админку. Так они в git и воспроизводимы.

## 💻 Подключение темы

```bash
# Создать тему (или Sage)
mkdir web/app/themes/my-theme

# Или через Sage (стартер-тема с Vite)
composer create-project roots/sage web/app/themes/my-theme
```

## 💻 Environments

```php
// config/environments/development.php
Config::define('WP_DEBUG', true);
Config::define('WP_DEBUG_LOG', true);
Config::define('WP_DEBUG_DISPLAY', false);
Config::define('SCRIPT_DEBUG', true);
Config::define('DISALLOW_FILE_MODS', false);
```

```php
// config/environments/production.php
Config::define('WP_DEBUG', false);
Config::define('DISALLOW_FILE_MODS', true); // запрет установки через админку
Config::define('DISALLOW_FILE_EDIT', true); // запрет редактора тем/плагинов
```

## 💻 WP-CLI с Bedrock

```bash
# Запускай из корня проекта
wp --path=web/wp

# Или добавь алиас в .env / wp-cli.yml
# web/wp-cli.yml:
path: wp
```

```bash
wp plugin list
wp user create admin admin@site.com --role=administrator --user_pass=secret
wp search-replace 'http://old-site.com' 'http://new-site.com'
```

## 🚀 Деплой советы

- `.env` никогда в git — на сервере создаётся вручную или через CI secrets
- `web/app/uploads/` — монтируй как persistent volume или S3
- `composer install --no-dev` на проде
- `web/wp/` генерируется Composer — не коммить в git (добавь в `.gitignore`)

## ⚠️ Подводные камни

- Плагины из `.org` → через WPackagist (`wpackagist-plugin/slug`)
- Премиум плагины (ACF Pro, Gravity Forms) → через их приватный Composer репо или `repositories` в `composer.json`
- `WP_SITEURL` должен заканчиваться на `/wp` — это обязательно для Bedrock
- Не устанавливай плагины через админку — они пропадут при следующем `composer install`
