/**
 * Training date formatters.
 *
 * @author Melina
 * @packageDocumentation
 */

/** Keeps calendar dates stable across local time zones. */
function localDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

/**
 * Formats a workout date with its weekday in Peruvian Spanish.
 *
 * @param isoDate - Calendar date in `yyyy-MM-dd` form.
 * @returns The weekday, day and month for the workout.
 *
 * @example
 * ```ts
 * formatTrainingDate('2026-10-02'); // 'viernes, 2 de octubre'
 * ```
 */
export function formatTrainingDate(isoDate: string) {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(localDate(isoDate));
}

/**
 * Formats a routine start date in Peruvian Spanish.
 *
 * @param isoDate - Calendar date in `yyyy-MM-dd` form.
 * @returns The day, month and year of the routine start.
 *
 * @example
 * ```ts
 * formatRoutineStartDate('2026-10-02'); // '2 de octubre de 2026'
 * ```
 */
export function formatRoutineStartDate(isoDate: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(localDate(isoDate));
}
