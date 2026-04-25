# Trinity Hub — Campus Resource Platform

A full-stack web application for Trinity College students to discover, share, and review campus resources including tutoring, office hours, clubs, events, and student services.

## Tech Stack

- **Frontend**: React 18 + Vite + React Router v6
- **Backend**: Node.js + Express.js + JWT auth
- **Database**: PostgreSQL + Sequelize ORM
- **DevOps**: Docker + GitHub Actions CI/CD + Render deployment

## Project Structure

```
campus-hub/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Route logic (auth, resources, bookmarks, reviews)
│   │   ├── middleware/    # JWT auth + admin guard
│   │   ├── models/        # Sequelize models (User, Resource, Bookmark, Review)
│   │   ├── routes/        # All API routes
│   │   ├── index.js       # Express app entry point
│   │   └── seed.js        # Database seeder (15 real Trinity resources)
│   ├── tests/
│   │   └── api.test.js    # Supertest integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, ResourceCard
│   │   ├── context/       # AuthContext (JWT + user state)
│   │   ├── pages/         # Home, Resources, Detail, Auth, Submit, Bookmarks, Admin
│   │   └── utils/         # Axios instance with auth interceptor
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml         # Lint → Test → Deploy pipeline
└── docker-compose.yml
```

## Quick Start (Local Development)

### Option A — Docker Compose (recommended)

```bash
git clone https://github.com/YOUR_USERNAME/campus-hub.git
cd campus-hub
docker-compose up --build
```

Then visit http://localhost to see the app.

Seed the database with Trinity resources:
```bash
docker-compose exec backend node src/seed.js
```

### Option B — Manual Setup

**Prerequisites**: Node.js 18+, PostgreSQL 14+

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
node src/seed.js     # seed the database
npm run dev          # starts on port 5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev          # starts on port 5173
```

## Default Credentials (after seeding)

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Admin   | admin@trincoll.edu       | admin1234    |
| Student | kuany@trincoll.edu       | student1234  |

## API Reference

### Auth
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | /api/auth/register | —    | Create account     |
| POST   | /api/auth/login    | —    | Login              |
| GET    | /api/auth/me       | JWT  | Get current user   |

### Resources
| Method | Endpoint              | Auth     | Description                        |
|--------|-----------------------|----------|------------------------------------|
| GET    | /api/resources        | —        | List all (filter: category, search)|
| GET    | /api/resources/:id    | —        | Get one resource                   |
| POST   | /api/resources        | JWT      | Create resource                    |
| PUT    | /api/resources/:id    | JWT      | Update (owner or admin)            |
| DELETE | /api/resources/:id    | JWT      | Delete (owner or admin)            |

### Bookmarks
| Method | Endpoint                       | Auth | Description          |
|--------|--------------------------------|------|----------------------|
| GET    | /api/bookmarks                 | JWT  | Get saved resources  |
| GET    | /api/bookmarks/status/:id      | JWT  | Check if bookmarked  |
| POST   | /api/bookmarks/:resourceId     | JWT  | Bookmark a resource  |
| DELETE | /api/bookmarks/:resourceId     | JWT  | Remove bookmark      |

### Reviews
| Method | Endpoint               | Auth | Description              |
|--------|------------------------|------|--------------------------|
| GET    | /api/reviews/:id       | —    | Get reviews for resource |
| POST   | /api/reviews/:id       | JWT  | Add review (1 per user)  |
| DELETE | /api/reviews/:reviewId | JWT  | Delete (owner or admin)  |

### Admin
| Method | Endpoint                          | Auth  | Description         |
|--------|-----------------------------------|-------|---------------------|
| GET    | /api/admin/users                  | Admin | List all users      |
| GET    | /api/admin/stats                  | Admin | User + resource counts |
| PATCH  | /api/admin/resources/:id/approve  | Admin | Approve a resource  |

## Running Tests

```bash
cd backend
npm test
```

Tests cover: user registration, login, token auth, resource CRUD, category filtering.

## Deployment (Render)

1. Push repo to GitHub
2. Create two Render services:
   - **Web Service** for backend (set `DATABASE_URL`, `JWT_SECRET` env vars)
   - **Static Site** for frontend (build command: `npm run build`, publish dir: `dist`)
3. Add `RENDER_BACKEND_DEPLOY_HOOK` and `RENDER_FRONTEND_DEPLOY_HOOK` as GitHub secrets
4. Every push to `main` triggers the CI/CD pipeline automatically

## Features

- JWT authentication gated to Trinity College emails
- Resource directory with search, category filter, and pagination
- User-contributed resources with full CRUD
- Star ratings and text reviews (one per user per resource)
- Bookmark / save resources to personal list
- Role-based access control (student vs admin)
- Admin dashboard with user table and stats
- 15 pre-seeded real Trinity College resources
- Dockerized with multi-stage frontend build
- GitHub Actions CI/CD pipeline

## Resume Bullets

```
• Built full-stack campus resource platform serving Trinity College community,
  with JWT auth, 25+ REST API endpoints, and PostgreSQL schema across 4
  normalized tables

• Implemented role-based access control (admin/student), full-text search,
  and paginated resource directory with category filtering

• Deployed containerized Node.js + React app via Docker and GitHub Actions
  CI/CD pipeline with automated lint, test, and deploy stages on each push

• Onboarded [X] active Trinity student users contributing [N] community-
  submitted resources across tutoring, clubs, and campus events
```

---

Built by Kuany Kuany | Trinity College CPSC
