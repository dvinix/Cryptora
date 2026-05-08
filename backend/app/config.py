from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Cryptora"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "End-to-end encrypted notepad with zero-knowledge architecture"
    
    # Security - CORS configuration
    CORS_ORIGINS: str
    CORS_ALLOW_CREDENTIALS: bool = False  # Set to True only if using credentials with restricted origins
    
    # Security - JWT configuration
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_EXPIRATION_HOURS: int
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS from comma-separated string to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    # Request limits
    MAX_CONTENT_SIZE: int = 1_000_000  # 1MB
    MAX_ALIAS_LENGTH: int = 100
    MIN_ALIAS_LENGTH: int = 1
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
