# Bash Aliases

## 🧠 Суть
Горячие команды для Docker, Deployer, SQL импорта.

## ⚙️ Установка

```bash
# Создай файл
nano ~/.bash_aliases

# Вставь алиасы, сохрани (Ctrl+O → Enter → Ctrl+X)

# Перезагрузи bash
source ~/.bashrc
```

**Разница `.bashrc` vs `.bash_aliases`:**
- `.bashrc` — основной конфиг bash
- `.bash_aliases` — подключается из `.bashrc` автоматически, удобней для структуры

## 💻 Алиасы

### Docker Compose

```bash
dcb          # docker-compose up -d --build
dcd          # docker-compose down
dcu          # docker-compose up -d --build (альтернатива)
```

С аргументами (сервисы):
```bash
dcb redis    # только redis сервис
dcd --volumes   # с удалением томов
```

### Войти в контейнер

```bash
# Функция: de-sql <project_tag> <db_name> <sql_file>
de-sql myproject mydb dump.sql

# Или без аргументов (берёт из .env):
de-sql
```

**Что делает:**
1. Берёт `PROJECT_TAG` из `.env` или аргумента
2. Импортирует `db.sql` в MySQL контейнер
3. Показывает прогресс

### Deployer (деплой)

```bash
dep-s        # deploy staging
dep-p        # deploy production
dep-sa       # deploy staging (из app/)
```

### Разное

```bash
sp           # sudo chmod -R 777 ./
de-sh        # войти в контейнер (sh)
```

## ⚠️ Подводные камни
- `.bash_aliases` должен подключаться в `.bashrc`:
  ```bash
  if [ -f ~/.bash_aliases ]; then
      . ~/.bash_aliases
  fi
  ```
- Функции лучше алиасов — можно с аргументами
- Пароль MySQL захардкожен → смени на свой

## 🔗 Связанные темы
- [Docker](/dev/docker)
- [Arch Setup](/linux/arch-setup)
