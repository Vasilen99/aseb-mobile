import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import * as authService from './authService';
import { clearSession, loadSession, saveSession, type AuthUser } from './storage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True while restoring the session on app start. */
  isLoading: boolean;
  login: (credentials: authService.LoginCredentials) => Promise<void>;
  register: (credentials: authService.RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore persisted session on mount
  useEffect(() => {
    loadSession()
      .then(session => setUser(session?.user ?? null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (credentials: authService.LoginCredentials) => {
    const session = await authService.login(credentials);
    await saveSession(session);
    setUser(session.user);
  }, []);

  const register = useCallback(async (credentials: authService.RegisterCredentials) => {
    const session = await authService.register(credentials);
    await saveSession(session);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
