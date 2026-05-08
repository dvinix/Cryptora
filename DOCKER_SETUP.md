# Docker Setup Guide for Cryptora

## Prerequisites
- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Docker Compose (included with Docker Desktop)

## Local Testing with Docker Compose

### 1. Build & Start Services
```bash
cd /path/to/Cryptora
docker-compose up --build
```

This will:
- Build the backend Docker image
- Start PostgreSQL database
- Start the FastAPI backend on `http://localhost:8000`
- Enable auto-reload on code changes

### 2. Verify Services Are Running
```bash
# Check containers
docker-compose ps

# Check logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 3. Test API
```bash
# Health check
curl http://localhost:8000/health

# API docs
open http://localhost:8000/docs
```

### 4. Stop Services
```bash
docker-compose down
```

### 5. Clean Up (Reset Database)
```bash
docker-compose down -v
docker-compose up --build
```

---

## Building for Production (AWS)

### 1. Build Image Locally
```bash
cd backend
docker build -t cryptora-backend:latest .
```

### 2. Test Production Image
```bash
docker run -d -p 8000:8000 \
  -e DATABASE_URL="postgresql://postgres:password@host.docker.internal:5432/cryptora" \
  -e CORS_ORIGINS="https://cryptora.dvinix.dev,http://localhost:3000" \
  --name cryptora_backend \
  cryptora-backend:latest

# Test
curl http://localhost:8000/health

# Stop
docker stop cryptora_backend
docker rm cryptora_backend
```

### 3. Push to AWS ECR
```bash
# Set variables
AWS_ACCOUNT_ID=YOUR_ACCOUNT_ID
AWS_REGION=us-east-1
REPO_NAME=cryptora-backend

# Create ECR repository (one-time)
aws ecr create-repository --repository-name $REPO_NAME --region $AWS_REGION

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Tag image
docker tag cryptora-backend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest
```

---

## Troubleshooting

### Database Connection Error
```
Error: could not translate host name "postgres" to address
```
**Solution**: Make sure `postgres` service is running:
```bash
docker-compose ps
docker-compose logs postgres
```

### Port Already in Use
```
Error: bind: address already in use
```
**Solution**: Change port in docker-compose.yml or stop conflicting service:
```bash
docker-compose down
# or change "5432:5432" to "5433:5432"
```

### Changes Not Reflecting
The backend container has `--reload` enabled for development. If changes don't appear:
```bash
docker-compose restart backend
```

### Database Migrations
Migrations run automatically on startup via `Base.metadata.create_all()`. To verify:
```bash
docker-compose logs backend | grep "Database tables created"
```

---

## Environment Variables

Edit `docker-compose.yml` to change:
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: Comma-separated allowed origins
- `PROJECT_NAME`: API project name
- `VERSION`: API version

## Frontend Testing

Update frontend `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

Then run frontend in separate terminal:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` and test API calls.
