/** Opening hours and daily schedules, computed in the venue's own timezone. */

export interface Interval {
  /** "HH:MM" local time. */
  open: string;
  /** "HH:MM" local time. "24:00" is midnight at the end of the day; a time at or before `open` runs past midnight. */
  close: string;
}

/** Seven days of intervals, Sunday first. */
export type WeeklyHours = readonly (readonly Interval[])[];

export interface ZonedParts {
  /** 0 is Sunday. */
  weekday: number;
  /** Minutes since local midnight. */
  minutes: number;
  /** Local calendar date, "YYYY-MM-DD". */
  date: string;
}

export type OpenStatus =
  | { state: 'always' }
  | { state: 'open'; until: number }
  | { state: 'opens'; day: 'today' | 'tomorrow' | number; at: number }
  | { state: 'closed' };

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

export function zonedParts(instant: Date, timeZone: string): ZonedParts {
  const parts = Object.fromEntries(
    formatterFor(timeZone)
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );
  return {
    weekday: WEEKDAYS.indexOf(parts.weekday ?? ''),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    date: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

export function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Opening spans as minutes of the week, merged where they touch. Ends may exceed one week. */
function weeklySpans(hours: WeeklyHours): [number, number][] {
  const spans: [number, number][] = [];
  hours.forEach((intervals, day) => {
    for (const { open, close } of intervals) {
      const start = day * MINUTES_PER_DAY + toMinutes(open);
      const closeMinutes = toMinutes(close);
      const length =
        closeMinutes > toMinutes(open)
          ? closeMinutes - toMinutes(open)
          : closeMinutes + MINUTES_PER_DAY - toMinutes(open);
      spans.push([start, start + length]);
    }
  });
  spans.sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const span of spans) {
    const last = merged.at(-1);
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1]);
    else merged.push([...span]);
  }
  const first = merged[0];
  const last = merged.at(-1);
  if (first && last && merged.length > 1 && last[1] >= first[0] + MINUTES_PER_WEEK) {
    last[1] = Math.max(last[1], first[1] + MINUTES_PER_WEEK);
    merged.shift();
  }
  return merged;
}

export function openStatus(hours: WeeklyHours, instant: Date, timeZone: string): OpenStatus {
  const spans = weeklySpans(hours);
  if (spans.length === 0) return { state: 'closed' };
  if (spans.some(([start, end]) => end - start >= MINUTES_PER_WEEK)) return { state: 'always' };

  const { weekday, minutes } = zonedParts(instant, timeZone);
  const now = weekday * MINUTES_PER_DAY + minutes;

  for (const [start, end] of spans) {
    for (const shift of [0, -MINUTES_PER_WEEK]) {
      if (now >= start + shift && now < end + shift) {
        return { state: 'open', until: (end + shift) % MINUTES_PER_DAY };
      }
    }
  }

  const next = spans.find(([start]) => start > now) ?? spans[0];
  if (!next) return { state: 'closed' };
  const nextDay = Math.floor(next[0] / MINUTES_PER_DAY);
  const daysAway = (nextDay - weekday + 7) % 7;
  const day = daysAway === 0 ? 'today' : daysAway === 1 ? 'tomorrow' : nextDay;
  return { state: 'opens', day, at: next[0] % MINUTES_PER_DAY };
}

export interface Recurring {
  id: string;
  /** "HH:MM" local times, every day. */
  times: readonly string[];
}

export interface Occurrence {
  id: string;
  /** Local calendar date, "YYYY-MM-DD". */
  date: string;
  /** "HH:MM" local time. */
  time: string;
}

/** The zone's UTC offset at an instant, as "+05:45", for `datetime` attributes. */
export function zoneOffset(instant: Date, timeZone: string): string {
  const name =
    new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(instant)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';
  return name === 'GMT' ? '+00:00' : name.replace('GMT', '');
}

function addDays(date: string, days: number): string {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return day.toISOString().slice(0, 10);
}

/** Every occurrence of daily items from now until the end of the given number of local days. */
export function upcoming(
  items: readonly Recurring[],
  instant: Date,
  timeZone: string,
  days: number,
): Occurrence[] {
  const today = zonedParts(instant, timeZone);
  const occurrences: Occurrence[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(today.date, offset);
    for (const item of items) {
      for (const time of item.times) {
        if (offset === 0 && toMinutes(time) < today.minutes) continue;
        occurrences.push({ id: item.id, date, time });
      }
    }
  }
  return occurrences.sort((a, b) =>
    a.date === b.date ? toMinutes(a.time) - toMinutes(b.time) : a.date < b.date ? -1 : 1,
  );
}
