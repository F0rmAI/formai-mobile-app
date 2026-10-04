/**
 * Shared authentication and client profile state.
 *
 * @author Carlos
 * @packageDocumentation
 */

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
import { setUnauthorizedHandler } from '@/services/api-client';
import { clientProfileService } from '@/services/client-profile.service';
import type { AuthenticatedUser, SignInInput } from '@/types/auth';
import type { ClientProfile } from '@/types/client-profile';

/** Authentication phase during restoration or normal use. */
export type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  /** Reason shown when a previously valid session expires. */
  signOutReason?: 'expired';
  user?: AuthenticatedUser;
  /** Profile while available after sign-in. */
  profile?: ClientProfile;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** Provides cookie-backed authentication state to the application. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<AuthenticatedUser>();
  const [profile, setProfile] = useState<ClientProfile>();
  const [signOutReason, setSignOutReason] = useState<'expired'>();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (status === 'signedIn') {
        setSignOutReason('expired');
      }
      setUser(undefined);
      setProfile(undefined);
      setStatus('signedOut');
    });
    return () => setUnauthorizedHandler();
  }, [status]);

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

  // The sign-in response has no name, so load the profile separately.
  useEffect(() => {
    if (status !== 'signedIn') {
      setProfile(undefined);
      return;
    }
    if (profile) {
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
  }, [status, profile]);

  const signIn = useCallback(async (input: SignInInput) => {
    setSignOutReason(undefined);
    const authenticated = await authService.signIn(input);
    const confirmedProfile = await authService.confirmSession();
    setProfile(confirmedProfile);
    setUser(authenticated);
    setStatus('signedIn');
  }, []);

  // Only the backend can clear the cookies; keep local state if sign-out fails.
  const signOut = useCallback(async () => {
    await authService.signOut();
    setSignOutReason(undefined);
    setUser(undefined);
    setStatus('signedOut');
  }, []);

  const value = useMemo(
    () => ({ status, signOutReason, user, profile, signIn, signOut }),
    [status, signOutReason, user, profile, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Reads the current authentication state. */
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return value;
}
