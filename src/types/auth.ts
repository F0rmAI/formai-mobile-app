export type AccountRole =
  | 'REGISTERED_USER'
  | 'ADMINISTRATOR'
  | 'TRAINER'
  | 'CLIENT';

/** Cuenta con sesión iniciada, tal como la devuelve el backend. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: AccountRole[];
  status: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface PasswordResetInput {
  /** Token de un solo uso que llega en el enlace del correo. */
  token: string;
  password: string;
}
