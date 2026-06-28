# TrueCivilian AI — Comprehensive Architectural Blueprint & Production Roadmap

TrueCivilian AI is an enterprise-grade, AI-powered civic engagement platform designed to empower citizens, coordinate volunteers, optimize municipal workflows, and provide state-of-the-art diagnostic dashboards for city administrators. 

---

## 1. High-Level System Architecture

The platform operates on a decouple, high-performance dual-tier stack:
- **Frontend Client**: React 19 (TypeScript) with Vite, Tailwind CSS, Framer Motion, and React Router. Served globally via highly responsive edge hosting.
- **Backend Service**: Java 21 & Spring Boot 3.x, deploying a highly secure, stateless REST API following Clean/Layered Architecture, utilizing Hibernate and JPA for high-performance transactional integrity.
- **Durable Storage**: PostgreSQL relational database with index optimization for spatial queries and metadata indexing.
- **Storage Subsystem**: Cloudinary CDN for optimized multi-format image/video encoding, hosting, and edge delivery.
- **AI Integration**: Google AI Studio (Gemini 2.5/1.5 models) bound directly to the Spring Boot backend to keep API keys isolated from the client tier.
- **Map & Location Engine**: Google Maps Platform (Maps, Places, Geocoding) for mapping coordinates, rendering heatmaps, and running route optimizations.

```
                          ┌───────────────────────────┐
                          │    React Client Tier      │
                          │   (Vercel Edge Host)      │
                          └─────────────┬─────────────┘
                                        │
                               HTTPS    │ JWT Authenticated
                                        ▼
                          ┌───────────────────────────┐
                          │    Spring Boot Backend    │
                          │     (Railway / Cloud)     │
                          └──────┬───────────┬────────┘
                                 │           │
       PostgreSQL (JDBC/JPA)     │           │  Third-Party Integration
  ┌──────────────────────────────▼───┐       ├─────────────────────────┐
  │         PostgreSQL               │       ▼                         ▼
  │   (Durable Relational DB)        │  ┌───────────┐           ┌──────────────┐
  └──────────────────────────────────┘  │Cloudinary │           │ Google Maps  │
                                        │ (Storage) │           │ & Gemini AI  │
                                        └───────────┘           └──────────────┘
```

---

## 2. Complete Software Architecture Details

### A. Frontend Architecture (React)
The frontend client utilizes a **Feature-Based Module Pattern** combined with a robust **Atomic Design System**.

```
src/
├── assets/             # Static graphics, brand assets, vector icons
├── components/         # Global shared UI elements
│   ├── ui/             # Core design tokens (Button, Input, Badge, Card, etc.)
│   ├── layout/         # Shell components (Header, Footer, Navigation, Drawer)
│   └── feedback/       # Toast notifications, modal layers, loading skeletons
├── context/            # Shared Context Providers (Theme, Auth, MapContext)
├── hooks/              # Global custom Hooks (useAuth, useLocalStorage, useDebounce)
├── pages/              # Routing entry points (views mapped to app screens)
├── services/           # Backend communication (API Clients, Axios instances, interceptors)
├── styles/             # Global CSS containing Tailwind core directives
├── types/              # Type-safe global Interfaces and TypeScript declarations
└── utils/              # Helper functions (Formatters, Validators, MapHelpers)
```

### B. Backend Architecture (Java Spring Boot)
The Spring Boot backend utilizes **Clean Layered Architecture** with distinct separation of concerns to prevent domain pollution:

```
com.truecivilian.api
├── config/             # Security configs, CORS, WebMvc, Cloudinary, Gemini, Google Maps
├── controller/         # REST Controllers (exposes API endpoints, handles requests/responses)
├── service/            # Core business logic interfaces
│   └── impl/           # Concrete service implementations, transaction management, AI execution
├── repository/         # Data Access Layer (Spring Data JPA interface repositories)
├── entity/             # JPA Relational Entities representing PostgreSQL tables
├── dto/                # Request and Response Data Transfer Objects
├── exception/          # Global Exception Handling layer (ControllerAdvice, customized responses)
├── security/           # JWT creation, filtration, UserDetailsService, AuthenticationProvider
└── util/               # Utility helper modules (GeminiClient, GeolocationUtil, CloudinaryHelper)
```

---

## 3. Database Module Design (PostgreSQL Schema)

The database design relies on strong relational integrity, cascade constraints, and structural optimizations for location tracking.

