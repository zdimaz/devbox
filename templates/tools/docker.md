---
title: "Docker"
---

# Docker

## 🧠 Суть

Основные команды Docker и Docker Compose.

## ⚙️ Контейнеры

```bash
docker ps
docker ps -a
docker start <id>
docker stop <id>
docker restart <id>
docker exec -it <id> sh
docker rm <id>
```

- `ps` — запущенные контейнеры
- `ps -a` — все (включая остановленные)
- `exec -it <id> sh` — войти в контейнер
- `rm` — удалить контейнер

## 💻 Образы

```bash
docker images
docker pull <имя>
docker build -t <имя> .
docker rmi <id>
```

- `images` — список образов
- `pull` — скачать с Docker Hub
- `build` — собрать из Dockerfile
- `rmi` — удалить образ

## 💻 Docker Compose

```bash
docker-compose up -d --build
docker-compose down
docker-compose down --volumes
docker-compose exec web sh
```

- `up -d --build` — запустить (пересобрать)
- `down` — остановить и удалить
- `down --volumes` — + удалить тома

**С конкретными сервисами:**

```bash
docker-compose up -d redis nginx
docker-compose down redis
```

## 💻 Сети

```bash
docker network ls
docker network create <имя>
```

## 💻 Разное

```bash
docker info
docker version
docker system df
docker system prune -a
```

- `info` — информация о Docker
- `version` — версия
- `system df` — сколько места занимает
- `system prune -a` — очистить всё неиспользуемое

## ⚠️ Подводные камни

- `docker-compose down` не удаляет тома → `--volumes` если нужно
- `docker system prune` удалит **всё** неиспользуемое → осторожно
- Контейнеры в одной сети видят друг друга по имени сервиса
