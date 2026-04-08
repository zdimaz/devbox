# Структура Craft CMS

## 🧠 Суть
Оптимальная структура проекта на Craft CMS для переиспользования и поддержки.

## ⚙️ Базовая структура

```
project/
├── config/
│   ├── general.php
│   ├── routes.php
│   └── project.yaml
├── modules/
│   └── SiteModule.php
├── templates/
│   ├── _layout.twig
│   ├── _partials/
│   │   ├── header.twig
│   │   ├── footer.twig
│   │   └── nav.twig
│   ├── _components/
│   │   ├── card.twig
│   │   └── modal.twig
│   ├── index.twig
│   └── error/
│       └── 404.twig
├── web/
│   ├── dist/          # Vite build output
│   └── uploads/       # User uploads
└── .env
```

## 💻 Section Types

### Single (одностраничник)
```yaml
# project.yaml
sections:
  home:
    type: single
    template: index
    enableVersioning: false
```

### Channel (новости, блог)
```yaml
sections:
  news:
    type: channel
    template: news/_entry
    maxLevels: 1
```

### Structure (иерархия)
```yaml
sections:
  pages:
    type: structure
    template: pages/_entry
    maxLevels: 3
```

## 💻 Matrix/Neo Blocks

```yaml
# Field: contentBlocks (Matrix)
blocks:
  text:
    fields:
      content: { type: redactor }
  image:
    fields:
      image: { type: assets, kind: images }
      caption: { type: plainText }
  quote:
    fields:
      text: { type: plainText }
      author: { type: plainText }
```

## ⚠️ Подводные камни
- `project.yaml` не трекать `dateModified` → добавь в `.gitignore`
- Neo blocks → не экспортируются через project.yaml полностью
- Asset transforms → кэшируются, не забывай `clear-caches`

## 🚀 Best Practice
1. Всё через project.yaml (не через админку)
2. Компоненты → отдельные файлы `_components/`
3. Layouts → `_layout.twig` + embeds
4. Env vars → `.env`, не в конфиге

## 🔗 Связанные темы
- [Twig Best Practices](/craft/twig)
- [Компоненты](/craft/components)