```
                  ┌──────────────────────┐
                  │        users         │
                  ├──────────────────────┤
                  │ id (PK)              │
                  │ email (Unique)       │◄────────────────────────┐
                  │ password_hash        │                         │
                  │ full_name            │                         │
                  │ role (Enum)          │                         │
                  │ xp_points            │                         │
                  │ level (Enum)         │                         │
                  │ streak_days          │                         │
                  └──────────┬───────────┘                         │
                             │                                     │
                             │ 1                                   │ 1
                             ▼ N                                   ▼ N
                  ┌──────────────────────┐              ┌──────────────────────┐
                  │        issues        │              │  community_actions   │
                  ├──────────────────────┤              ├──────────────────────┤
                  │ id (PK)              │              │ id (PK)              │
                  │ title                │              │ user_id (FK)         │
                  │ description          │              │ issue_id (FK)        │
                  │ status (Enum)        │              │ action_type (Enum)   │
                  │ category (Enum)      │              │ comment_text         │
                  │ severity (Enum)      │              │ attachment_url       │
                  │ priority (Enum)      │              │ created_at           │
                  │ department (Enum)    │              └──────────┬───────────┘
                  │ reporter_id (FK)     │                         │
                  │ latitude             │◄────────────────────────┘
                  │ longitude            │
                  │ image_url            │
                  │ video_url            │
                  │ upvotes_count        │
                  │ created_at           │
                  │ updated_at           │
                  └──────────┬───────────┘
                             │
                             │ 1
                             ▼ N
                  ┌──────────────────────┐
                  │    issue_timeline    │
                  ├──────────────────────┤
                  │ id (PK)              │
                  │ issue_id (FK)        │
                  │ previous_status      │
                  │ new_status           │
                  │ assigned_user (FK)   │
                  │ notes                │
                  │ created_at           │
                  └──────────────────────┘
```

### Table Definitions & Indices

1. **`users`**:
   - `id`: BIGSERIAL (Primary Key)
   - `email`: VARCHAR(255) (Unique, Indexed)
   - `password_hash`: VARCHAR(255)
   - `full_name`: VARCHAR(100)
   - `role`: VARCHAR(30) (CITIZEN, VOLUNTEER, AUTHORITY, ADMIN)
   - `xp_points`: INT (Default 0)
   - `level`: VARCHAR(30) (CITIZEN, VOLUNTEER, PROBLEM_SOLVER, COMMUNITY_HERO, LEGEND)
   - `streak_days`: INT (Default 0)
   - `created_at`: TIMESTAMP

2. **`issues`**:
   - `id`: BIGSERIAL (Primary Key)
   - `title`: VARCHAR(150)
   - `description`: TEXT
   - `status`: VARCHAR(30) (REPORTED, VERIFIED, ASSIGNED, ENGINEER_VISITED, REPAIR_STARTED, RESOLVED)
   - `category`: VARCHAR(30) (ROAD, WATER, GARBAGE, ELECTRICITY, TRAFFIC, DRAINAGE, POLLUTION, ILLEGAL_PARKING)
   - `severity`: VARCHAR(20) (LOW, MEDIUM, HIGH, CRITICAL)
   - `priority`: VARCHAR(20) (LOW, MEDIUM, HIGH, CRITICAL)
   - `department`: VARCHAR(50) (MUNICIPALITY, WATER_BOARD, ELECTRICAL_DEPARTMENT, TRAFFIC_POLICE, POLLUTION_CONTROL)
   - `reporter_id`: BIGINT (Foreign Key referencing `users(id)`)
   - `latitude`: DOUBLE PRECISION (Indexed)
   - `longitude`: DOUBLE PRECISION (Indexed)
   - `image_url`: VARCHAR(500)
   - `video_url`: VARCHAR(500)
   - `upvotes_count`: INT (Default 0)
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

3. **`community_actions`**:
   - `id`: BIGSERIAL (Primary Key)
   - `user_id`: BIGINT (Foreign Key referencing `users(id)`)
   - `issue_id`: BIGINT (Foreign Key referencing `issues(id)`)
   - `action_type`: VARCHAR(30) (SUPPORT, SERIOUS, EMERGENCY, APPRECIATE, COMMENT, EVIDENCE_UPLOAD)
   - `comment_text`: TEXT
   - `attachment_url`: VARCHAR(500)
   - `created_at`: TIMESTAMP

4. **`issue_timeline`**:
   - `id`: BIGSERIAL (Primary Key)
   - `issue_id`: BIGINT (Foreign Key referencing `issues(id)`)
   - `previous_status`: VARCHAR(30)
   - `new_status`: VARCHAR(30)
   - `assigned_user_id`: BIGINT (Foreign Key referencing `users(id)`)
   - `notes`: TEXT
   - `created_at`: TIMESTAMP

---

## 4. Key AI Workflows (Powered by Google Gemini API)

All AI interactions run server-side via the Spring Boot backend using the Google AI Studio REST APIs or the official SDK client, using system instructions and JSON schemas for maximum predictability.

