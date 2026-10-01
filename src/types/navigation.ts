/** Pantallas de primer nivel: acceso a la app y pestañas principales. */
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Main: undefined;
};

/** Pestañas principales de la app (MVP: Hoy, Progreso, Perfil · TB2 agrega Escanear). */
export type MainTabParamList = {
  Today: undefined;
  Progress: undefined;
  Profile: undefined;
};
