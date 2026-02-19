# SkillSync – Career Gap Analysis Platform

A full-stack MERN application that helps you identify skill gaps and get personalized course recommendations for your career goals.

## Features
- 🔐 JWT-based authentication
- ⚡ Skill management with proficiency tracking
- 🎯 Career goal selection from industry roles

- 📊 Weighted gap analysis with fit score
- 🤖 Course recommendations per missing skill
- 📈 Recharts radar + bar visualizations
- 🌑 Dark glassmorphism UI with Tailwind CSS

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongodb://localhost:27017`)
- **npm** v8+

---

## Quick Start

### 1. Clone / Open the project

```bash
cd "CGL hackathon/skillsync"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` (already exists, adjust if needed):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=skillsync_super_secret_jwt_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

**Seed the database** (run once):

```bash
npm run seed
```

This creates **10 industry roles** and **21 skill recommendations** with **50+ courses**.

**Start the backend:**

```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/users/profile` | ✅ | User profile |
| PUT | `/api/users/career-goal` | ✅ | Set career goal |
| POST | `/api/users/skills` | ✅ | Add skill |
| PUT | `/api/users/skills/:id` | ✅ | Update skill |
| DELETE | `/api/users/skills/:id` | ✅ | Remove skill |
| GET | `/api/roles` | ❌ | List all roles |
| GET | `/api/roles/:id` | ❌ | Single role |
| GET | `/api/analysis/gap` | ✅ | Run gap analysis |
| GET | `/api/analysis/recommendations` | ✅ | Get course recs |
| POST | `/api/analysis/compare` | ✅ | Compare vs role |

---

## Available Career Goals (Roles)

- Full Stack Developer
- Data Scientist
- DevOps Engineer
- Machine Learning Engineer
- Frontend Developer
- Backend Developer
- Cloud Architect
- Cybersecurity Analyst
- Product Manager
- UI/UX Designer

## Folder Structure

```
skillsync/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # auth, user, role, analysis
│   ├── middleware/        # JWT auth, error handler
│   ├── models/            # User, Role, Recommendation
│   ├── routes/            # API route definitions
│   ├── seed/seedData.js   # Sample data script
│   ├── utils/             # gapAnalysis, recommendationEngine
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/           # axiosInstance, api.js
    │   ├── components/    # Navbar, GlassCard, SkillBadge, CourseCard
    │   ├── context/       # AuthContext
    │   └── pages/         # Login, Register, Dashboard, GapAnalysis, Recommendations
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```
