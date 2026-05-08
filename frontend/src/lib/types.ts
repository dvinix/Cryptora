export interface User {
  id: number;
  alias: string;
  encrypted_alias: string;
  created_at: string;
  last_accessed_at: string;
}

export interface Folder {
  id: number;
  user_id: number;
  encrypted_name: string;
  color: string | null;
  icon: string | null;
  created_at: string;
}

export interface DecryptedFolder extends Folder {
  decrypted_name: string;
}

export interface Note {
  id: number;
  user_id: number;
  folder_id: number | null;
  encrypted_title: string | null;
  encrypted_content: string;
  content_hash: string;
  created_at: string;
  updated_at: string | null;
}

export interface DecryptedNote extends Note {
  decrypted_title: string | null;
  decrypted_content: string;
}

export interface LoginRequest {
  alias: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User | null;
  token?: string;
}

export interface RegisterRequest {
  alias: string;
  password: string;
}

export interface CreateFolderRequest {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  color?: string;
  icon?: string;
}

export interface CreateNoteRequest {
  title?: string;
  content: string;
  folder_id?: number;
}

export interface UpdateNoteRequest {
  title?: string;
  content: string;
  folder_id?: number;
  previous_hash?: string;
}

export interface AuthRequest {
  password: string;
}

export interface AuthContextType {
  user: User | null;
  password: string | null;
  token: string | null;
  login: (alias: string, password: string) => Promise<void>;
  register: (alias: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
