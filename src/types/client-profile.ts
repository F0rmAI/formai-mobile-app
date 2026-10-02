/** Datos propios del cliente con sesión iniciada, tal como los devuelve el backend. */
export interface ClientProfile {
  id: string;
  /** Nombre con el que el entrenador registró al cliente. */
  fullName: string;
  /** Correo que el cliente eligió al activar su cuenta. */
  email: string;
}
