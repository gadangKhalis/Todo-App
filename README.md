# Todo App — Fullstack

A fullstack Todo application with JWT authentication and nested task support, built with Express + TypeScript (backend) and Next.js App Router (frontend).

---

## Tech Stack

### Backend (`todo-api`)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma v5
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Cookie**: cookie-parser (httpOnly cookie)

### Frontend (`todo-nextjs`)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: CSS Modules

---

## Features

### Authentication

- ✅ User registration with hashed password (bcrypt)
- ✅ User login with JWT stored in httpOnly cookie
- ✅ Protected routes — unauthenticated users redirected to login
- ✅ Logout clears cookie and redirects to login

### Todo Management

- ✅ Full CRUD for todos (Create, Read, Update, Delete)
- ✅ Toggle todo done/undone
- ✅ Nested tasks — up to 3 levels deep (todo → subtask → sub-subtask)
- ✅ Collapse/expand children per todo item
- ✅ Subtask count badge on each parent todo

### UX & Performance

- ✅ Optimistic UI — all operations update instantly without waiting for server
- ✅ Rollback on server error — UI reverts automatically if request fails
- ✅ Toast notifications — non-blocking error/success feedback
- ✅ Loading state — items dim during pending operations
- ✅ Auto-focus — input refocuses after submit
- ✅ Double submit prevention with `isCreating` flag

---

## Project Structure

```
fullstack/
├── todo-api/                        # Express + TypeScript backend
│   ├── prisma/
│   │   └── schema.prisma            # Database schema (User, Todo with self-relation)
│   └── src/
│       ├── controllers/
│       │   ├── authController.ts    # register, login, logout
│       │   └── todo.controller.ts   # CRUD todos with nested support
│       ├── middlewares/
│       │   ├── authMiddleware.ts    # JWT verification
│       │   └── errorHandler.ts     # Global error handler
│       ├── routes/
│       │   ├── authRoutes.ts        # /auth/*
│       │   └── todo.routes.ts       # /todos/*
│       └── index.ts                 # Entry point
│
└── todo-nextjs/                     # Next.js frontend
    ├── app/
    │   ├── auth/
    │   │   ├── login/
    │   │   │   └── page.tsx         # Login form
    │   │   └── register/
    │   │       └── page.tsx         # Register form
    │   └── todos/
    │       ├── page.tsx             # Todos page (protected)
    │       ├── hooks/
    │       │   └── useToast.ts      # Toast notification hook
    │       └── components/
    │           ├── TodoForm.tsx     # Add todo form
    │           ├── TodoItem.tsx     # Recursive todo item component
    │           └── Toast.tsx        # Toast notification component
    └── lib/
        ├── authApi.ts               # login, register, logout API calls
        └── todoApi.ts               # CRUD todos API calls
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/gadangKhalis/Todo-App.git
cd Todo-App
```

### 2. Setup Backend

```bash
cd todo-api
npm install
```

Create `.env` file:

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
```

Run database migration:

```bash
npx prisma migrate dev
```

Start backend server:

```bash
npm run dev        # development (port 3000)
npm run build      # compile TypeScript
npm start          # production
```

### 3. Setup Frontend

```bash
cd todo-nextjs
npm install
npm run dev        # development (port 3001)
```

---

## API Reference

### Auth

| Method | Endpoint         | Description                | Body                  |
| ------ | ---------------- | -------------------------- | --------------------- |
| POST   | `/auth/register` | Register new user          | `{ email, password }` |
| POST   | `/auth/login`    | Login, set httpOnly cookie | `{ email, password }` |
| POST   | `/auth/logout`   | Logout, clear cookie       | —                     |

### Todos

> All endpoints require authentication (httpOnly cookie)

| Method | Endpoint     | Description                             | Body                   |
| ------ | ------------ | --------------------------------------- | ---------------------- |
| GET    | `/todos`     | Get all root todos with nested children | —                      |
| POST   | `/todos`     | Create todo or subtask                  | `{ title, parentId? }` |
| PATCH  | `/todos/:id` | Update todo                             | `{ title?, done? }`    |
| DELETE | `/todos/:id` | Delete todo and all its children        | —                      |

### Nested Tasks

Todos support up to **3 levels of nesting**:

```
Level 1 (root)     parentId: null
Level 2 (subtask)  parentId: <level 1 id>
Level 3 (sub-sub)  parentId: <level 2 id>
```

`GET /todos` returns a nested tree structure:

```json
[
  {
    "id": 1,
    "title": "Build Website",
    "done": false,
    "parentId": null,
    "children": [
      {
        "id": 2,
        "title": "Design UI",
        "done": false,
        "parentId": 1,
        "children": [
          {
            "id": 3,
            "title": "Create Wireframe",
            "done": false,
            "parentId": 2,
            "children": []
          }
        ]
      }
    ]
  }
]
```

---

## Auth Flow

```
Register → bcrypt.hash(password) → save to DB
Login    → bcrypt.compare → jwt.sign → set httpOnly cookie
Request  → cookie sent automatically → authMiddleware → jwt.verify
Logout   → clearCookie → redirect to login
```

---

## Optimistic UI Pattern

All CRUD operations follow this pattern:

```
1. Save snapshot (previousState)
2. Update UI immediately (optimistic)
3. Send request to server
   ✅ Success → sync with real server data
   ❌ Failure → rollback to snapshot + show toast
```

For nested state, three recursive helper functions handle tree traversal:

| Function              | Purpose                               |
| --------------------- | ------------------------------------- |
| `addChildToTodo`      | Insert a new child at any depth       |
| `replaceChildInTodo`  | Replace tempId with real server ID    |
| `removeChildFromTodo` | Remove a node and all its descendants |
| `toggleInTree`        | Update a node's fields at any depth   |

---

## Database Schema

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())

  parentId  Int?
  parent    Todo?  @relation("TodoTree", fields: [parentId], references: [id])
  children  Todo[] @relation("TodoTree")
}
```

---

## Environment Variables

### `todo-api/.env`

| Variable       | Description                       |
| -------------- | --------------------------------- |
| `DATABASE_URL` | Prisma database connection string |
| `JWT_SECRET`   | Secret key for signing JWT tokens |

---

## Scripts

### Backend (`todo-api`)

| Script  | Command                               | Description                   |
| ------- | ------------------------------------- | ----------------------------- |
| `dev`   | `nodemon --exec ts-node src/index.ts` | Development with auto-reload  |
| `build` | `tsc`                                 | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js`                  | Run production build          |

### Frontend (`todo-nextjs`)

| Script  | Command                | Description          |
| ------- | ---------------------- | -------------------- |
| `dev`   | `next dev --port 3001` | Development server   |
| `build` | `next build`           | Production build     |
| `start` | `next start`           | Run production build |
