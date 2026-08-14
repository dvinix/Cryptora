<p align="center">
  <img src="frontend/public/logo.png" alt="Cryptora Logo" width="80" height="80">
</p>

<h1 align="center">🔐 Cryptora</h1>

<p align="center">
  <strong>Your Notes, Truly Private</strong><br>
  <em>End-to-end encrypted notepad with zero-knowledge architecture</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API</a> •
  <a href="#screenshots">Screenshots</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg?style=flat-square" alt="Made with Love">
</p>

---

## 🎯 Project Overview (ATS-Optimized)

**Cryptora** is a full-stack encrypted note-taking application implementing zero-knowledge architecture with end-to-end encryption. Built with modern Python backend (FastAPI) and React TypeScript frontend, featuring enterprise-grade security, RESTful API design, and PostgreSQL database management.

### Backend Technical Highlights

#### Core Technologies & Frameworks
- **FastAPI Framework**: Async REST API with automatic OpenAPI documentation (Swagger/ReDoc)
- **Python 3.8+**: Type-hinted, object-oriented backend architecture
- **PostgreSQL**: Relational database with ACID compliance and complex queries
- **SQLAlchemy 2.0**: Modern ORM with type-safe database operations and relationship mapping
- **Alembic**: Database migration management and version control
- **Uvicorn**: High-performance ASGI server for async request handling
- **Pydantic**: Data validation, serialization, and settings management

#### Security & Cryptography
- **AES-256-GCM Encryption**: Industry-standard symmetric encryption for data at rest
- **Zero-Knowledge Architecture**: Server-side encryption without password storage
- **Cryptography Library**: Python cryptography package for secure key derivation (PBKDF2)
- **Password Verification**: Encrypted alias validation without plaintext password storage
- **Content Hashing**: SHA-256 hashing for data integrity and conflict detection
- **CORS Middleware**: Configurable cross-origin resource sharing for secure API access

#### API Architecture & Design Patterns
- **RESTful API Design**: Resource-based endpoints following REST principles
- **Service Layer Pattern**: Separation of business logic from route handlers
- **Repository Pattern**: Database abstraction through service classes
- **Dependency Injection**: FastAPI's built-in DI for database session management
- **HTTP Status Codes**: Proper use of 200, 201, 204, 401, 404, 409 responses
- **Error Handling**: Centralized exception handling with HTTPException
- **Request/Response Models**: Pydantic schemas for API contract validation

#### Database Design & ORM
- **Relational Data Modeling**: User, Note, and Folder entities with foreign key relationships
- **Cascade Operations**: Automatic cleanup with ON DELETE CASCADE
- **Soft Deletes**: is_active flag for data retention and recovery
- **Database Indexing**: Optimized queries with composite indexes on frequently accessed columns
- **SQLAlchemy Relationships**: One-to-many relationships with lazy/eager loading
- **Migration Scripts**: Alembic migrations for schema versioning and rollback capability
- **Connection Pooling**: Efficient database connection management

#### Advanced Features
- **Folder Organization**: Hierarchical note organization with encrypted folder names
- **Optimistic Locking**: Content hash-based conflict detection for concurrent updates
- **Lazy Loading**: On-demand decryption to minimize API calls and improve performance
- **Timestamp Tracking**: created_at, updated_at, last_accessed_at for audit trails
- **Batch Operations**: Efficient bulk queries for user notes and folders
- **Query Optimization**: Filtered queries with WHERE clauses and ORDER BY

#### API Endpoints Implemented
```
Authentication & User Management:
- POST /api/v1/register - User registration with encrypted alias
- POST /api/v1/login - Password verification and session management
- GET /api/v1/{alias} - User profile with notes and folders

Folder Management (CRUD):
- POST /api/v1/{alias}/folders - Create encrypted folder
- GET /api/v1/{alias}/folders/{id} - Retrieve and decrypt folder
- PUT /api/v1/{alias}/folders/{id} - Update folder metadata
- DELETE /api/v1/{alias}/folders/{id} - Soft delete with note preservation

Note Management (CRUD):
- POST /api/v1/{alias}/notes - Create encrypted note
- GET /api/v1/{alias}/notes/{id} - Retrieve and decrypt note
- PUT /api/v1/{alias}/notes/{id} - Update with conflict detection
- DELETE /api/v1/{alias}/notes/{id} - Soft delete note

Health & Monitoring:
- GET /health - Service health check endpoint
- GET /docs - Interactive Swagger API documentation
- GET /redoc - Alternative ReDoc API documentation
```

