# Docker

## 🧠 Суть
Основные команды Docker и Docker Compose.

## ⚙️ Контейнеры

```bash
docker ps              # запущенные контейнеры
docker ps -a           # все (включая остановленные)
docker start <id>      # запустить
docker stop <id>       # остановить
docker restart <id>    # перезапустить
docker exec -it <id> sh  # войти в контейнер
docker rm <id>         # удалить контейнер
```

## 💻 Образы

```bash
docker images          # список образов
docker pull <имя>      # скачать с Docker Hub
docker build -t <имя> .  # собрать из Dockerfile
docker rmi <id>        # удалить образ
```

## 💻 Docker Compose

```bash
docker-compose up -d --build    # запустить (пересобрать)
docker-compose down             # остановить и удалить
docker-compose down --volumes   # + удалить тома
docker-compose exec web sh      # войти в сервис
```

**С конкретными сервисами:**
```bash
docker-compose up -d redis nginx  # только redis + nginx
docker-compose down redis         # остановить только redis
```

## 💻 Сети

```bash
docker network ls            # список сетей
docker network create <имя>  # создать сеть
```

## 💻 Разное

```bash
docker info       # информация о Docker
docker version    # версия
docker system df  # сколько места занимает
docker system prune -a  # очистить всё неиспользуемое
```

## ⚠️ Подводные камни
- `docker-compose down` не удаляет тома → `--volumes` если нужно
- `docker system prune` удалит **всё** неиспользуемое → осторожно
- Контейнеры в одной сети видят друг друга по имени сервиса

## 🔗 Связанные темы
- [Bash Aliases](/dev/bash-aliases)
