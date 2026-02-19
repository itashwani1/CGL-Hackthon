# SkillSync — Project Report
### CGL Hackathon 2026 | Career Intelligence Platform

> **Three-Panel Role-Based Platform** bridging the gap between student skills, industry requirements, and institutional insights.

**Panels:** 🎓 Student | 🏢 Company / HR | 🏫 Institute

---

## Section 1 — Methodology

SkillSync follows an **Agile, Problem-First development methodology** — starting with real-world pain points of students, HR teams, and institutes, then designing modular, iterative solutions around them.

---

### 🏗️ System Architecture

| Layer | Technology |
|---|---|
| **Frontend** | React.js + Vite, Tailwind CSS, Glassmorphism UI |
| **Backend** | Node.js + Express (REST API, MVC Pattern) |
| **Database** | MongoDB Atlas (Cloud), Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) + bcrypt password hashing |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

The platform uses a **three-tier MVC architecture**: React handles the View layer, Express Controllers manage business logic, and MongoDB stores User / Job / Analytics data. All communication goes through secured REST endpoints with Bearer token authentication.

---

### 📋 Development Phases

**Phase 1 — Research & Requirements Analysis**
Identified three core user personas: Students seeking career guidance, HR managers looking to find skilled talent, and Institutes wanting to track student progress and connect with industry. Mapped their pain points into platform features.

**Phase 2 — Database Design & Backend Development**
Designed rich MongoDB schemas: *User* (with role-based fields), *CompanyJob* (required skills + proficiency thresholds), *Role* (industry career paths), and *Recommendation*. Built RESTful APIs with role-guarded middleware for Company and Institute routes.

**Phase 3 — Gap Analysis Engine**
Core algorithm: compares a student's self-reported skill proficiency (1–10 scale) against the requirements of their declared career goal or a company's posted job. Outputs quantified gaps, match percentages, and prioritized recommendations for each shortfall.

**Phase 4 — Recommendation Engine**
Maps identified skill gaps to curated course recommendations filtered by category, difficulty, and free/paid availability. Recommendations are sorted by relevance score based on the size of the gap and the target role's importance weightings.

**Phase 5 — Three-Panel Role System**
Implemented Role-Based Access Control (RBAC) at both the API level (middleware guards) and frontend level (route guards + dynamic Navbar). Students, Companies, and Institutes each get isolated, purpose-built dashboards with no cross-contamination of data or UI.

**Phase 6 — UI/UX Design & Polish**
Adopted a modern dark-theme glassmorphism design system using Tailwind CSS. Implemented smooth CSS animations, role-colored accents per portal, scroll-reactive navbar, and responsive mobile layout.

---

### 🔐 Security Methodology

- **JWT Authentication** — Stateless tokens, signed with a secret key, with configurable expiry
- **Role Middleware** — Server-side role enforcement; company/institute endpoints reject unauthorized roles with HTTP 403
- **Password Hashing** — bcrypt with salted rounds; plaintext passwords are never stored
- **Input Validation** — Schema-level validation on all incoming data via Mongoose constraints
- **CORS Policy** — Restricted to the known frontend origin only

---

### 🧠 Skill Matching Algorithm

For each company job posting:
1. Retrieve all students with `role = 'student'` from the database
2. For each required skill in the job, check if the student has that skill and if their proficiency ≥ `minProficiency`
3. Calculate **Match Score = (skills met / total required skills) × 100%**
4. Return ranked list, sorted descending by match score (filtering out 0% matches)

This runs server-side, making it scalable and real-time with no external ML dependency.

---

## Section 2 — Feasibility & Viability

---

### ✅ Technical Feasibility

| Component | Technology | Status |
|---|---|---|
| Frontend Framework | React + Vite | ✅ Proven in production at scale |
| Styling | Tailwind CSS | ✅ Industry standard, zero runtime cost |
| Backend Runtime | Node.js + Express | ✅ Powers millions of APIs worldwide |
| Database | MongoDB Atlas | ✅ Cloud-hosted, 512MB free, scales to TB |
| Authentication | JWT + bcrypt | ✅ Battle-tested security standards |
| Deployment | Vercel + Render | ✅ Free tiers available, auto-deploy via GitHub |
| Charts / Analytics | Recharts | ✅ React-native, lightweight, responsive |

> **Zero External API Dependency:** SkillSync does not depend on any paid third-party AI/ML APIs for its core features. The gap analysis and matching logic is custom-built — meaning **no per-request costs** and no vendor lock-in.

---

### 💰 Financial Feasibility — Cost Analysis

| Resource | Provider | Cost (MVP Phase) |
|---|---|---|
| Frontend Hosting | Vercel | ₹0 / Free Tier |
| Backend Hosting | Render | ₹0 / Free Tier |
| Database | MongoDB Atlas | ₹0 / 512MB Free |
| Domain Name | Namecheap / GoDaddy | ~₹800 / year |
| SSL Certificate | Let's Encrypt | ₹0 / Free |
| **Total MVP Cost** | | **~₹800/year** |

**At Scale (10,000+ users):**
- MongoDB Atlas M10: ~₹5,500/month
- Render Starter: ~₹800/month
- Vercel Pro: ~₹1,650/month
- **Total: ~₹8,000/month** — highly economical for a 10K+ user platform

---

### ⏱️ Operational Feasibility

- MongoDB Atlas handles automated backups, scaling, and failover
- Vercel and Render support CI/CD — code pushed to GitHub deploys automatically
- JWT is stateless — no session store or Redis needed at MVP scale
- Three-panel architecture allows independent scaling per user group