#### Development Best Practices
- **Environment Configuration**: python-dotenv for environment variable management
- **Logging**: Structured logging with Python logging module
- **Type Safety**: Full type hints with Mapped columns and Pydantic models
- **Code Organization**: Modular structure (models, schemas, services, routers)
- **Database Sessions**: Context manager pattern for automatic session cleanup
- **API Versioning**: /api/v1 prefix for future compatibility
- **Documentation**: Auto-generated OpenAPI 3.0 specification

#### Performance Optimizations
- **Async/Await**: Non-blocking I/O operations with FastAPI async endpoints
- **Database Query Optimization**: Selective column loading and filtered queries
- **Lazy Decryption**: Client-side decryption only when data is accessed
- **Connection Pooling**: Reusable database connections
- **Indexed Queries**: Fast lookups on alias, user_id, folder_id columns

#### Deployment & DevOps
- **Requirements Management**: pip requirements.txt with pinned versions
- **Database Initialization**: Automatic table creation on startup
- **Error Recovery**: Graceful degradation with try-catch error handling
- **CORS Configuration**: Production-ready cross-origin settings
- **Health Checks**: Monitoring endpoint for uptime verification

### Technical Skills Demonstrated
- Python Backend Development
- FastAPI Framework
- RESTful API Design
- PostgreSQL Database Management
- SQLAlchemy ORM
- Database Migrations (Alembic)
- Cryptography & Security
- Async Programming
- API Documentation
- Service-Oriented Architecture
- Dependency Injection
- Error Handling & Logging
- Environment Configuration
- Type Safety & Validation

---

## ✨ What is Cryptora?

**Cryptora** is a privacy-first encrypted notepad where your notes are protected with bank-level security. Unlike other note apps, your password never leaves your device—all encryption happens in your browser before anything touches our servers.

> 🛡️ **Zero-Knowledge**: We literally cannot read your notes, even if we wanted to.

---

## 🎯 Features

<table>
  <tr>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" width="40" height="40"><br>
      <strong>Zero-Knowledge</strong><br>
      <sub>Your encryption key never touches our servers</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/lock.svg" width="40" height="40"><br>
      <strong>Bank-Level Security</strong><br>
      <sub>AES-256-GCM encryption standard</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/eye-off.svg" width="40" height="40"><br>
      <strong>Private by Default</strong><br>
      <sub>No tracking, no analytics, no data collection</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg" width="40" height="40"><br>
      <strong>Instant Access</strong><br>
      <sub>No sign-up required, just alias & password</sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/save.svg" width="40" height="40"><br>
      <strong>Auto-Save</strong><br>
      <sub>Changes saved automatically as you type</sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/copy.svg" width="40" height="40"><br>
      <strong>One-Click Copy</strong><br>
      <sub>Copy your notes instantly to clipboard</sub>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose | Why? |
|------------|---------|------|
| <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" height="25"> | Core Language | Robust, readable, extensive crypto libraries |
| <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" height="25"> | API Framework | Async, fast, auto-documentation |
| <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" height="25"> | Database | ACID compliance, secure data storage |
| <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white" height="25"> | ORM | Type-safe database operations |
| <img src="https://img.shields.io/badge/Alembic-1E5945?style=flat-square&logo=alembic&logoColor=white" height="25"> | Migrations | Version-controlled schema changes |
| <img src="https://img.shields.io/badge/Uvicorn-499848?style=flat-square&logo=uvicorn&logoColor=white" height="25"> | ASGI Server | Lightning-fast async server |

### Frontend

| Technology | Purpose | Why? |
|------------|---------|------|
| <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" height="25"> | UI Framework | Component-based, reactive UI |
| <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" height="25"> | Language | Type safety, better DX |
| <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" height="25"> | Build Tool | Instant HMR, fast builds |
| <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" height="25"> | Styling | Utility-first, rapid UI development |
| <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" height="25"> | Animations | Smooth, professional animations |
| <img src="https://img.shields.io/badge/ShadCN_UI-000000?style=flat-square&logo=shadcnui&logoColor=white" height="25"> | Components | Beautiful, accessible components |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React + TypeScript + Tailwind + Framer Motion          │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌────────────┐   │   │
│  │  │   Editor    │    │  Encryption │    │   Notes    │   │   │
│  │  │  Component  │───▶│  (AES-256)  │───▶│   List     │   │   │
│  │  └─────────────┘    └─────────────┘    └────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                    Encrypted Data Only                          │
│                              ▼                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              FastAPI + Python + SQLAlchemy              │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌────────────┐   │   │
│  │  │    REST     │    │   Business  │    │    ORM     │   │   │
│  │  │     API     │───▶│    Logic    │───▶│   Layer    │   │   │
│  │  └─────────────┘    └─────────────┘    └────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database                   │   │
│  │         Stores only encrypted blobs - Zero Knowledge     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.8+
- **Node.js** 18+
- **PostgreSQL** 12+

