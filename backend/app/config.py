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
    
    # Security - Not used since we allow all origins in main.py
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
