from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Note: Database tables should be managed via Alembic migrations
# Run: alembic upgrade head
# Uncomment below only for initial development setup
# try:
#     from app.database import Base, engine
#     Base.metadata.create_all(bind=engine)
#     logger.info("✅ Database tables created successfully")
# except Exception as e:
#     logger.error(f"⚠️ Database initialization failed: {e}")
#     logger.info("App will start but database operations may fail")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Log CORS configuration
logger.info(f"🌐 CORS configured for origins: {settings.cors_origins_list}")

# Health check endpoint (before router to avoid conflicts)
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health"
    }

# Include API router with prefix
app.include_router(router, prefix=settings.API_V1_PREFIX)
