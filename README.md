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
## Features

### Backend — API Gateway
**GET /ping**
A health check endpoint that confirms the server is running. Returns `{ "message": "pong" }` with a 200 status. No authentication required.

**Pitt SSO Authentication**
Stubs out the Pitt SSO login flow. Hit `/auth/pitt/login` to get a mock login URL, then `/auth/pitt/callback?code=mock-auth-code` to receive a JWT token for use in authenticated requests.

**JWT Authentication Middleware**
Protects routes by validating Bearer tokens on every request. Returns 401 if the token is missing or invalid.

**Input Validation Middleware**
Validates that required fields are present in request bodies before processing. Returns 400 with a list of missing fields if validation fails.

**POST /goals**
Creates a new health goal for the authenticated user. Requires a valid JWT Bearer token and a request body with `type` and `target` fields. Returns 201 on success.

**GET /goals**
Retrieves all goals for the authenticated user. Requires a valid JWT Bearer token.

**GET /db-ping**
Verifies the backend is successfully connected to the PostgreSQL database. Returns the current server time if connected.

**Global Error Handler**
Catches any unhandled errors across the application and returns a clean 500 response instead of crashing the server.

---

### Backend — Workout & Meal Tracking
**POST /workouts**
Logs a new workout entry for the authenticated user. Connects to PostgreSQL and returns 201 on success.

**GET /workouts**
Retrieves all workout entries for the authenticated user from the database.

**POST /meals**
Logs a new meal entry for the authenticated user. Connects to PostgreSQL and returns 201 on success.

**GET /meals**
Retrieves all meal entries for the authenticated user from the database.

---

### Database
**PostgreSQL Schema**
Defines tables for Student, WorkoutEntry, MealEntry, Goal, and HealthLog. Run `node db/migrate.js` to apply the schema to your database.

**Database Connection Pool**
Manages PostgreSQL connections efficiently using a connection pool, shared across all backend services.

---

### Frontend
**Login Page**
Allows students to log in via Pitt SSO stub. Stores a JWT token in localStorage on successful login and redirects to the dashboard.

**Dashboard**
Main landing page after login. Shows an overview of the student's health tracking activity. Protected route — redirects to login if not authenticated.

**Workout Log Form**
Form for logging a new workout entry. Protected route — requires authentication to access.

**Protected Routes**
Any route that requires authentication automatically redirects unauthenticated users to the login page.

**React Router Navigation**
Client-side routing between Login, Dashboard, and Workout Log pages without full page reloads.

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