```
       [Citizen Uploads Image/Video + Optional Description]
                              │
                              ▼
               ┌─────────────────────────────┐
               │    Spring Boot Backend      │
               └──────────────┬──────────────┘
                              │
                              ▼
            ┌──────────────────────────────────┐
            │   Google Gemini API (Server)     │
            │   - Checks image for blurring/fakes
            │   - Extracts categories / severity
            │   - Predicts resolution time (days)
            │   - Detects duplicate locations  │
            └─────────────────┬────────────────┘
                              │
                     Structured JSON Output
                              ▼
               ┌─────────────────────────────┐
               │    Spring Boot Server       │
               │    - Saves to PostgreSQL    │
               │    - Returns DTO to Client  │
               └──────────────┬──────────────┘
                              │
                              ▼
          [Client UI Displays Pre-populated Forms]
```

### I. Multi-modal Issue Classification & Routing Workflow
- **Input**: Multimodal prompt including the uploaded photo/video binary and optional text metadata.
- **System Instructions**:
  ```text
  You are an expert municipal triage intelligence. Classify the user's issue into one of these exact categories: [ROAD, WATER, GARBAGE, ELECTRICITY, TRAFFIC, DRAINAGE, POLLUTION, ILLEGAL_PARKING].
  Determine the severity: [LOW, MEDIUM, HIGH, CRITICAL].
  Assign the corresponding responsible department: [MUNICIPALITY, WATER_BOARD, ELECTRICAL_DEPARTMENT, TRAFFIC_POLICE, POLLUTION_CONTROL].
  Generate a professional title (e.g. 'Broken Streetlight Near Bus Stop') and a concise, descriptive summary of the damage.
  Output strictly in JSON format matching the schema.
  ```
- **Output JSON Schema**:
  ```json
  {
    "category": "string",
    "severity": "string",
    "department": "string",
    "priority": "string",
    "generatedTitle": "string",
    "generatedDescription": "string",
    "estimatedDaysToResolve": 2
  }
  ```

### II. AI Duplicate Issue Detection Workflow
- **Trigger**: Before a citizen completes a new report, the backend queries PostgreSQL for open reports within a 150-meter radius.
- **Workflow**: 
  - Backend retrieves titles, descriptions, and thumbnails of nearby open reports.
  - Gemini reviews the active submission description and image compared against nearby records.
  - **Decision**: If match probability exceeds 80%, Gemini flags it as a potential duplicate, returning the original issue ID so the frontend can display: *"Would you like to support this existing issue instead to expedite resolution?"*

### III. Intelligent AI Chat Assistant
- **Scope**: Dedicated citizen virtual assistant.
- **Capabilities**: Conversational query understanding. Can parse requests like *"Why is the sewage leak at Whitefield still pending?"* or *"How do I file a tree-falling emergency?"*.
- **Grounding**: The backend injects the citizen's report history and community status to give contextual answers.

---

## 5. Screen & View Architecture (Frontend)

TrueCivilian AI implements a responsive visual portal with specific dashboards tailored per user role:

### A. Citizen & Volunteer Workspace (Responsive Portal)
1. **Home Feed Screen**: A civic social feed highlighting reported issues, trending hashtags (e.g. `#CleanCity`, `#WaterLeak`), community upvotes, and progress indicators.
2. **Issue Map Screen**: An interactive visualization map (using Google Maps) rendering live markers categorized by status (Open: Red, In-Progress: Yellow, Resolved: Green). Includes a toggleable complaints density heatmap.
3. **Report Issue Screen**: Guided reporting form with interactive drag-and-drop media upload, automated location coordinates capture, and live AI pre-population preview showing predicted details.
4. **Active Issue Detail Screen**: Live status tracking timeline showing precise real-time transitions (Reported ➔ Verified ➔ Assigned ➔ Repair Started ➔ Resolved). Community validation panel for verification, comments, and uploads of secondary evidence.
5. **My Portal & Profile**: Gamified dashboard showing user's progress: XP levels, community badges (e.g., *Community Hero*, *Trusted Verifier*, *Eco Warrior*), and weekly streak trackers.

### B. Authority & Administrator Console
1. **Management Dashboard**: A comprehensive operations control board showcasing critical metrics: Open Issues count, Urgent Priority cases, and Department-wise backlog.
2. **Interactive Dispatch Map**: Visualizing open issues with automated route planning for municipal maintenance workers.
3. **Analytics & Performance Panel**: Interactive charts rendering reports-per-day, ward resolution speed, citizen satisfaction score, and future problem forecasting.

---

## 6. Comprehensive REST API Design (Backend)

