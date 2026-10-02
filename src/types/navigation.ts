/** Pantallas de primer nivel: acceso a la app y pestañas principales. */
export type RootStackParamList = {
  Welcome: undefined;
  /**
   * `activatedEmail`: llega al terminar la activación, para precargar el correo.
   * `passwordUpdated`: llega al crear una nueva contraseña; `email` precarga el correo si se conoce.
   */
  SignIn:
    | { activatedEmail?: string; passwordUpdated?: boolean; email?: string }
    | undefined;
  /** `codeRejected`: el código dejó de servir mientras se creaba la contraseña. */
  ActivationCode: { codeRejected?: boolean } | undefined;
  ActivationPassword: { activationCode: string };
  /** `renewal`: se pide un enlace otra vez porque el anterior venció o ya se usó. */
  ForgotPassword: { email?: string; renewal?: boolean } | undefined;
  PasswordResetSent: { email: string; renewal?: boolean };
  /** `token`: llega en el enlace del correo (`…/password-reset?token=…`). */
  ResetPassword: { token?: string } | undefined;
  Main: undefined;
};

/** Pestañas principales de la app (MVP: Hoy, Progreso, Perfil · TB2 agrega Escanear). */
export type MainTabParamList = {
  Today: undefined;
  Progress: undefined;
  Profile: undefined;
};
