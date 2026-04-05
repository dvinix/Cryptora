import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Note,
  Folder,
  DecryptedNote,
  DecryptedFolder,
  CreateNoteRequest,
  UpdateNoteRequest,
  CreateFolderRequest,
  UpdateFolderRequest,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cryptora-backend-9ghj.onrender.com';
const API_PREFIX = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },
};

export const foldersApi = {
  createFolder: async (
    alias: string,
    password: string,
    data: CreateFolderRequest
  ): Promise<Folder> => {
    const response = await api.post(`/${alias}/folders?password=${password}`, data);
    return response.data;
  },

  getFolder: async (
    alias: string,
    folderId: number,
    password: string
  ): Promise<DecryptedFolder> => {
    const response = await api.get(`/${alias}/folders/${folderId}?password=${password}`);
    return response.data;
  },

  updateFolder: async (
    alias: string,
    folderId: number,
    password: string,
    data: UpdateFolderRequest
  ): Promise<Folder> => {
    const response = await api.put(`/${alias}/folders/${folderId}?password=${password}`, data);
    return response.data;
  },

  deleteFolder: async (alias: string, folderId: number, password: string): Promise<void> => {
    await api.delete(`/${alias}/folders/${folderId}?password=${password}`);
  },
};

export const notesApi = {
  getUserWithNotes: async (alias: string): Promise<{ user: User; notes: Note[]; folders: Folder[] }> => {
    const response = await api.get(`/${alias}`);
    return {
      user: {
        id: response.data.id,
        alias: response.data.alias,
        encrypted_alias: response.data.encrypted_alias,
        created_at: response.data.created_at,
        last_accessed_at: response.data.last_accessed_at,
      },
      notes: response.data.notes,
      folders: response.data.folders || [],
    };
  },

  createNote: async (
    alias: string,
    password: string,
    data: CreateNoteRequest
  ): Promise<Note> => {
    const response = await api.post(`/${alias}/notes?password=${password}`, data);
    return response.data;
  },

  getNote: async (
    alias: string,
    noteId: number,
    password: string
  ): Promise<DecryptedNote> => {
    const response = await api.get(`/${alias}/notes/${noteId}?password=${password}`);
    return response.data;
  },

  updateNote: async (
    alias: string,
    noteId: number,
    password: string,
    data: UpdateNoteRequest
  ): Promise<Note> => {
    const response = await api.put(`/${alias}/notes/${noteId}?password=${password}`, data);
    return response.data;
  },

  deleteNote: async (alias: string, noteId: number, password: string): Promise<void> => {
    await api.delete(`/${alias}/notes/${noteId}?password=${password}`);
  },
};