---

### 📊 Market Viability

| Metric | Data |
|---|---|
| Students in Indian Higher Education | 93 Million+ (2024) |
| Engineering graduates reported "unemployable" | ~45% |
| India EdTech Market Size | ₹28,000 Crore (2025 estimate) |
| HR managers struggling to find skilled candidates | ~65% |

---

### 🏆 Competitive Advantage

| Feature | SkillSync | LinkedIn | Coursera / NPTEL |
|---|---|---|---|
| Gap Analysis for Students | ✅ Yes | ❌ No | ❌ No |
| Company Job Skill Matching | ✅ Yes | ⚠️ Partial | ❌ No |
| Institute Analytics Panel | ✅ Yes | ❌ No | ❌ No |
| Three-Role Unified Platform | ✅ Yes | ❌ Separate | ❌ No |
| Proficiency-Level Matching (1–10) | ✅ Yes | ❌ No | ❌ No |
| Free to Use | ✅ Yes | ⚠️ Freemium | ⚠️ Freemium |

---

### 🚀 Revenue Model (Long-Term Viability)

| Stream | Description |
|---|---|
| **Premium Institutes** | Bulk seat licenses — advanced analytics, custom branding, placement tracking |
| **Company Subscriptions** | Paid tiers — unlimited job postings, priority talent matching, bulk export |
| **Course Affiliates** | Commission on course enrollments recommended through the platform |

---

## Section 3 — Impact & Benefits

---

### 🎓 Impact on Students

- **Career Clarity** — Students define a target career goal and instantly see which skills they lack, eliminating guesswork
- **Personalized Learning Path** — Recommendation engine provides course suggestions tied specifically to individual gaps, not generic lists
- **Self-Assessment Tool** — The 1–10 proficiency scale encourages honest self-evaluation and tracks improvement over time
- **Job Match Visibility** — Students whose skills match company postings can be discovered by HR without needing a polished resume
- **Reduces Anxiety** — Knowing exactly what to work on replaces the overwhelming uncertainty of "am I job-ready?" with a measurable, actionable answer

---

### 🏢 Impact on Companies / HR

- **Precision Hiring** — HR posts required skills with minimum proficiency thresholds and instantly gets a ranked list of matching students
- **Reduced Time-to-Hire** — Automated skill-match algorithm eliminates weeks of manual CV screening
- **Quality Signal** — Proficiency scores (1–10) are more granular and honest than binary skill checkboxes on resumes
- **Talent Pipeline** — Companies can see future-ready candidates even before they graduate, enabling early outreach
- **Cost Efficiency** — Reduces dependency on expensive recruitment agencies for entry-to-mid level technical roles
- **Structured Requirements** — Forces companies to define skills clearly, leading to better job descriptions

---

### 🏫 Impact on Institutes / Colleges

- **Data-Driven Curriculum Planning** — Analytics reveal which skills students are developing vs. lacking; faculty can adjust syllabus accordingly
- **Placement Enhancement** — Integrated job board shows real company requirements, letting placement cells prepare students for actual market demands
- **Student Outcome Tracking** — Monitor career goal distribution and track whether students are progressing toward their stated goals
- **Institutional Credibility** — Colleges that demonstrate measurable skill development and placement rates attract better faculty and students
- **Industry-Academia Bridge** — Real-time visibility into company job postings allows institutes to align training with market needs

---

### 🌏 Broader Societal Impact

India produces ~1.5 million engineering graduates annually, yet a significant portion faces unemployment due to misalignment between academic learning and industry requirements. SkillSync directly attacks this structural problem by making the gap **visible, measurable, and actionable** — for students, educators, and employers simultaneously.

- **Reduces Unemployment** — Better skill-job matching reduces frictional unemployment for fresh graduates
- **Improves Productivity** — Companies that hire for specific skills (not just degrees) get employees who contribute faster
- **Democratizes Guidance** — Students from Tier-2/3 cities get the same career intelligence as those at premium institutions
- **Encourages Lifelong Learning** — The recommendation engine promotes continuous upskilling, not just one-time placement
- **Aligns Education with Economy** — Real-time industry data flowing into institute dashboards creates a feedback loop

---

### 📊 Expected Outcomes (12-Month Projection)

| Stakeholder | Expected Outcome |
|---|---|
| Students | 30% faster skill gap closure through targeted learning paths |
| Companies | 50% reduction in time-to-shortlist for technical roles |
| Institutes | 20% improvement in placement rates through data-driven preparation |

---

### 🔮 Future Roadmap

| Feature | Description |
|---|---|
| **AI Resume Builder** | Auto-generate resumes from skill profiles, targeted at specific job postings |
| **Mock Interview Module** | Role-specific practice questions based on required skills |
| **National Skill Heatmap** | Aggregate anonymized data to show supply/demand of skills across regions |
| **Mentor Connect** | Match students with industry mentors based on aligned career goals |
| **Government Integration** | Potential alignment with NSDC frameworks |
| **Mobile App (PWA)** | Progressive Web App for offline skill tracking |

---

### 💡 The SkillSync Flywheel

```
Students track skills
        ↓
Companies post real requirements
        ↓
Institutes see the gaps
        ↓
Institutes improve training
        ↓
Students improve skills
        ↓
Companies find better matches
        ↓
       🔁 Everyone wins
```

This self-reinforcing cycle is what makes SkillSync a **platform**, not just a tool.

---

*SkillSync — CGL Hackathon 2026 | Career Intelligence Platform*
*Built with React + Node.js + MongoDB | Three-Panel Role System*
