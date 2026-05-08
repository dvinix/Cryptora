from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    UserCreate, UserResponse, UserWithNotes, 
    NoteCreate, NoteUpdate, NoteResponse, NoteWithDecrypted, 
    FolderCreate, FolderUpdate, FolderResponse, FolderWithDecrypted,
    LoginRequest, LoginResponse, AuthRequest, GetUserRequest
)
from app.services import UserService, NoteService, FolderService

router = APIRouter(tags=["Users & Notes"], responses={404: {"description": "User or note not found"}, 409: {"description": "Conflict"}})


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    user_service = UserService(db)
    existing = user_service.get_user_by_alias(user_data.alias)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"User '{user_data.alias}' already exists")
    return user_service.create_user(user_data)


@router.post("/login", response_model=LoginResponse)
async def login_user(login_data: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    user_service = UserService(db)
    user = user_service.get_user_by_alias(login_data.alias)
    if not user:
        return LoginResponse(success=False, message="User not found")
    if not user_service.verify_password(user, login_data.password):
        return LoginResponse(success=False, message="Invalid password")
    user_service.update_last_accessed(user.id)
    return LoginResponse(success=True, message="Login successful", user=user)


@router.post("/{alias}/login", response_model=UserWithNotes)
async def get_user_with_notes(alias: str, auth: GetUserRequest, db: Session = Depends(get_db)) -> UserWithNotes:
    """Retrieve user data with their notes and folders - requires password authentication"""
    user_service = UserService(db)
    note_service = NoteService(db)
    folder_service = FolderService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    notes = note_service.get_user_notes(user.id)
    folders = folder_service.get_user_folders(user.id)
    return UserWithNotes(id=user.id, alias=user.alias, encrypted_alias=user.encrypted_alias, created_at=user.created_at, last_accessed_at=user.last_accessed_at, notes=notes, folders=folders)


# ============= Folder Routes =============

@router.post("/{alias}/folders", response_model=FolderResponse, status_code=status.HTTP_201_CREATED)
async def create_folder(alias: str, folder_data: FolderCreate, auth: AuthRequest, db: Session = Depends(get_db)) -> FolderResponse:
    user_service = UserService(db)
    folder_service = FolderService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    return folder_service.create_folder(user.id, folder_data, auth.password)


@router.post("/{alias}/folders/{folder_id}", response_model=FolderWithDecrypted)
async def get_folder(alias: str, folder_id: int, auth: AuthRequest, db: Session = Depends(get_db)) -> FolderWithDecrypted:
    user_service = UserService(db)
    folder_service = FolderService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    folder = folder_service.get_folder_by_id(folder_id)
    if not folder or folder.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Folder {folder_id} not found")
    decrypted_name = folder_service.decrypt_folder_name(folder, auth.password)
    return FolderWithDecrypted(id=folder.id, user_id=folder.user_id, encrypted_name=folder.encrypted_name, color=folder.color, icon=folder.icon, created_at=folder.created_at, decrypted_name=decrypted_name or "Unnamed Folder")


@router.put("/{alias}/folders/{folder_id}", response_model=FolderResponse)
async def update_folder(alias: str, folder_id: int, folder_data: FolderUpdate, auth: AuthRequest, db: Session = Depends(get_db)) -> FolderResponse:
    user_service = UserService(db)
    folder_service = FolderService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    folder = folder_service.get_folder_by_id(folder_id)
    if not folder or folder.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Folder {folder_id} not found")
    return folder_service.update_folder(folder_id, folder_data, auth.password)


@router.delete("/{alias}/folders/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_folder(alias: str, folder_id: int, auth: AuthRequest, db: Session = Depends(get_db)) -> None:
    user_service = UserService(db)
    folder_service = FolderService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    folder = folder_service.get_folder_by_id(folder_id)
    if not folder or folder.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Folder {folder_id} not found")
    folder_service.delete_folder(folder_id)


# ============= Note Routes =============


@router.post("/{alias}/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(alias: str, note_data: NoteCreate, auth: AuthRequest, db: Session = Depends(get_db)) -> NoteResponse:
    user_service = UserService(db)
    note_service = NoteService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    return note_service.create_note(user.id, note_data, auth.password)


@router.post("/{alias}/notes/{note_id}", response_model=NoteWithDecrypted)
async def get_note(alias: str, note_id: int, auth: AuthRequest, db: Session = Depends(get_db)) -> NoteWithDecrypted:
    user_service = UserService(db)
    note_service = NoteService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    note = note_service.get_note_by_id(note_id)
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Note {note_id} not found")
    decrypted_title = note_service.decrypt_note_title(note, auth.password)
    decrypted_content = note_service.decrypt_note_content(note, auth.password)
    return NoteWithDecrypted(id=note.id, user_id=note.user_id, encrypted_title=note.encrypted_title, encrypted_content=note.encrypted_content, content_hash=note.content_hash, created_at=note.created_at, updated_at=note.updated_at, folder_id=note.folder_id, decrypted_title=decrypted_title, decrypted_content=decrypted_content)


@router.put("/{alias}/notes/{note_id}", response_model=NoteResponse)
async def update_note(alias: str, note_id: int, note_data: NoteUpdate, auth: AuthRequest, db: Session = Depends(get_db)) -> NoteResponse:
    user_service = UserService(db)
    note_service = NoteService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    note = note_service.get_note_by_id(note_id)
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Note {note_id} not found")
    if note_data.previous_hash and note.content_hash != note_data.previous_hash:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Note modified. Refresh.")
    return note_service.update_note(note_id, note_data, auth.password)


@router.delete("/{alias}/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(alias: str, note_id: int, auth: AuthRequest, db: Session = Depends(get_db)) -> None:
    user_service = UserService(db)
    note_service = NoteService(db)
    user = user_service.get_user_by_alias(alias)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{alias}' not found")
    if not user_service.verify_password(user, auth.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    note = note_service.get_note_by_id(note_id)
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Note {note_id} not found")
    note_service.delete_note(note_id)
