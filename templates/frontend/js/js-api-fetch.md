# JS — работа с HTTP API (fetch)

## Основа: fetch + async/await

`fetch` — встроенная браузерная функция для HTTP-запросов.  
Возвращает **Promise** — "обещание" что данные придут асинхронно.  
`async/await` — синтаксический сахар над Promise, делает код читаемым.

```js
async function getUsers() {
  const res = await fetch('https://api.example.com/users') // ждём заголовки
  const data = await res.json()                            // ждём тело ответа
  console.log(data)
}
```

> Два `await` потому что `fetch` сначала возвращает объект `Response` (заголовки),
> а `.json()` — отдельная async операция чтения и парсинга тела.

---

## Четыре основных метода

### GET — получить
```js
const res = await fetch('https://api.example.com/users')
const data = await res.json()
```

### POST — создать
```js
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ivan', age: 25 })
})
```

### PATCH — обновить частично (только нужные поля)
```js
const res = await fetch('https://api.example.com/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ age: 26 })
})
```

### DELETE — удалить
```js
const res = await fetch('https://api.example.com/users/1', {
  method: 'DELETE'
})
```

---

## Обработка ошибок

```js
async function getUser(id) {
  try {
    const res = await fetch(`https://api.example.com/users/${id}`)

    if (!res.ok) {
      // fetch НЕ бросает ошибку при 404/500 — нужно проверять вручную
      throw new Error(`Ошибка: ${res.status}`)
    }

    return await res.json()
  } catch (err) {
    console.error('Что-то пошло не так:', err.message)
  }
}
```

> `fetch` бросает исключение **только** при сетевой ошибке (нет соединения).  
> Статусы `404`, `500` — не исключения. Проверяй `res.ok` или `res.status` вручную.

---

## Headers и авторизация

```js
const res = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
```

---

## Promise vs async/await — когда что использовать

`async/await` — дефолтный выбор для **любого** async кода. `.then()` цепочки в новом коде не пишут.

Promise напрямую нужен в двух реальных случаях:

### Promise.all — параллельные запросы
```js
// Последовательно — медленно (второй ждёт первого):
const users = await fetch('/users').then(r => r.json())
const posts = await fetch('/posts').then(r => r.json())

// Параллельно — быстро:
const [users, posts] = await Promise.all([
  fetch('/users').then(r => r.json()),
  fetch('/posts').then(r => r.json())
])
```

### Promise.race — кто ответит первый
```js
// Таймаут запроса — кто быстрее: fetch или 5 секунд
const res = await Promise.race([
  fetch('/users'),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
])
```

---

## async/await — не только для HTTP

Любая операция которая занимает время и не должна блокировать интерфейс — асинхронная.
`async/await` работает везде где есть Promise, не только в fetch.

### Таймер / пауза
```js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function showMessage() {
  console.log('Старт')
  await delay(2000)        // ждём 2 секунды, UI не замерзает
  console.log('Прошло 2с')
}
```

### Геолокация (Web API браузера)
```js
const getPosition = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject)
})

async function showLocation() {
  const pos = await getPosition()
  console.log(pos.coords.latitude, pos.coords.longitude)
}
```

### Чтение файла (input type=file)
```js
const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsText(file)
})

async function handleUpload(event) {
  const file = event.target.files[0]
  const content = await readFile(file)
  console.log(content)
}
```

### Node.js — чтение файла с диска
```js
import { readFile } from 'fs/promises'

async function loadConfig() {
  const raw = await readFile('./config.json', 'utf-8')
  return JSON.parse(raw)
}
```

> **Правило:** если операция может занять время или зависит от внешнего ресурса
> (сеть, диск, таймер, железо) — она асинхронная, используй `async/await`.

---

## Токен — что это и зачем

Сервер должен знать **кто** делает запрос и **можно ли** ему это делать.

```
1. Ты логинишься  →  POST /login { email, password }
2. Сервер проверяет  →  возвращает токен (длинная строка)
3. Все следующие запросы  →  шлёшь токен в заголовке
4. Сервер видит токен  →  знает кто ты  →  даёт данные
```

```js
// Логин — получаем токен
const res = await fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@mail.com', password: '123' })
})
const { token } = await res.json()
localStorage.setItem('token', token)   // сохраняем

