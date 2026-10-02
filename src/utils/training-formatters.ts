function localDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

export function formatTrainingDate(isoDate: string) {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(localDate(isoDate));
}

export function formatRoutineStartDate(isoDate: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(localDate(isoDate));
}
