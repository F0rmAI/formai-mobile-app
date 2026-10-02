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
import { clientProfileService } from '@/services/client-profile.service';
import type { AuthenticatedUser, SignInInput } from '@/types/auth';
import type { ClientProfile } from '@/types/client-profile';

/** `restoring`: aún no se sabe si el dispositivo conserva una sesión. */
export type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  user?: AuthenticatedUser;
  /** Nombre y correo del cliente; sin definir mientras carga o si no se pudo obtener. */
  profile?: ClientProfile;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<AuthenticatedUser>();
  const [profile, setProfile] = useState<ClientProfile>();

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

  // El inicio de sesión no devuelve el nombre: se pide aparte al tener sesión. Si falla,
  // la app sigue funcionando sin nombre.
  useEffect(() => {
    if (status !== 'signedIn') {
      setProfile(undefined);
      return;
    }
    let active = true;
    clientProfileService
      .getMine()
      .then(loaded => {
        if (active) {
          setProfile(loaded);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [status]);

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
    () => ({ status, user, profile, signIn, signOut }),
    [status, user, profile, signIn, signOut],
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
