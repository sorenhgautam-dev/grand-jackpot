import { toMinutes, type Interval } from './hours';
import { fill, intlLocale, type Locale } from './locale';

/** A wall-clock time ("HH:MM" or minutes after midnight) in the language's convention. */
export function formatTime(time: string | number, locale: Locale): string {
  const minutes = typeof time === 'number' ? time : toMinutes(time);
  const instant = new Date(Date.UTC(2000, 0, 1, Math.floor(minutes / 60), minutes % 60));
  return new Intl.DateTimeFormat(intlLocale[locale], {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(instant);
}

function utcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

/** A calendar date in full, for example "Monday 9 November". */
export function formatDateLong(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(utcDate(date));
}

/** A month ("YYYY-MM") by name, for example "November". */
export function formatMonth(month: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: 'long', timeZone: 'UTC' }).format(
    utcDate(`${month}-01`),
  );
}

/** A weekday by index (0 is Sunday) in full. */
export function formatWeekday(index: number, locale: Locale): string {
  // 2 January 2000 was a Sunday.
  const sunday = Date.UTC(2000, 0, 2);
  const dayMs = 24 * 60 * 60 * 1000;
  return new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'long', timeZone: 'UTC' }).format(
    new Date(sunday + index * dayMs),
  );
}

/** An E.164 Nepali mobile number grouped for reading, for example "+977 970 505 5910". */
export function formatPhone(e164: string): string {
  const match = /^\+977(\d{3})(\d{3})(\d{4})$/.exec(e164);
  return match ? `+977 ${match[1]} ${match[2]} ${match[3]}` : e164;
}

/** One day's opening, for example "Open 24 hours" or "12:00 pm to 4:00 am". */
export function formatIntervals(
  intervals: readonly Interval[],
  locale: Locale,
  labels: { allDay: string; closed: string; range: string },
): string {
  if (intervals.length === 0) return labels.closed;
  return intervals
    .map(({ open, close }) =>
      open === '00:00' && close === '24:00'
        ? labels.allDay
        : fill(labels.range, { from: formatTime(open, locale), to: formatTime(close, locale) }),
    )
    .join(', ');
}

/** A list joined with the language's conjunction, for example "8:00 pm and 2:00 am". */
export function formatList(items: readonly string[], locale: Locale): string {
  return new Intl.ListFormat(intlLocale[locale], { style: 'long', type: 'conjunction' }).format(
    items,
  );
}
