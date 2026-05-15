# 📝 Todo API

A simple REST API for managing todos, built with **Express.js**, **PostgreSQL**, and **Prisma ORM**.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma v5
- **Testing**: Thunder Client

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running

### Installation

1. Clone the repository

```bash
   git clone https://github.com/gadangKhalis/todo-api.git
   cd todo-api
```

2. Install dependencies

```bash
   npm install
```

3. Setup environment variable — create `.env` file:
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/todo_db?schema=public"

4. Run database migration

```bash
   npx prisma migrate dev
```

5. Start the server

```bash
   npm run dev
```

Server runs at `http://localhost:3000`

---

## 📡 API Endpoints

### Get All Todos

- **Method**: GET
- **URL**: `/todos`
- **Response**:

```json
[{ "id": 1, "title": "Learning Express", "done": false }]
```

### Create Todo

- **Method**: POST
- **URL**: `/todos`
- **Body.Json**: "{
  "title": "Learning Node.js"
  }"
- **Response**:

````json
{
  "id": 2,
  "title": "Learning Node.js",
  "done": false,
  "createdAt": "2026-05-09T13:45:20.025Z"
}```

### Update Todo

- **Method**: PUT
- **URL**: `/todos/:id`
- **Body (JSON)**:

```json
{
  "title": "Learning Node.js",
  "done": true
}
```
- **Response**:

```json
{
  "id": 2,
  "title": "Learning Node.js",
  "done": true,
  "createdAt": "2026-05-09T13:45:20.025Z"
}
```

### Delete Todo

- **Method**: DELETE
- **URL**: `/todos/:id`
- **Response**:

```json
{
  "message": "Todo deleted successfully"
}
```

---

## 📁 Project Structure

TODO-API/
|--src/
| |-- controllers
| | └──todo.controllers.js
| |-- routes
| | └──todo.routes.js
| |-- middlewares
| | └──errorHandler.js
|--prisma/
| |-- schema.prisma
|--node_modules/
|--generated/
|--index.js
|--.env
|--README.md

---

## 👤 Author

**gadangKhalis**
````
