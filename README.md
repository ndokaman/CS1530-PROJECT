# CS1530 - Rec Center Health Tracker

A full-stack web application that helps University of Pittsburgh students track their workouts, meals, and health goals. Students log in via Pitt SSO and can record fitness activity, meals, and set personal health goals.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | Pitt SSO (OAuth 2.0) + JWT |
| Deployment | Render (backend + DB) + Vercel (frontend) |
| Version Control | GitHub |

---

## Project Structure

```
CS1530-PROJECT/
├── frontend/
│   ├── src/
│   │   ├── pages/        (Login, Dashboard, WorkoutLog)
│   │   ├── components/   (Layout, ProtectedRoute)
│   │   ├── lib/          (auth helpers)
│   │   └── App.jsx
│   └── vite.config.js
├── backend/
│   ├── gateway/          (SS2 - API Gateway)
│   ├── auth/             (SS3 - Auth Service)
│   ├── workouts/         (SS4 - Workout CRUD)
│   ├── meals/            (SS4 - Meal CRUD)
│   ├── db/               (SS5 - DB connection pool)
│   └── package.json
├── db/
│   ├── schema.sql        (PostgreSQL schema)
│   └── migrate.js        (migration script)
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js installed
- PostgreSQL database (or Render account)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/ndokaman/CS1530-PROJECT.git
cd CS1530-PROJECT
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```
PORT=3000
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=1h
DATABASE_URL=your-postgresql-connection-string
```
### 3. Run database migrations
```bash
cd db
npm install
node migrate.js
```

### 4. Set up the frontend
```bash
cd frontend
npm install
```

---

## Running the Application

### Start the backend
```bash
cd backend
node gateway/index.js
```
Server runs on `http://localhost:3000`

### Start the frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /ping | Health check | No |
| GET | /auth/pitt/login | Pitt SSO login stub | No |
| GET | /auth/pitt/callback | SSO callback + JWT issuance | No |
| GET | /workouts | Get workouts | Yes |
| POST | /workouts | Log a workout | Yes |
| GET | /meals | Get meals | Yes |
| POST | /meals | Log a meal | Yes |
| GET | /goals | Get goals | Yes |
| POST | /goals | Create a goal | Yes |
| GET | /db-ping | Database connection check | No |

---

## Team Members & Contributions

| Name | Role | Contributions |
|------|------|--------------|
| Henry Ndoka | Scrum Master | Set up GitHub repo, folder structure, branch protection |
| Daniel A. Richard | Product Owner | PostgreSQL schema, migration scripts, /db-ping endpoint |
| Tanishq Bansod | Developer | Auth service skeleton, Pitt SSO stub, JWT middleware |
| Srivats Pulumati | Developer | API Gateway scaffold, input validation middleware, POST /goals, error handler |
| Aarav S. Kakade | Developer | Workout and meal CRUD endpoints, unit tests, PostgreSQL integration |
| Ajay Adhithiya Ohm Nathan | Developer | React + Vite + Tailwind setup, Login page, Dashboard, Workout Log form |
