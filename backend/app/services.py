from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import User, Note
from app.schemas import UserCreate, NoteCreate, NoteUpdate
from app.crypto import CryptoUtils
from datetime import datetime
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_alias(self, alias: str) -> Optional[User]:
        stmt = select(User).where(User.alias == alias.lower(), User.is_active == True)
        return self.db.scalars(stmt).first()
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        return self.db.scalars(stmt).first()
    
    def create_user(self, user_data: UserCreate) -> User:
        encrypted_alias = CryptoUtils.encrypt(user_data.alias.lower(), user_data.password)
        user = User(
            alias=user_data.alias.lower(),
            encrypted_alias=encrypted_alias,
            created_at=datetime.utcnow(),
            last_accessed_at=datetime.utcnow()
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def verify_password(self, user: User, password: str) -> bool:
        try:
            decrypted = CryptoUtils.decrypt(user.encrypted_alias, password)
            return decrypted == user.alias
        except (ValueError, Exception) as e:
            logger.debug(f"Password verification failed for user {user.id}: {type(e).__name__}")
            return False
    
    def update_last_accessed(self, user_id: int) -> None:
        user = self.get_user_by_id(user_id)
        if user:
            user.last_accessed_at = datetime.utcnow()
            self.db.commit()


class NoteService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_note_by_id(self, note_id: int) -> Optional[Note]:
        stmt = select(Note).where(Note.id == note_id, Note.is_active == True)
        return self.db.scalars(stmt).first()
    
    def get_user_notes(self, user_id: int) -> List[Note]:
        stmt = select(Note).where(Note.user_id == user_id, Note.is_active == True).order_by(Note.created_at.desc())
        return list(self.db.scalars(stmt).all())
    
    def create_note(self, user_id: int, note_data: NoteCreate, password: str) -> Note:
        encrypted_title = CryptoUtils.encrypt(note_data.title, password) if note_data.title else None
        encrypted_content = CryptoUtils.encrypt(note_data.content, password)
        content_hash = CryptoUtils.hash_content(encrypted_content)
        note = Note(
            user_id=user_id,
            encrypted_title=encrypted_title,
            encrypted_content=encrypted_content,
            content_hash=content_hash,
            created_at=datetime.utcnow()
        )
        self.db.add(note)
        self.db.commit()
        self.db.refresh(note)
        return note
    
    def update_note(self, note_id: int, note_data: NoteUpdate, password: str) -> Note:
        note = self.get_note_by_id(note_id)
        if note_data.title is not None:
            note.encrypted_title = CryptoUtils.encrypt(note_data.title, password)
        encrypted_content = CryptoUtils.encrypt(note_data.content, password)
        content_hash = CryptoUtils.hash_content(encrypted_content)
        note.encrypted_content = encrypted_content
        note.content_hash = content_hash
        note.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(note)
        return note
    
    def delete_note(self, note_id: int) -> None:
        note = self.get_note_by_id(note_id)
        if note:
            note.is_active = False
            note.updated_at = datetime.utcnow()
            self.db.commit()
    
    def decrypt_note_content(self, note: Note, password: str) -> Optional[str]:
        try:
            return CryptoUtils.decrypt(note.encrypted_content, password)
        except (ValueError, Exception) as e:
            logger.debug(f"Failed to decrypt note {note.id} content: {type(e).__name__}")
            return None
    
    def decrypt_note_title(self, note: Note, password: str) -> Optional[str]:
        try:
            return CryptoUtils.decrypt(note.encrypted_title, password) if note.encrypted_title else None
        except (ValueError, Exception) as e:
            logger.debug(f"Failed to decrypt note {note.id} title: {type(e).__name__}")
            return None
