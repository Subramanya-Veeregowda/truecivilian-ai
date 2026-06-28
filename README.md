# 🛡️ TrueCivilian AI — Enterprise Production Release v1.0.0

TrueCivilian AI is a production-ready, full-stack, civic engagement platform designed to empower citizens to report issues (potholes, water leaks, traffic anomalies), obtain instant multi-modal AI classification via Google Gemini, verify issues through a consensus engine, and collaborate with authorities to resolve them.

---

## 🏗️ System Architecture & Framework Alignments

TrueCivilian AI utilizes a split decoupling design tailored for cloud-scale availability, extreme performance, and hardened security:

```
+-------------------------------------------------------------+
|                     Client Tier (React)                     |
|  - SPA routing with lazy layouts & performance splitting    |
|  - Google Maps & Geolocation API (Pins & Hotspots clustering)|
|  - Real-time notification socket/polling listeners          |
+------------------------------+------------------------------+
                               | HTTPS / REST
                               v
+-------------------------------------------------------------+
|              API Gateway & Security Filter Chain            |
|  - Spring Security State Filter Chain (Stateless JWT Verify) |
|  - CORS Policy Engine (Configurable domains & protocols)    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|            Application Tier (Spring Boot / Java 21)         |
|  - Domain Controllers: Issue Reporting, Gamification, Admin  |
|  - Services: Google Gemini AI Analyzer, Cloudinary Upload   |
+------------------------------+------------------------------+
                               | JPA / HikariCP
                               v
+-------------------------------------------------------------+
|                    Persistence Tier (PostgreSQL)            |
|  - Relational Schema with optimized composite indexes       |
|  - Strict Referential Integrity constraints                 |
+-------------------------------------------------------------+
```

---

## 💾 Relational Database Schema (Textual ERD)

Below is the database relationship structure defined using professional Crow's Foot Entity Notation:

```
+------------------+          +------------------+          +------------------+
|      USERS       |          |      ISSUES      |          |     COMMENTS     |
+------------------+          +------------------+          +------------------+
| PK  id (UUID)    |<----+    | PK  id (UUID)    |<----+    | PK  id (UUID)    |
|     email (UK)   |     |    | FK  reporter_id  |     |    | FK  issue_id     |
|     password     |     +---|O- category        |     +---|O- author_id      |
|     role (ENUM)  |          |     latitude     |          |     content      |
|     xp_points    |          |     longitude    |          |     created_at   |
|     badge_status |          |     media_url    |          +------------------+
+------------------+          |     status (ENUM)|
        |                     |     created_at   |
        | 1                   +------------------+
        |                             | 1
        |                             |
        | 1:N                         | 1:N
        v                             v
+------------------+          +------------------+
|    BADG_LOGS     |          |  STATUS_HISTORY  |
+------------------+          +------------------+
| PK  id (BIGINT)  |          | PK  id (BIGINT)  |
| FK  user_id      |          | FK  issue_id     |
|     badge_name   |          |     old_status   |
|     awarded_at   |          |     new_status   |
+------------------+          |     changed_at   |
                              +------------------+
```

### 🗄️ Indexing Optimization Strategy
To guarantee sub-100ms query latency on active workloads, PostgreSQL is indexed using:
* `idx_issues_coords` on `(latitude, longitude)` - Accelerates live-map geospatial queries.
* `idx_issues_status` on `(status, created_at)` - Powers dashboard aggregation feeds.
* `idx_users_email` (Unique) - Maximizes login security throughput.

---

## 📂 Production Workspace Directory Structure

```
.
├── .env.example                     # Reference for all required secrets & variables
├── .gitignore                       # System paths & build folders excluded from VCS
├── ARCHITECTURE.md                  # Comprehensive blueprint of software designs
├── package.json                     # Frontend app manifest, scripts, and runtime packages
├── tsconfig.json                    # Strict type definitions for TypeScript compilation
├── vercel.json                      # Vercel Single-Page Application (SPA) routing proxy
├── vite.config.ts                   # Highly-optimized bundler & compiler configuration
├── backend-blueprint                # Java Spring Boot Backend Blueprint
│   ├── pom.xml                      # Maven project dependencies & build definitions
│   ├── Dockerfile                   # Highly optimized multi-stage production Docker build
│   └── src
│       └── main
│           ├── java/com/truecivilian
│           │   ├── TrueCivilianApplication.java # Spring Boot main entry point
│           │   ├── config           # Security, WebMVC, and JPA profiles
│           │   ├── controller       # REST Endpoint handlers for all domains
│           │   ├── dto              # Strictly validated Data Transfer Objects
│           │   ├── exception        # Global REST exception handling middlewares
│           │   ├── model            # Encapsulated JPA Entities & Hibernate relationships
│           │   ├── repository       # Spring Data JPA repositories with performance queries
│           │   └── service          # Enterprise business logica & third-party connectors
│           └── resources
│               ├── application.yml  # Main application settings with fallback vars
│               └── application-prod.yml # Hardened Enterprise Production configuration
└── src                              # React TypeScript Frontend Application
    ├── main.tsx                     # Main React DOM hydration entry
    ├── App.tsx                      # Root core shell and context injection node
    ├── index.css                    # Tailwind CSS globals & premium utility styles
    ├── context                      # Global state providers (Auth, Notification, Loading)
    ├── lib                          # Shared libraries and connection utilities (axios)
    └── components                   # Highly modular UI components segmented by domain
        ├── admin                    # Superuser controls & systemic logs
        ├── analytics                # Performance dashboards and charts
        ├── auth                     # User signup, log in, and credentials validation
        ├── authority                # Department routing & assignment engines
        ├── community                # Upvotes, discussion threads, and social logs
        ├── gamification             # Dynamic XP, achievement boards, and badge hubs
        ├── issues                   # Reporting wizards, camera triggers, list views
        ├── landing                  # High-contrast, clean-design marketing frontpage
        ├── layout                   # Application chrome & Navigation shell components
        ├── maps                     # Custom maps component powered by Google Maps API
        ├── notifications            # Activity logs & center panels
        └── ui                       # Standardized atomic design elements (skeletons, forms)
```

