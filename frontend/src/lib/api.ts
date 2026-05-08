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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for JWT token
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

// Request interceptor to add JWT token to all requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Authentication failed or token expired');
      setAuthToken(null);
    }
    throw error;
  }
);

export const authApi = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/login', data);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },
};

export const foldersApi = {
  createFolder: async (
    alias: string,
    password: string,
    data: CreateFolderRequest
  ): Promise<Folder> => {
    const response = await api.post(`/${alias}/folders`, {
      ...data,
      password,
    });
    return response.data;
  },

  getFolder: async (
    alias: string,
    folderId: number,
    password: string
  ): Promise<DecryptedFolder> => {
    const response = await api.post(`/${alias}/folders/${folderId}`, { password });
    return response.data;
  },

  updateFolder: async (
    alias: string,
    folderId: number,
    password: string,
    data: UpdateFolderRequest
  ): Promise<Folder> => {
    const response = await api.put(`/${alias}/folders/${folderId}`, {
      ...data,
      password,
    });
    return response.data;
  },

  deleteFolder: async (alias: string, folderId: number, password: string): Promise<void> => {
    await api.delete(`/${alias}/folders/${folderId}`, {
      data: { password },
    });
  },
};

export const notesApi = {
  // Fetch user with notes - requires password authentication in body
  getUserWithNotes: async (alias: string, password: string): Promise<{ user: User; notes: Note[]; folders: Folder[] }> => {
    const response = await api.post(`/${alias}/login`, { password });
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
    const response = await api.post(`/${alias}/notes`, {
      ...data,
      password,
    });
    return response.data;
  },

  getNote: async (
    alias: string,
    noteId: number,
    password: string
  ): Promise<DecryptedNote> => {
    const response = await api.post(`/${alias}/notes/${noteId}`, { password });
    return response.data;
  },

  updateNote: async (
    alias: string,
    noteId: number,
    password: string,
    data: UpdateNoteRequest
  ): Promise<Note> => {
    const response = await api.put(`/${alias}/notes/${noteId}`, {
      ...data,
      password,
    });
    return response.data;
  },

  deleteNote: async (alias: string, noteId: number, password: string): Promise<void> => {
    await api.delete(`/${alias}/notes/${noteId}`, {
      data: { password },
    });
  },
};
