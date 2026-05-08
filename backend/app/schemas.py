from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
import re


# ============= User Schemas =============

class UserBase(BaseModel):
    """Base schema for user"""
    alias: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Username/alias"
    )

class UserCreate(BaseModel):
    """Schema for creating a new user"""
    alias: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=4, description="Password for account")
    
    @field_validator('alias')
    @classmethod
    def validate_alias(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Alias must contain only letters, numbers, hyphens, and underscores')
        return v.lower()

class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    encrypted_alias: str
    created_at: datetime
    last_accessed_at: datetime
    
    model_config = {"from_attributes": True}


# ============= Note Schemas =============

class NoteCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=500, description="Note title (plain text)")
    content: str = Field(..., description="Note content (plain text)")

class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., description="Updated note content")
    previous_hash: Optional[str] = Field(None, description="Optional: Previous hash for overwrite protection")

class NoteResponse(BaseModel):
    id: int
    user_id: int
    encrypted_title: Optional[str]
    encrypted_content: str
    content_hash: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = {"from_attributes": True}

class NoteWithDecrypted(NoteResponse):
    decrypted_title: Optional[str] = None
    decrypted_content: Optional[str] = None


# ============= Combined Schemas =============

class UserWithNotes(UserResponse):
    """User with all their notes"""
    notes: List[NoteResponse] = []

class LoginRequest(BaseModel):
    """Schema for user login"""
    alias: str = Field(..., min_length=1)
    password: str = Field(..., min_length=4)

class LoginResponse(BaseModel):
    """Schema for login response"""
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None  # JWT token for subsequent requests


# ============= JWT Token Schemas =============

class TokenResponse(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    """Schema for JWT token payload"""
    sub: str  # user_id
    alias: str
    exp: datetime
    iat: datetime


# ============= Auth Request Schemas =============

class AuthRequest(BaseModel):
    """Schema for password-protected requests"""
    password: str = Field(..., min_length=4, description="Password for authentication")


class GetUserRequest(BaseModel):
    """Schema for retrieving user data with password"""
    password: str = Field(..., min_length=4, description="Password for authentication")