---

## 🔒 Complete Environment Variable Reference

The following environment variables are required across environments to ensure full functionality. None of these contain hardcoded or default keys in production:

| Variable | Scope | Purpose | Security Rating |
|---|---|---|---|
| `GEMINI_API_KEY` | Backend | Powers multimodal issue classification & deduplication | **CRITICAL** (Secret) |
| `DB_HOST` | Backend | PostgreSQL Host Address (e.g. AWS RDS or Supabase host) | **HIGH** (Secret) |
| `DB_PORT` | Backend | PostgreSQL Port (Default: `5432`) | Medium |
| `DB_NAME` | Backend | Dedicated database name (e.g., `truecivilian`) | Medium |
| `DB_USER` | Backend | Connection Username credential | **HIGH** (Secret) |
| `DB_PASSWORD` | Backend | Secure connection password | **CRITICAL** (Secret) |
| `JWT_SECRET_KEY` | Backend | HMAC-SHA 256 Secret (At least 32-bytes base64 string) | **CRITICAL** (Secret) |
| `CLOUDINARY_CLOUD_NAME`| Backend | Target Cloudinary folder bucket | Medium |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API Key | **HIGH** (Secret) |
| `CLOUDINARY_API_SECRET`| Backend | Cloudinary API secret hash | **CRITICAL** (Secret) |
| `GOOGLE_MAPS_API_KEY` | Frontend | Google Maps API key embedded in the browser layer | Medium (Restricted) |
| `APP_URL` | Both | Verified Frontend URL (Used for CORS validation) | Medium |
| `BACKEND_URL` | Frontend | Targeted Endpoint of Backend API Gateway | Medium |

---

## ⚙️ Local Development Guide

### Prerequisites
* Java Development Kit (JDK) 21 installed.
* Node.js v18+ with npm.
* PostgreSQL 15+ locally installed and running.

### 1. Database Setup
Create the target database through psql or PGAdmin:
```sql
CREATE DATABASE truecivilian;
```

### 2. Spring Boot Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend-blueprint
   ```
2. Create `src/main/resources/application.yml` or check that fallback values exist. Run in development profile:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```
3. The server will launch on `http://localhost:8080` with Spring Security disabled or in development mode, automatically generating tables.

### 3. Frontend App Setup
1. Navigate to the root directory and install dependencies:
   ```bash
   npm install
   ```
2. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

---

## 🚀 Step-by-Step Production Deployment Guide

### Option A: Frontend Deployment to Vercel
1. Ensure your repository is pushed to GitHub.
2. Sign in to Vercel and click **Add New** -> **Project**.
3. Import your TrueCivilian repository.
4. In **Framework Preset**, select **Vite**.
5. Set **Root Directory** as `./` (or leave empty).
6. Configure the **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Add the following Environment Variables in the Vercel dashboard:
   - `VITE_GOOGLE_MAPS_API_KEY` (your Google Maps browser-safe key)
   - `VITE_BACKEND_URL` (the fully qualified domain URL of your hosted Spring Boot app, e.g. `https://truecivilian-api.railway.app`)
8. Click **Deploy**. Vercel will automatically configure routing redirection as defined in our `vercel.json` file.

### Option B: Backend Deployment to Railway
1. Sign in to Railway and click **New Project** -> **GitHub**.
2. Select your repository.
3. Choose the `/backend-blueprint` subdirectory as the target.
4. Under **Settings**, select the **Nixpacks** or **Docker** builder (our custom `Dockerfile` will be auto-detected for robust build sandboxing).
5. Add the required Environment Variables listed in our [Environment Variable Reference](#-complete-environment-variable-reference) above.
6. Make sure to set `SPRING_PROFILES_ACTIVE=prod` to trigger our high-performance settings inside `application-prod.yml`.
7. Click **Deploy**. Railway will generate an secure HTTPS domain (e.g. `https://truecivilian-api.railway.app`) and expose port `8080` dynamically.

---

## 📋 Comprehensive API Documentation Reference

All API communications must carry standard HTTP status responses (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `500 Server Error`).

### 1. Authentication Domain
* **`POST /api/auth/register`**
  - Payload: `{ "email": "user@domain.com", "password": "SecurePassword123" }`
  - Response: `201 Created` with secure token details.
* **`POST /api/auth/login`**
  - Payload: `{ "email": "user@domain.com", "password": "SecurePassword123" }`
  - Response: `200 OK` with JSON Web Token: `{ "token": "ey...", "email": "...", "role": "CITIZEN" }`

### 2. Issue Reporting Domain
* **`GET /api/issues`**
  - Filters: `category`, `status`, `bounds` (latitude/longitude coordinates)
  - Response: `200 OK` returning an array of verified civilian issues.
* **`POST /api/issues`** (Authenticated)
  - Payload: Multipart/form-data with fields `category`, `description`, `latitude`, `longitude`, `file` (Media upload)
  - Response: `201 Created` containing created object with Gemini metadata category prediction validation.

### 3. Gamification Domain
* **`GET /api/gamification/leaderboard`**
  - Response: `200 OK` listing the top 10 citizens sorted by accumulated XP points.
* **`GET /api/gamification/profile`** (Authenticated)
  - Response: `200 OK` showing user's current level, badge logs, and next tier progression.
