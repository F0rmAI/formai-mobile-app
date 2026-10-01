/** Pantallas de primer nivel: acceso a la app y pestañas principales. */
export type RootStackParamList = {
  Welcome: undefined;
  /** `activatedEmail`: llega al terminar la activación, para precargar el correo. */
  SignIn: { activatedEmail?: string } | undefined;
  /** `codeRejected`: el código dejó de servir mientras se creaba la contraseña. */
  ActivationCode: { codeRejected?: boolean } | undefined;
  ActivationPassword: { activationCode: string };
  Main: undefined;
};

/** Pestañas principales de la app (MVP: Hoy, Progreso, Perfil · TB2 agrega Escanear). */
export type MainTabParamList = {
  Today: undefined;
  Progress: undefined;
  Profile: undefined;
};
