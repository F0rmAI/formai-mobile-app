/**
 * Spanish date and time formatters.
 *
 * @author Carlos
 * @packageDocumentation
 */

const WEEKDAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Formats a local time in 24-hour `HH:mm` form.
 *
 * @param date - Local date whose time is displayed.
 * @returns The hour and minute with leading zeros.
 *
 * @example
 * ```ts
 * formatTime(new Date(2026, 9, 2, 7, 5)); // '07:05'
 * ```
 */
export function formatTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Formats a local date with its weekday and month in Spanish.
 *
 * @param date - Local calendar date to display.
 * @returns The weekday, day and month without a year.
 *
 * @example
 * ```ts
 * formatLongDate(new Date(2026, 8, 17)); // 'Jueves 17 de septiembre'
 * ```
 */
export function formatLongDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${
    MONTHS[date.getMonth()]
  }`;
}

/**
 * Formats a workout calendar date for the history list or detail view.
 *
 * @param isoDate - Local calendar date in `yyyy-MM-dd` form.
 * @param display - History list or full detail format.
 * @returns The date with a Spanish weekday and month.
 *
 * @example
 * ```ts
 * formatWorkoutHistoryDate('2026-10-02', 'list'); // 'Viernes 2 oct'
 * ```
 */
export function formatWorkoutHistoryDate(
  isoDate: string,
  display: 'list' | 'detail',
) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const prefix = `${WEEKDAYS[date.getDay()]} ${date.getDate()}`;
  return display === 'list'
    ? `${prefix} ${MONTHS[date.getMonth()].slice(0, 3)}`
    : `${prefix} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}
