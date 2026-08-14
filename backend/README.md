# Cryptora Backend

End-to-end encrypted notepad backend with zero-knowledge architecture.

## Features

- **Zero-Knowledge Architecture**: Server never sees unencrypted content or passwords
- **AES-256-GCM Encryption**: All encryption happens client-side
- **RESTful API**: Built with FastAPI
- **PostgreSQL Database**: Secure encrypted content storage
- **Overwrite Protection**: Optimistic locking prevents concurrent overwrites

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL 12+

### Installation

1. **Clone the repository** (if not already done)

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `DATABASE_URL`: Your PostgreSQL connection string

5. **Set up database**:
   
   Create PostgreSQL database:
   ```sql
   CREATE DATABASE cryptora_db;
   CREATE USER cryptora_user WITH PASSWORD 'your_password_here';
   GRANT ALL PRIVILEGES ON DATABASE cryptora_db TO cryptora_user;
   ```

6. **Run migrations**:
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

## Running the Server

### Development Mode
```bash
python run.py
```

Or with uvicorn directly:
```bash
uvicorn app.main:app --reload --port 8000
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Sites
- `GET /api/v1/sites/check/{alias}` - Check if alias exists
- `GET /api/v1/sites/{alias}` - Get encrypted site data
- `POST /api/v1/sites/` - Create new encrypted site
- `PUT /api/v1/sites/{alias}` - Update site content
- `DELETE /api/v1/sites/{alias}` - Delete site (soft delete)

## Project Structure

```
backend/
├── app/
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── routers/         # API endpoints
│   ├── services/        # Business logic
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   └── main.py          # FastAPI app
├── alembic/             # Database migrations
├── tests/               # Test files
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── requirements.txt     # Python dependencies
└── run.py              # Development server
```

## Testing

Test with cURL:

```bash
# Health check
curl http://localhost:8000/health

# Check if site exists
curl http://localhost:8000/api/v1/sites/check/test-note

# Create a site
curl -X POST http://localhost:8000/api/v1/sites/ \
  -H "Content-Type: application/json" \
  -d '{
    "alias": "test-note",
    "encrypted_content": "dGVzdA==",
    "encrypted_alias": "dGVzdA==",
    "content_hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  }'
```

## Security

- All content is encrypted client-side before reaching the server
- Passwords never leave the browser
- Server stores only encrypted data
- Zero-knowledge architecture ensures privacy

## License

MIT
