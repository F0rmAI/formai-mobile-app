/** Respuesta al verificar un código: sigue vigente hasta `expiresAt`. */
export interface ActivationCodeVerification {
  expiresAt: string;
}

export interface ActivateAccountInput {
  activationCode: string;
  /** Correo que elige el cliente: con él iniciará sesión siempre. */
  email: string;
  password: string;
  consentAccepted: boolean;
  /** Versión del texto de consentimiento que se mostró al cliente. */
  consentVersion: string;
}

/** Cuenta ya activada, tal como la devuelve el backend. */
export interface AccountActivation {
  userId: string;
  status: string;
  activatedAt: string;
}
