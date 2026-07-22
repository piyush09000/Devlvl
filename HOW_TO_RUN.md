# Devlvl — How to Run

A complete guide to starting the entire Devlvl platform locally.

---

## Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| Docker Desktop | Latest | https://docker.com |

---

## One-Time Setup

### 1. Clone and enter the project
```powershell
cd d:\devlvl
```

### 2. Install backend dependencies
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pip install flask-socketio eventlet
```

### 3. Install frontend dependencies
```powershell
cd ..\frontend
npm install
```

### 4. Configure environment variables
Create a file at `d:\devlvl\backend\.env` with:
```env
DATABASE_URL=your_neon_postgres_connection_string
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
JWT_SECRET_KEY=your_super_secret_key
```

### 5. Seed the database (first time only)
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
python create_tables.py    # Creates all DB tables
python seed.py             # Seeds core data (users, worlds, items)
python seed_lms.py         # Seeds LMS content (courses, problems, quizzes)
```

---

## Running the Platform

Open **4 separate terminal windows** and run one command in each.

### Terminal 1 — Redis (Docker)
```powershell
cd d:\devlvl
docker-compose up -d redis
```
> Redis stays running in the background. You only need to do this once per system restart.

---

### Terminal 2 — Flask Backend (API + WebSockets)
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
python wsgi.py
```
Backend runs at: **http://localhost:5000**

Health check: http://localhost:5000/health

---

### Terminal 3 — Celery Worker (Background Jobs)
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
celery -A app.extensions.celery worker --loglevel=info
```
> Handles background tasks: XP awards, quest completion, notifications.

---

### Terminal 4 — Celery Beat (Scheduled Tasks)
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
celery -A app.extensions.celery beat --loglevel=info
```
> Handles timed jobs: daily quest rotation, streak reminders.

---

### Terminal 5 — Vite Frontend
```powershell
cd d:\devlvl\frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## Quick Start (Minimal — No background jobs)

If you just want the UI working fast:

```powershell
# Terminal 1 - Redis
cd d:\devlvl && docker-compose up -d redis

# Terminal 2 - Backend
cd d:\devlvl\backend && .\venv\Scripts\activate && python wsgi.py

# Terminal 3 - Frontend
cd d:\devlvl\frontend && npm run dev
```

Open **http://localhost:5173**

---

## API Reference

| Area | Base URL |
|---|---|
| Auth | `/api/auth` |
| Problems | `/api/problems` |
| Submissions | `/api/submissions` |
| Leaderboard | `/api/leaderboard` |
| Quests | `/api/quests` |
| Marketplace | `/api/marketplace` |
| Analytics | `/api/analytics` |
| AI Mentor | `/api/ai` |
| CMS (Admin) | `/api/cms` |
| Learning / RPG Map | `/api/learning` |

---

## CMS API Examples (Admin)

**Create a Course:**
```bash
POST /api/cms/courses
Authorization: Bearer <admin_token>
Body: { "learning_path_id": 1, "slug": "my-course", "title": "My Course", "difficulty": "Beginner" }
```

**Publish a Lesson:**
```bash
POST /api/cms/lessons/42/publish
Authorization: Bearer <admin_token>
```

**Bulk Import Problems:**
```bash
POST /api/cms/problems/bulk-import
Authorization: Bearer <admin_token>
Body: [ {"title": "Two Sum", "difficulty": "Easy", "slug": "two-sum", "description": "..."} ]
```

**Submit a Quiz:**
```bash
POST /api/cms/quizzes/1/submit
Authorization: Bearer <user_token>
Body: { "1": "B", "2": "T" }
```

**Attack a Boss:**
```bash
POST /api/cms/bosses/1/attack
Authorization: Bearer <user_token>
Body: { "problem_id": 5, "is_correct": true }
```

---

## Database Scripts

| Script | Purpose |
|---|---|
| `python create_tables.py` | Create all new tables safely (won't touch existing ones) |
| `python seed.py` | Seed core data: users, worlds, store items |
| `python seed_lms.py` | Seed LMS: 10 paths, 50 courses, 117 problems, 20 quizzes, 10 bosses |
| `python alter_problems.py` | Add new columns to the existing `problems` table |
| `python migrate.py upgrade` | Run pending Alembic DB migrations |
| `python migrate.py migrate "msg"` | Generate a new Alembic migration |

---

## Architecture Overview

```
d:\devlvl\
  frontend/           React + Vite (port 5173)
    src/pages/        All UI pages

  backend/            Flask + SQLAlchemy (port 5000)
    wsgi.py           App entry point (Eventlet + SocketIO)
    seed.py           Core seeder
    seed_lms.py       LMS content seeder
    create_tables.py  Safe table creator
    alter_problems.py Column migration helper

    app/
      models/
        lms.py          Academy, Course, Lesson
        assessments.py  Quiz, Boss, Certificate
        rpg.py          World, Region, Village
        problem.py      Full problem library model

      api/
        cms/            Admin CMS endpoints
        auth/           Login, register
        submissions/    Judge0 code execution
        marketplace/    Store + purchases
        analytics/      Live analytics
        ai/             AI Mentor endpoint

      sockets/          WebSocket events (PvP, notifications)
      tasks/            Celery background tasks
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `AttributeError: module 'app' has no attribute 'register_blueprint'` | Import shadowing. Change `import app.x` to `from app import x` inside `create_app()`. |
| `EventletDeprecationWarning` | Safe to ignore — warning only, not an error. |
| `psycopg2.errors.UndefinedColumn` | Run `python alter_problems.py` to add new columns to DB. |
| `psycopg2.errors.DuplicateTable` | Use `python create_tables.py` instead of Alembic — it skips existing tables. |
| Celery can't find tasks | Activate the venv before starting Celery. |
| Frontend 404 on `/api/*` | Check that Vite proxy in `vite.config.ts` points to `http://localhost:5000`. |
| `UnicodeEncodeError` on emoji in print | Windows terminal encoding issue. Replace emojis in print() with ASCII text. |