### Installation

```bash
# Clone the repository
git clone https://github.com/divinixx/Cryptora.git
cd Cryptora
```

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the App

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:5173 |
| 🔌 Backend API | http://localhost:8000 |
| 📚 API Docs (Swagger) | http://localhost:8000/docs |
| 📖 API Docs (ReDoc) | http://localhost:8000/redoc |

---

## 📡 API Reference

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/auth/register` | Create new user |
| `POST` | `/api/v1/auth/login` | Authenticate user |
| `GET` | `/api/v1/{alias}/notes` | Get all notes |
| `POST` | `/api/v1/{alias}/notes` | Create new note |
| `GET` | `/api/v1/{alias}/notes/{id}` | Get specific note |
| `PUT` | `/api/v1/{alias}/notes/{id}` | Update note |
| `DELETE` | `/api/v1/{alias}/notes/{id}` | Delete note |

### Example Request

```bash
# Create encrypted note
curl -X POST http://localhost:8000/api/v1/myalias/notes \
  -H "Content-Type: application/json" \
  -H "X-Password: your-master-password" \
  -d '{
    "title": "My Secret Note",
    "content": "This gets encrypted before storage"
  }'
```

---

## 📁 Project Struct.

```
Cryptora/
├── 📂 backend/
│   ├── 📂 app/
│   │   ├── 📂 models/         # SQLAlchemy models
│   │   ├── 📂 schemas/        # Pydantic schemas
│   │   ├── 📂 routers/        # API endpoints
│   │   ├── 📂 services/       # Business logic
│   │   ├── 📄 config.py       # Configuration
│   │   ├── 📄 database.py     # DB connection
│   │   └── 📄 main.py         # FastAPI app
│   ├── 📂 alembic/            # Migrations
│   ├── 📄 requirements.txt
│   └── 📄 run.py
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/     # React components
│   │   │   ├── 📂 ui/         # ShadCN components
│   │   │   └── 📂 notes/      # Note components
│   │   ├── 📂 pages/          # Page components
│   │   ├── 📂 context/        # React context
│   │   ├── 📂 lib/            # Utilities
│   │   ├── 📄 App.tsx
│   │   └── 📄 main.tsx
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
│
└── 📄 README.md
```

---

## 🔒 Security Model

```
┌────────────────────────────────────────────────────┐
│                   YOUR BROWSER                      │
│                                                     │
│   Password ──▶ Derive Key ──▶ Encrypt ──▶ Send    │
│      🔑            🔐            🔒         📤      │
│                                                     │
│   ✅ Password stays here                           │
│   ✅ Key derived locally                           │
│   ✅ Only encrypted data leaves                    │
└────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│                   OUR SERVER                        │
│                                                     │
│   ❌ Never sees password                           │
│   ❌ Cannot decrypt content                        │
│   ✅ Stores encrypted blobs only                   │
└────────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

<p align="center">
  <strong>Landing Page</strong><br>
  <img src="./frontend/public/img.png" alt="Cryptora Landing Page" width="100%" style="border-radius: 10px; margin: 10px 0;">
</p>

<p align="center">
  <strong>Dashboard - Your Encrypted Notepad</strong><br>
  <img src="./frontend/public/img2.png" alt="Cryptora Dashboard" width="100%" style="border-radius: 10px; margin: 10px 0;">
</p>

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 💬 Connect

<p align="center">
  <a href="https://github.com/divinixx/Cryptora">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</p>

---

<p align="center">
  <strong>Built with ❤️ for everyone who values privacy</strong><br>
  <sub>Your thoughts deserve to stay yours.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/⭐_Star_this_repo_if_you_found_it_useful!-yellow?style=for-the-badge" alt="Star">
</p>
