/**
 * Authentication and password reset types.
 *
 * @author Carlos
 * @packageDocumentation
 */

/** Roles assigned to an authenticated account. */
export type AccountRole =
  | 'REGISTERED_USER'
  | 'ADMINISTRATOR'
  | 'TRAINER'
  | 'CLIENT';

/** Describes the account returned after sign-in. */
export interface AuthenticatedUser {
  /** Stable account identifier. */
  id: string;
  /** Email used for sign-in. */
  email: string;
  /** Roles granted to the account. */
  roles: AccountRole[];
  /** Current account lifecycle status. */
  status: string;
}

/** Credentials submitted for client sign-in. */
export interface SignInInput {
  /** Email chosen at activation. */
  email: string;
  /** Account password. */
  password: string;
}

/** Credentials used to redeem a password-reset link. */
export interface PasswordResetInput {
  /** Single-use token from the email link. */
  token: string;
  /** New account password. */
  password: string;
}
