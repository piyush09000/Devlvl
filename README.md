# Devlvl 🚀
**The Ultimate Gamified Coding Platform**

Devlvl is an enterprise-grade learning ecosystem where learning programming feels like playing an RPG game. It combines coding challenges, skill trees, daily quests, boss battles, leaderboards, and "Roast Mode" notifications to create a highly addictive developer experience.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, TailwindCSS v4, Framer Motion, Zustand
- **Backend**: Python (Flask), SQLAlchemy, Celery, Redis, PostgreSQL (Neon Serverless)
- **Code Execution**: Judge0 API

---

## How to Run the Project Locally

This guide walks you through starting the entire Devlvl platform locally, including background workers and databases.

### Prerequisites
Make sure you have these installed:
- Python 3.10+
- Node.js 18+
- Docker Desktop

---

### One-Time Setup

1. **Clone and enter the project**
```powershell
cd d:\devlvl
```

2. **Install backend dependencies**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pip install flask-socketio eventlet
```

3. **Install frontend dependencies**
```powershell
cd ..\frontend
npm install
```

4. **Configure environment variables**
Create a file at `d:\devlvl\backend\.env` with:
```env
DATABASE_URL=your_neon_postgres_connection_string
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
JWT_SECRET_KEY=your_super_secret_key
```

5. **Seed the database (first time only)**
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
python create_tables.py    # Creates all DB tables
python seed.py             # Seeds core data (users, worlds, items)
python seed_lms.py         # Seeds LMS content (courses, problems, quizzes)
```

---

### Running the Platform

Open **4 separate terminal windows** and run one command in each.

**Terminal 1 — Redis (Docker)**
```powershell
cd d:\devlvl
docker-compose up -d redis
```
> Redis stays running in the background. You only need to do this once per system restart.

**Terminal 2 — Flask Backend (API + WebSockets)**
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
python wsgi.py
```
> Backend runs at: **http://localhost:5000**

**Terminal 3 — Celery Worker (Background Jobs)**
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
celery -A app.extensions.celery worker --loglevel=info
```
> Handles background tasks: XP awards, quest completion, notifications.

**Terminal 4 — Celery Beat (Scheduled Tasks)**
```powershell
cd d:\devlvl\backend
.\venv\Scripts\activate
celery -A app.extensions.celery beat --loglevel=info
```
> Handles timed jobs: daily quest rotation, streak reminders.

**Terminal 5 — Vite Frontend**
```powershell
cd d:\devlvl\frontend
npm run dev
```
> Frontend runs at: **http://localhost:5173**

---

### Quick Start (Minimal — No background jobs)
If you just want the UI working fast without Celery:

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
| **CMS (Admin)** | `/api/cms` |
| **Learning / RPG Map** | `/api/learning` |

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

## Note on Architecture
Devlvl is designed to handle scale. Leaderboards and Matchmaking are backed by **Redis** for real-time performance. Recurring background tasks (like assigning daily quests or calculating streaks) are handled by **Celery** workers. The LMS schema is fully data-driven, allowing Admins to spin up thousands of paths, courses, problems, and bosses via the `/api/cms` endpoints dynamically.
