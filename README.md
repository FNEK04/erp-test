# ERP.AERO Test Task (Node.js, MySQL-ready)

## Запуск

### Вариант 1: SQLite (по умолчанию, если MySQL не установлен)
1. Установите зависимости:
   ```
   npm install
   ```
2. Запустите сервер:
   ```
   node app.js
   ```

### Вариант 2: MySQL (как требует ТЗ)
1. Установите MySQL и создайте базу данных (например, `erp`).
2. Установите зависимости:
   ```
   npm install mysql2
   ```
3. Создайте файл `.env` в корне проекта и укажите параметры:
   ```
   USE_SQLITE=0
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=yourpassword
   MYSQL_DB=erp
   ```
4. Запустите сервер:
   ```
   node app.js
   ```

## Переменные окружения
- `USE_SQLITE=1` — использовать SQLite (по умолчанию, если переменной нет)
- `USE_SQLITE=0` — использовать MySQL (нужны остальные параметры)
- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB` — параметры MySQL

## API

- **POST /signup** — регистрация пользователя `{ id, password }`
- **POST /signin** — вход, получение access/refresh токенов `{ id, password }`
- **POST /signin/new_token** — обновление access/refresh токена `{ refreshToken }`
- **GET /info** — информация о пользователе (требует accessToken)
- **GET /logout** — выход (accessToken в header, refreshToken в body)

### Работа с файлами (все требуют accessToken):
- **POST /file/upload** — загрузка файла (form-data, поле `file`)
- **GET /file/list** — список файлов (параметры: `list_size`, `page`)
- **GET /file/:id** — информация о файле
- **GET /file/download/:id** — скачать файл
- **DELETE /file/delete/:id** — удалить файл
- **PUT /file/update/:id** — заменить файл (form-data, поле `file`)

## Замечания
- Для смены БД на MySQL — поменяйте настройки в `config.js` и установите пакет `mysql2`.
- CORS открыт для всех доменов.
- Все токены блокируются при logout только на текущем устройстве.
- Для теста используйте Postman или аналогичные инструменты. 