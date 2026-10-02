/** Primer nombre para el saludo, p. ej. "Diego Paredes" → "Diego". */
export const firstNameOf = (fullName: string) =>
  fullName.trim().split(/\s+/)[0] ?? '';
