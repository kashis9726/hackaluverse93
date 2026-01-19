import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const API_BASE = 'https://backend99-eoqn.onrender.com/api';


  const REQUEST_TIMEOUT_MS = 30000;

  const normalizeUser = (u: User): User => {
    return {
      ...u,
      points: typeof (u as any).points === 'number' ? (u as any).points : 0,
      badges: Array.isArray((u as any).badges) ? (u as any).badges : [],
    };
  };

  const getToken = (): string | null => {
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  };

  const setToken = (token: string | null) => {
    try {
      if (!token) localStorage.removeItem('authToken');
      else localStorage.setItem('authToken', token);
    } catch { }
  };

  const apiFetch = async (path: string, init?: RequestInit) => {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init?.headers ? (init.headers as any) : {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const url = path.startsWith('http')
      ? path
      : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    if (init?.signal) {
      init.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      return await fetch(url, { ...init, headers, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const adminLogin = async (email: string): Promise<boolean> => {
    try {
      const res = await apiFetch('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        try {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message || 'Not allowed');
        } catch (e) {
          throw e instanceof Error ? e : new Error('Not allowed');
        }
      }

      const data = (await res.json()) as { user?: User; token?: string };
      if (!data.user || !data.token) {
        throw new Error('Login failed');
      }

      setToken(data.token);
      setUser(normalizeUser(data.user));
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const boot = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await apiFetch('/auth/me');
        if (!res.ok) {
          setToken(null);
          setUser(null);
          return;
        }
        const data = (await res.json()) as { user?: User };
        if (!data.user) {
          setToken(null);
          setUser(null);
          return;
        }
        setUser(normalizeUser(data.user));
      } catch {
        // ignore boot errors
      }
    };
    void boot();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        try {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message || 'Login failed');
        } catch (e) {
          throw e instanceof Error ? e : new Error('Login failed');
        }
      }

      const data = (await res.json()) as { user?: User; token?: string };
      if (!data.user || !data.token) return false;

      setToken(data.token);
      setUser(normalizeUser(data.user));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    try {
      const role = (userData.role || 'student') as User['role'];
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          role,
          password: userData.password,
        }),
      });
      if (!res.ok) {
        try {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message || 'Signup failed');
        } catch (e) {
          throw e instanceof Error ? e : new Error('Signup failed');
        }
      }

      const data = (await res.json()) as { user?: User; token?: string };
      if (!data.user || !data.token) return false;

      setToken(data.token);
      setUser(normalizeUser(data.user));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = normalizeUser({ ...user, ...updates } as User);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
