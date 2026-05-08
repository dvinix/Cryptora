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


# ============= Folder Schemas =============

class FolderCreate(BaseModel):
    """Schema for creating a new folder"""
    name: str = Field(..., min_length=1, max_length=100, description="Folder name (plain text)")
    color: Optional[str] = Field(default='default', max_length=20, description="Folder color theme")
    icon: Optional[str] = Field(default='folder', max_length=50, description="Folder icon name")

class FolderUpdate(BaseModel):
    """Schema for updating a folder"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, max_length=20)
    icon: Optional[str] = Field(None, max_length=50)

class FolderResponse(BaseModel):
    """Schema for folder response"""
    id: int
    user_id: int
    encrypted_name: str
    color: Optional[str]
    icon: Optional[str]
    created_at: datetime
    
    model_config = {"from_attributes": True}

class FolderWithDecrypted(FolderResponse):
    """Folder response with decrypted name"""
    decrypted_name: str


# ============= Note Schemas =============

class NoteCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=500, description="Note title (plain text)")
    content: str = Field(..., description="Note content (plain text)")
    folder_id: Optional[int] = Field(None, description="Optional folder ID to organize the note")

class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., description="Updated note content")
    folder_id: Optional[int] = Field(None, description="Folder ID (use -1 to remove from folder)")
    previous_hash: Optional[str] = Field(None, description="Optional: Previous hash for overwrite protection")

class NoteResponse(BaseModel):
    id: int
    user_id: int
    folder_id: Optional[int]
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
    folders: List[FolderResponse] = []

class LoginRequest(BaseModel):
    """Schema for user login"""
    alias: str = Field(..., min_length=1)
    password: str = Field(..., min_length=4)

class LoginResponse(BaseModel):
    """Schema for login response"""
    success: bool
    message: str
    user: Optional[UserResponse] = None


# ============= Auth Request Schemas =============

class AuthRequest(BaseModel):
    """Schema for password-protected requests"""
    password: str = Field(..., min_length=4, description="Password for authentication")


class GetUserRequest(BaseModel):
    """Schema for retrieving user data with password"""
    password: str = Field(..., min_length=4, description="Password for authentication")
