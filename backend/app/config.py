from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List
import json
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Cryptora"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "End-to-end encrypted notepad with zero-knowledge architecture"
    
    # Security - Handle both JSON string and list
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", ""]
    MAX_CONTENT_SIZE: int = 1_000_000  # 1MB
    MAX_ALIAS_LENGTH: int = 100
    MIN_ALIAS_LENGTH: int = 1
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == 'ALLOWED_ORIGINS':
                # Handle both JSON array string and comma-separated values
                if raw_val.startswith('['):
                    return json.loads(raw_val)
                else:
                    # Handle comma-separated string
                    return [origin.strip() for origin in raw_val.split(',')]
            return raw_val

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
