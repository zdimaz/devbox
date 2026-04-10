# Autoprefixer

## 🧠 Суть

Авто-добавление вендорных префиксов (`-webkit-`, `-moz-`) для CSS свойств.

## ⚙️ Настройка

### В Vite-проекте (авто)

Vite + PostCSS подхватывает `.browserslistrc` автоматически:

```
# .browserslistrc в корне проекта
> 0.5%
last 2 versions
not dead
not IE 11
not op_mini all
```

Или в `package.json`:

```json
{
  "browserslist": ["> 0.5%", "last 2 versions", "not dead", "not IE 11", "not op_mini all"]
}
```

**Пояснения:**

- `> 0.5%` — браузеры с долей > 0.5%
- `last 2 versions` — последние 2 версии каждого
- `not dead` — исключить заброшенные браузеры
- `not IE 11` — убрать префиксы для IE
- `not op_mini all` — убрать Opera Mini

### Для современных браузеров

```
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
```

Результат — минимум префиксов, только `-webkit-` для Safari.

## 💻 Какие свойства ещё нуждаются в префиксах

| Свойство          | Префикс    | Для кого      |
| ----------------- | ---------- | ------------- |
| `mask-image`      | `-webkit-` | Safari        |
| `clip-path`       | `-webkit-` | Старый Safari |
| `appearance`      | `-webkit-` | Safari        |
| `backdrop-filter` | `-webkit-` | Safari        |

**Не нуждаются в префиксах:** `flex`, `grid`, `transform`, `transition`, `animation`

## ⚠️ Подводные камни

- Без `.browserslistrc` Autoprefixer добавляет префиксы для всего
- Vite уже включает PostCSS → отдельная настройка не нужна

## 🔗 Связанные темы

- [CSS Функции](/frontend/css-functions)
- [PurgeCSS](/frontend/purgecss)
