/**
 * Typed route parameters for the mobile navigators.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

/** Top-level authentication and client routes. */
export type RootStackParamList = {
  Welcome: undefined;
  /**
   * `activatedEmail`: prefilled after activation.
   * `passwordUpdated`: set after password reset; `email` optionally prefills the address.
   */
  SignIn:
    | { activatedEmail?: string; passwordUpdated?: boolean; email?: string }
    | undefined;
  /** `codeRejected`: the code expired during password entry. */
  ActivationCode: { codeRejected?: boolean } | undefined;
  ActivationPassword: { activationCode: string };
  /** `renewal`: another reset link is needed. */
  ForgotPassword: { email?: string; renewal?: boolean } | undefined;
  PasswordResetSent: { email: string; renewal?: boolean };
  /** `token`: supplied by the password-reset link. */
  ResetPassword: { token?: string } | undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Routine: undefined;
  RoutineDay: { order: number };
  WorkoutSummary: { sessionId: string };
  WorkoutHistory: { from?: string; to?: string } | undefined;
  WorkoutDetail: { sessionId: string };
  Reminders: undefined;
};

/** Main client tabs. */
export type MainTabParamList = {
  Today: undefined;
  Progress: undefined;
  Profile: undefined;
};
