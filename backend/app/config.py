from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from typing import List, Union
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Cryptora"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "End-to-end encrypted notepad with zero-knowledge architecture"
    
    # Security - Handle both JSON string and comma-separated string
    ALLOWED_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://localhost:5173"]
    MAX_CONTENT_SIZE: int = 1_000_000  # 1MB
    MAX_ALIAS_LENGTH: int = 100
    MIN_ALIAS_LENGTH: int = 1
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    
    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            # Try to parse as JSON first
            v = v.strip()
            if v.startswith('['):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass
            # Otherwise treat as comma-separated
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