// Защищённый запрос — используем токен
const profile = await fetch('/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})

// Логаут — чистим
localStorage.removeItem('token')
```

**Когда токен нужен, а когда нет:**

| Эндпоинт | Токен |
|----------|-------|
| GET /products (публичный каталог) | ❌ не нужен |
| GET /me (мой профиль) | ✅ нужен |
| POST /orders (создать заказ) | ✅ нужен |
| PATCH /users/1 (изменить данные) | ✅ нужен |

> `Bearer` — стандартный формат заголовка авторизации, используется почти везде.  
> В Pinia хранят токен в store, при логауте делают `store.$reset()`.

---

## Классы — геттер, сеттер, приватные поля, static

Снаружи выглядят как обычные свойства — но внутри выполняется логика.

### get / set — геттер и сеттер
```js
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }

  // геттер — вычисляет при чтении
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  // сеттер — срабатывает при записи
  set fullName(value) {
    const [first, last] = value.split(' ')
    this.firstName = first
    this.lastName = last
  }
}

const user = new User('Ivan', 'Petrov')
console.log(user.fullName)       // "Ivan Petrov"  — вызвался геттер
user.fullName = 'Oleg Sidorov'   // вызвался сеттер
console.log(user.firstName)      // "Oleg"
```

### # — приватные поля
Недоступны снаружи класса. Защищают данные от случайного изменения.

```js
class ApiClient {
  #token = null  // приватное — никто снаружи не прочитает и не изменит

  setToken(token)  { this.#token = token }
  clearToken()     { this.#token = null }

  get headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.#token && { 'Authorization': `Bearer ${this.#token}` })
    }
  }
}

const api = new ApiClient()
api.#token           // ❌ ошибка — приватное
api.setToken('abc')  // ✅
```

### static — метод на классе, не на экземпляре
```js
class ApiClient {
  static create(baseUrl) {
    return new ApiClient(baseUrl)
  }
}

const api = ApiClient.create('https://api.example.com')
// вместо: new ApiClient(...)
```

---

## Класс-обёртка ApiClient — финальная версия

Создаётся один раз, экспортируется и используется во всём приложении.

```js
// api/client.js
class ApiClient {
  #token = null

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  setToken(token) { this.#token = token }
  clearToken()    { this.#token = null }

  // геттер — читает токен каждый раз при запросе
  get headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.#token && { 'Authorization': `Bearer ${this.#token}` })
    }
  }

  async get(path) {
    const res = await fetch(this.baseUrl + path, { headers: this.headers })
    if (!res.ok) throw new Error(res.status)
    return res.json()
  }

  async post(path, body) {
    const res = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(res.status)
    return res.json()
  }

  async patch(path, body) {
    const res = await fetch(this.baseUrl + path, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(res.status)
    return res.json()
  }

  async delete(path) {
    const res = await fetch(this.baseUrl + path, {
      method: 'DELETE',
      headers: this.headers
    })
    if (!res.ok) throw new Error(res.status)
    return res.status
  }
}

export const api = new ApiClient('https://jsonplaceholder.typicode.com')
```

```js
// В Pinia store — логин:
import { api } from './api/client'

const { token } = await api.post('/login', { email, password })
api.setToken(token)

// Запросы:
const user = await api.get('/users/1')
await api.patch('/users/1', { age: 26 })
await api.delete('/users/1')

// Логаут:
api.clearToken()
```

---

## JS в браузере vs сервер — важная граница

| Что | Браузер | Сервер (Node.js) |
|-----|---------|-----------------|
| Живёт пока | открыта вкладка | всегда (процесс запущен) |
| setTimeout | ✅ но умрёт при закрытии | ✅ работает постоянно |
| Cron / scheduled tasks | ❌ невозможно | ✅ |
| localStorage | ✅ | ❌ |
| fetch | ✅ | ✅ |

> Если нужно "выполнить через N часов независимо от браузера" — это задача бэкенда.
> Браузерный JS умирает вместе с вкладкой.

---

## Swagger — что это и нужен ли он

Swagger (OpenAPI) — это **документация** к API, не сам API.

```
Бэкендер пишет сервер → Swagger генерирует интерфейс →
Ты видишь все URL, методы, параметры → Пишешь fetch к этим URL
```

Для практики без бэкенда — публичные тестовые API:
- `https://jsonplaceholder.typicode.com` — фейковый REST, идеально для учёбы
- `https://pokeapi.co` — реальные данные, без токена

---

## Что учить по порядку

| # | Тема | Зачем |
|---|------|-------|
| 1 | `async/await` | база для любой async работы |
| 2 | `fetch` + методы | сами запросы |
| 3 | `res.json()`, `res.ok`, `res.status` | читать ответ |
| 4 | `JSON.stringify` | отправить данные |
| 5 | `try/catch` | ловить ошибки |
| 6 | `headers` + токен | авторизация |
| 7 | `Promise.all` | параллельные запросы |
| 8 | классы: `get`, `set`, `#`, `static` | структура кода |
| 9 | класс-обёртка ApiClient | переиспользуемый клиент |
