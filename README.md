# Todo App — Fullstack 

A fullstack Todo application with JWT authentication, built with Express + TypeScript (backend) and Next.js App Router (frontend).

---

## Tech Stack

### Backend (`todo-api`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma v5
- **Database**: PostgreSQL / SQLite
- **Auth**: JWT + bcrypt
- **Cookie**: cookie-parser (httpOnly cookie)

### Frontend (`todo-nextjs`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: CSS Modules

---

## Features

- ✅ User registration with hashed password (bcrypt)
- ✅ User login with JWT stored in httpOnly cookie
- ✅ Protected routes — unauthenticated users redirected to login
- ✅ Full CRUD for todos (Create, Read, Update, Delete)
- ✅ Toggle todo done/undone
- ✅ Logout clears cookie and redirects to login

---

## Project Structure

```
fullstack/
├── todo-api/                  # Express + TypeScript backend
│   ├── prisma/
│   │   └── schema.prisma      # Database schema (User, Todo)
│   └── src/
│       ├── controllers/
│       │   ├── authController.ts   # register, login, logout
│       │   └── todo.controller.ts  # CRUD todos
│       ├── middlewares/
│       │   ├── authMiddleware.ts   # JWT verification
│       │   └── errorHandler.ts    # Global error handler
│       ├── routes/
│       │   ├── authRoutes.ts       # /auth/*
│       │   └── todo.routes.ts      # /todos/*
│       └── index.ts               # Entry point
│
└── todo-nextjs/               # Next.js frontend
    ├── app/
    │   ├── auth/
    │   │   ├── login/
    │   │   │   └── page.tsx        # Login form
    │   │   └── register/
    │   │       └── page.tsx        # Register form
    │   └── todos/
    │       ├── page.tsx            # Todos page (protected)
    │       └── components/
    │           ├── TodoForm.tsx    # Add todo form
    │           └── TodoItem.tsx    # Single todo item
    └── lib/
        ├── authApi.ts              # login, register, logout API calls
        └── todoApi.ts              # CRUD todos API calls
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm
- PostgreSQL or SQLite database

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

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | `{ email, password }` |
| POST | `/auth/login` | Login, set httpOnly cookie | `{ email, password }` |
| POST | `/auth/logout` | Logout, clear cookie | — |

### Todos
> All endpoints require authentication (httpOnly cookie)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/todos` | Get all todos | — |
| POST | `/todos` | Create new todo | `{ title }` |
| PATCH | `/todos/:id` | Update todo | `{ title?, done? }` |
| DELETE | `/todos/:id` | Delete todo | — |

---

## Auth Flow

```
Register → bcrypt.hash(password) → save to DB
Login    → bcrypt.compare → jwt.sign → set httpOnly cookie
Request  → cookie sent automatically → authMiddleware → jwt.verify
Logout   → clearCookie → redirect to login
```

---

## Environment Variables

### `todo-api/.env`

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma database connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## Scripts

### Backend (`todo-api`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon --exec ts-node src/index.ts` | Development with auto-reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js` | Run production build |

### Frontend (`todo-nextjs`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev --port 3001` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Run production build |