| Module | Endpoint | Method | Role Allowed | Description |
|---|---|---|---|---|
| **Auth** | `/api/auth/register` | `POST` | ALL | Registers a new user account |
| | `/api/auth/login` | `POST` | ALL | Authenticates and issues stateless JWT |
| **Issues** | `/api/issues/create` | `POST` | CITIZEN, VOLUNTEER | Submits a new citizen complaint |
| | `/api/issues/nearby` | `GET` | ALL | Fetches reports within a custom distance radius |
| | `/api/issues/{id}` | `GET` | ALL | Retrieves complete issue metadata & timeline |
| | `/api/issues/ai-parse` | `POST` | CITIZEN, VOLUNTEER | Processes uploaded image/video with Gemini |
| | `/api/issues/{id}/status` | `PUT` | AUTHORITY, ADMIN | Manually transition status through workflow |
| **Social** | `/api/issues/{id}/vote` | `POST` | CITIZEN, VOLUNTEER | Triggers upvote or reaction on an issue |
| | `/api/issues/{id}/comment`| `POST` | CITIZEN, VOLUNTEER | Adds a text comment or secondary photo evidence |
| **Admin** | `/api/admin/metrics` | `GET` | AUTHORITY, ADMIN | Gathers ward performance & department statistics |
| | `/api/admin/route` | `GET` | AUTHORITY | Returns optimized coordinates route for repairs |
| **Citizen**| `/api/users/leaderboard`| `GET` | ALL | Retreives monthly gamified standings |

---

## 7. Complete Project Development Roadmap

### Module 1: Foundation & DevOps Integration (Sprint 1)
*Establish perfect production-ready boilerplates and cloud configurations for absolute stability.*

### Module 2: Authentication, Security & User Management (Sprint 2)
*Establish fully typed user schemas, security layers, JWT processing, and profile structures.*

### Module 3: Storage, Maps & Issue Reporting Core (Sprint 3)
*Build the pipeline for media storage, maps loading, spatial indices, and reporting.*

### Module 4: Google Gemini AI Intelligence Integration (Sprint 4)
*Hook up server-side AI parsing, duplicate check triggers, auto-titling, and smart assistants.*

### Module 5: Community Engagement, Gamification & Social Feed (Sprint 5)
*Build comments, hashtag searching, social sharing hooks, XP calculations, and badges.*

### Module 6: Authority Operations & Admin Visual Analytics (Sprint 6)
*Develop worker route optimizations, heatmap matrices, performance dashboards, and PWA capabilities.*

---

## 8. SPRINT 1 DELIVERABLES (Current Scope)

Sprint 1 focuses strictly on building the absolute, flawless foundation of the system. It contains **no business logic, no authentication screens, no UI pages, and no REST endpoints**. It compiles beautifully, providing a robust codebase for subsequent modules.

### React + TypeScript + Vite Foundation
1. **Design System & ThemeProvider**: Elegant, standard-compliant Tailwind theme supporting pristine Light & Dark themes out of the box with persistent custom state.
2. **Shell Architecture**: Responsive, beautiful responsive shell framework ready for desktop, tablet, and mobile viewing.
3. **Routing Infrastructure**: React Router layout boilerplate initialized securely.
4. **Pragmatic Folder Structure**: Complete feature-ready, standard React folder layout created.
5. **Pristine Typographical Foundations**: Configuration for modern fonts (Inter, Space Grotesk, JetBrains Mono).

### Java Spring Boot Foundation (Maven Draft)
1. **Maven Project Structure**: Standard high-quality `pom.xml` configured with correct dependencies.
2. **Database Setup Configuration**: Flawless PostgreSQL connection configurations within standard properties.
3. **Stateless JWT Security Boilerplate**: Security Filter Chain draft and standard cryptographic structures.
4. **Third-Party Client Wrappers**: 
   - Cloudinary integration wrapper draft.
   - Google Gemini API service client wrapper template.
   - Google Maps Platform config parameters.
5. **Fully Mapped Environment Architecture**: System-ready `.env.example` file.

---

## 9. SPRINT 1 IMPLEMENTATION MATRIX

Let's inspect what is already present in this directory and prepare to construct the files. We will create:
1. `src/context/ThemeContext.tsx` - Elegant Dark/Light state provider.
2. `src/components/layout/Shell.tsx` - Responsive header, content container, and footer.
3. `src/App.tsx` - Setup of React Router, theme wrappers, and basic landing.
4. `/backend-blueprint/pom.xml` - Comprehensive Maven configuration showing Spring Boot 3.x setup.
5. `/backend-blueprint/application.yml` - Perfect production properties for Spring Boot, PostgreSQL, Security, and AI.
6. `/.env.example` - Upgraded comprehensive secrets documentation.

Let's begin setting up the visual and configurations of Sprint 1!
