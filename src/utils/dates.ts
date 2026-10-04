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

/**
 * Formats an inclusive ISO date range for history chips.
 *
 * @param from - Inclusive start in `yyyy-MM-dd`.
 * @param to - Inclusive end in `yyyy-MM-dd`.
 * @returns Compact Spanish range such as `1 – 13 sep 2026`.
 */
export function formatDateRangeChip(from: string, to: string) {
  const parse = (iso: string) => {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const start = parse(from);
  const end = parse(to);
  const short = (date: Date, withYear: boolean) => {
    const month = MONTHS[date.getMonth()].slice(0, 3);
    return withYear
      ? `${date.getDate()} ${month} ${date.getFullYear()}`
      : `${date.getDate()} ${month}`;
  };
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} ${MONTHS[
        end.getMonth()
      ].slice(0, 3)} ${end.getFullYear()}`;
    }
    return `${short(start, false)} – ${short(end, true)}`;
  }
  return `${short(start, true)} – ${short(end, true)}`;
}

/** Converts a valid `dd/mm/yyyy` or `yyyy-mm-dd` filter entry to an ISO date. */
export function parseFilterDate(value: string) {
  const parts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const iso = parts ? `${parts[3]}-${parts[2]}-${parts[1]}` : value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? iso
    : undefined;
}

/** Formats an ISO date for the filter dialog. */
export function formatFilterInputDate(iso?: string) {
  return iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '';
}
