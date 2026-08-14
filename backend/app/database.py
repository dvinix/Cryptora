from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

# Normalize database URL for SQLAlchemy 2.0 (Render/Supabase use postgres://)
database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

# Create database engine
engine = create_engine(
    database_url,
    pool_pre_ping=True,      # Verify connections before using
    pool_size=10,             # Connection pool size
    max_overflow=20,          # Max connections beyond pool_size
    echo=False                # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models (SQLAlchemy 2.0 style)
class Base(DeclarativeBase):
    pass

# Dependency for routes
def get_db():
    """
    Database session dependency.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
