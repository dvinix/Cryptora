import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';
import type { User, AuthContextType } from '../lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('cryptora_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Note: Password is NOT persisted. User must re-enter on page refresh.
    }
  }, []);

  const login = async (alias: string, pwd: string) => {
    const response = await authApi.login({ alias, password: pwd });
    if (response.success && response.user) {
      setUser(response.user);
      setPassword(pwd);
      sessionStorage.setItem('cryptora_user', JSON.stringify(response.user));
      // Password is stored in memory only (not persisted to storage)
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (alias: string, pwd: string) => {
    const user = await authApi.register({ alias, password: pwd });
    setUser(user);
    setPassword(pwd);
    sessionStorage.setItem('cryptora_user', JSON.stringify(user));
    // Password is stored in memory only (not persisted to storage)
  };

  const logout = () => {
    setUser(null);
    setPassword(null);
    sessionStorage.removeItem('cryptora_user');
    // Password already cleared from memory
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        password,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!password,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
