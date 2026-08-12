# Internal Task & Management Dashboard

A simple and responsive task management application built for internal engineering teams. The app lets team members create, assign, track, filter, and manage tasks from a centralized dashboard.

---

## Sample User Credentials

You can test the application using any of the seeded team accounts below:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Ayush** | `ayush@company.com` | `ayush@123` | Project Manager |
| **Dinesh** | `dinesh@company.com` | `dinesh@123` | Senior Developer |
| **Bharat** | `bharat@company.com` | `bharat@123` | Frontend Engineer |

---

## Project Overview

This application was developed as a technical assessment to demonstrate full-stack development skills using **React**, **Node.js + Express**, and **PostgreSQL**.

### Key Features
- **Summary Dashboard**: Overview of total, pending, in-progress, completed, and overdue tasks.
- **Task Management**: Search, filter by status/priority/assignee, paginate, sort, and manage tasks.
- **Task Details & Activity History**: View and update task details, add comments, and track activity audit logs.
- **JWT Authentication**: User login with email/password and JSON Web Tokens.
- **External API Integration**: Fetches external team user data from JSONPlaceholder API.
- **API Documentation**: Interactive documentation page and REST endpoint summary.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (connected via `pg` pool)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_dashboard
DB_USER=postgres
DB_PASSWORD=postgresql

# JWT Secret
JWT_SECRET=supersecretkey123

# External API Integration
EXTERNAL_USERS_API=https://jsonplaceholder.typicode.com/users
```

---

## Database Setup & Schema

### 1. Database Schema (`backend/schema.sql`)

The database consists of 4 main tables: `users`, `tasks`, `comments`, and `activity_logs`.

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Developer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs Table
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. How to Run Database Migrations & Seed Data

Make sure PostgreSQL is running locally on port 5432, then run:

```bash
cd backend
npm run init-db
```

This script (`init-pg.js` & `seed.js`) automatically:
1. Connects to PostgreSQL server.
2. Creates the `task_dashboard` database if it doesn't exist.
3. Executes `schema.sql` to create all required tables.
4. Inserts seed data for initial users (Ayush, Dinesh, Bharat), initial tasks, comments, and activity logs.

---

## Setup & Running Instructions

### Step 1: Run the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Setup database & seed sample data
npm run init-db

# Start backend server
npm start
```
The backend server will start on `http://localhost:3000`.

### Step 2: Run the Frontend

```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will start on `http://localhost:5173`. 

---

## REST API Documentation

### Auth Endpoints
- `POST /api/auth/login` — Authenticate user with `{ email, password }`. Returns JWT token and user profile.
- `GET /api/auth/me` — Fetch current authenticated user profile.

### Dashboard Endpoint
- `GET /api/dashboard?userId=:id` — Get aggregated task counts (total, pending, in progress, completed, overdue, assigned to user).

### Task Endpoints
- `GET /api/tasks` — Get paginated task list. Supports query params: `search`, `status`, `priority`, `assignee`, `page`, `limit`, `sortBy`, `sortOrder`.
- `GET /api/tasks/:id` — Get single task details including comments and activity logs.
- `POST /api/tasks` — Create a new task.
- `PUT /api/tasks/:id` — Update an existing task.
- `DELETE /api/tasks/:id` — Delete a task.
- `POST /api/tasks/:id/comments` — Add a comment to a task.

### External API & Documentation Endpoints
- `GET /api/external/users` — Fetches external team user list from JSONPlaceholder API.
- `GET /api/docs` — Returns JSON schema of all API endpoints.

---

## Assumptions Made

1. **Local PostgreSQL Setup**: Assumes PostgreSQL is installed locally and running on standard port `5432` with username `postgres` and password `postgresql` (customizable via `.env`).
2. **Team Task Visibility**: Task Management view displays all team tasks to encourage cross-team collaboration, while the Dashboard includes personal task filtering.
3. **Session Token Storage**: The JWT token is saved in `localStorage` for simple session persistence during evaluation.
4. **Vite Proxying**: Frontend Vite dev server proxies `/api` requests to `http://localhost:3000` to avoid CORS issues in local development.
