# Todo App — Fullstack

A fullstack Todo application with JWT authentication, nested task support, premium system, filter & search, and due date & priority management. Built with Express + TypeScript (backend) and Next.js App Router (frontend).

🌐 **Live Demo**: [todo-app-ruby-beta-32.vercel.app](https://todo-app-ruby-beta-32.vercel.app)

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
- **Hosting**: Railway

### Frontend (`todo-nextjs`)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: CSS Modules
- **Hosting**: Vercel

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
- ✅ Todos are isolated per user — each user only sees their own todos

### Premium System

- ✅ `isPremium` field per user — feature flag for gating premium features
- ✅ `requirePremium` middleware — returns `403 Forbidden` for non-premium users
- ✅ `GET /auth/me` endpoint — returns current user's premium status
- ✅ Premium Badge UI — shows `⭐ Premium` or `Free` based on user status
- ✅ AI Suggest button — locked for non-premium users with upgrade modal
- ✅ Upgrade Modal — prompts non-premium users to upgrade

### Filter & Search

- ✅ Client-side search — filter todos by title keyword in real time
- ✅ Status filter — All / Active / Done tabs
- ✅ Combined filter + search — works simultaneously
- ✅ Recursive tree filter — parent shown if any child matches
- ✅ Empty state — shown when no results match

### Due Date & Priority

- ✅ Due date — optional deadline per todo, stored as `DateTime`
- ✅ Priority — optional `LOW / MEDIUM / HIGH` enum per todo
- ✅ Priority badge — color-coded (green / yellow / red)
- ✅ Overdue detection — red label if due date has passed and todo is not done
- ✅ Nullable fields — both due date and priority are optional

### UX & Performance

- ✅ Optimistic UI — all operations update instantly without waiting for server
- ✅ Rollback on server error — UI reverts automatically if request fails
- ✅ Toast notifications — non-blocking error/success feedback
- ✅ Loading state — items dim during pending operations
- ✅ Auto-focus — input refocuses after submit
- ✅ Double submit prevention with `isCreating` flag

---

## Deployment

| Service  | Platform | URL |
| -------- | -------- | --- |
| Frontend | Vercel   | [todo-app-ruby-beta-32.vercel.app](https://todo-app-ruby-beta-32.vercel.app) |
| Backend  | Railway  | [todo-app-production-d3fa.up.railway.app](https://todo-app-production-d3fa.up.railway.app) |
| Database | Railway PostgreSQL | — |

---

## Project Structure

```
fullstack/
├── todo-api/                           # Express + TypeScript backend
│   ├── prisma/
│   │   └── schema.prisma               # Database schema
│   └── src/
│       ├── controllers/
│       │   ├── authController.ts       # register, login, logout, getMe
│       │   └── todo.controller.ts      # CRUD todos with userId isolation
│       ├── middlewares/
│       │   ├── authMiddlewares.ts      # JWT verification
│       │   ├── premiumMiddleware.ts    # isPremium check
│       │   └── errorHandler.ts        # Global error handler
│       ├── routes/
│       │   ├── authRoutes.ts           # /auth/*
│       │   ├── todo.routes.ts          # /todos/*
│       │   └── premium.routes.ts       # /premium/*
│       └── index.ts                    # Entry point
│
└── todo-nextjs/                        # Next.js frontend
    ├── app/
    │   ├── auth/
    │   │   ├── login/page.tsx          # Login form
    │   │   └── register/page.tsx       # Register form
    │   └── todos/
    │       ├── page.tsx                # Todos page (protected)
    │       ├── hooks/
    │       │   └── useToast.ts         # Toast notification hook
    │       └── components/
    │           ├── TodoForm.tsx        # Add todo form (title, date, priority)
    │           ├── TodoItem.tsx        # Recursive todo item component
    │           ├── Toast.tsx           # Toast notification component
    │           ├── SearchBar.tsx       # Search input with clear button
    │           ├── FilterTabs.tsx      # All / Active / Done filter tabs
    │           ├── PremiumBadge.tsx    # Premium / Free status badge
    │           ├── AIButton.tsx        # AI button (locked for non-premium)
    │           └── UpgradeModal.tsx    # Upgrade to premium modal
    └── lib/
        ├── authApi.ts                  # login, register, logout, getMe
        └── todoApi.ts                  # CRUD todos API calls
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
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start frontend server:

```bash
npm run dev        # development (port 3001)
```

---

## API Reference

### Auth

| Method | Endpoint         | Description                  | Body                  | Auth |
| ------ | ---------------- | ---------------------------- | --------------------- | ---- |
| POST   | `/auth/register` | Register new user            | `{ email, password }` | —    |
| POST   | `/auth/login`    | Login, set httpOnly cookie   | `{ email, password }` | —    |
| POST   | `/auth/logout`   | Logout, clear cookie         | —                     | —    |
| GET    | `/auth/me`       | Get current user + isPremium | —                     | ✅   |

### Todos

> All endpoints require authentication (httpOnly cookie)

| Method | Endpoint     | Description                             | Body                                        |
| ------ | ------------ | --------------------------------------- | ------------------------------------------- |
| GET    | `/todos`     | Get all root todos with nested children | —                                           |
| POST   | `/todos`     | Create todo or subtask                  | `{ title, parentId?, dueDate?, priority? }` |
| PATCH  | `/todos/:id` | Update todo                             | `{ title?, done?, dueDate?, priority? }`    |
| DELETE | `/todos/:id` | Delete todo and all its children        | —                                           |

### Premium

> Requires authentication + isPremium === true

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/premium/ai-suggest` | AI suggestion (stub) |

---

## Database Schema

```prisma
enum Priority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  isPremium Boolean  @default(false)
  createdAt DateTime @default(now())
  todos     Todo[]
}

model Todo {
  id        Int       @id @default(autoincrement())
  title     String
  done      Boolean   @default(false)
  createdAt DateTime  @default(now())
  dueDate   DateTime?
  priority  Priority?

  userId    Int
  user      User  @relation(fields: [userId], references: [id])

  parentId  Int?
  parent    Todo?  @relation("TodoTree", fields: [parentId], references: [id])
  children  Todo[] @relation("TodoTree")
}
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

## Middleware Chain

```
Request
  └── authMiddleware       → verify JWT, attach req.user
        └── requirePremium → check isPremium === true
              └── controller
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

Recursive helper functions handle tree traversal:

| Function              | Purpose                               |
| --------------------- | ------------------------------------- |
| `addChildToTodo`      | Insert a new child at any depth       |
| `replaceChildInTodo`  | Replace tempId with real server ID    |
| `removeChildFromTodo` | Remove a node and all its descendants |
| `toggleInTree`        | Update a node's fields at any depth   |
| `filterTree`          | Filter tree by query and status       |

---

## Environment Variables

### `todo-api/.env`

| Variable       | Description                       |
| -------------- | --------------------------------- |
| `DATABASE_URL` | Prisma database connection string |
| `JWT_SECRET`   | Secret key for signing JWT tokens |

### `todo-nextjs/.env.local`

| Variable               | Description              |
| ---------------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL     |

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
