import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '@/services/auth.service';
import type { AuthenticatedUser, SignInInput } from '@/types/auth';

/** `restoring`: aún no se sabe si el dispositivo conserva una sesión. */
export type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  user?: AuthenticatedUser;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<AuthenticatedUser>();

  useEffect(() => {
    let active = true;
    authService
      .refresh()
      .then(restored => {
        if (active) {
          setUser(restored);
          setStatus('signedIn');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('signedOut');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    setUser(await authService.signIn(input));
    setStatus('signedIn');
  }, []);

  // Solo el backend puede borrar las cookies: si la llamada falla, la sesión sigue abierta.
  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(undefined);
    setStatus('signedOut');
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return value;
}
