import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';
import type { User, AuthContextType } from '../lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('cryptora_user');
    const storedToken = sessionStorage.getItem('cryptora_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Note: Password is NOT persisted. User must re-enter on page refresh.
    }
  }, []);

  const login = async (alias: string, pwd: string) => {
    const response = await authApi.login({ alias, password: pwd });
    if (response.success && response.user && response.token) {
      setUser(response.user);
      setPassword(pwd);
      setToken(response.token);
      sessionStorage.setItem('cryptora_user', JSON.stringify(response.user));
      sessionStorage.setItem('cryptora_token', response.token);
      // Password is stored in memory only (not persisted to storage)
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (alias: string, pwd: string) => {
    // Register the user
    const user = await authApi.register({ alias, password: pwd });
    setUser(user);
    setPassword(pwd);
    sessionStorage.setItem('cryptora_user', JSON.stringify(user));
    
    // Auto-login after registration to get JWT token
    const loginResponse = await authApi.login({ alias, password: pwd });
    if (loginResponse.token) {
      setToken(loginResponse.token);
      sessionStorage.setItem('cryptora_token', loginResponse.token);
    }
  };

  const logout = () => {
    setUser(null);
    setPassword(null);
    setToken(null);
    sessionStorage.removeItem('cryptora_user');
    sessionStorage.removeItem('cryptora_token');
    // Password and token already cleared from memory
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        password,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!password && !!token,
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
